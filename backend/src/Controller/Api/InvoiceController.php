<?php

namespace App\Controller\Api;

use App\Entity\Invoice;
use App\Entity\InvoiceLineItem;
use App\Entity\Customer;
use App\Entity\Vehicle;
use App\Repository\CustomerRepository;
use App\Repository\InvoiceRepository;
use App\Service\Api\ResourceFormatter;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Http\Attribute\IsGranted;
use Symfony\Component\Uid\Uuid;
use Symfony\Component\Validator\Constraints as Assert;
use Symfony\Component\Validator\Validator\ValidatorInterface;

#[Route('/api/invoices')]
#[IsGranted('ROLE_USER')]
class InvoiceController extends ApiController
{
    #[Route('', name: 'api_invoices_index', methods: ['GET'])]
    public function index(InvoiceRepository $repository, ResourceFormatter $formatter): JsonResponse
    {
        $invoices = $repository->findBy([], ['issuedOn' => 'DESC', 'createdAt' => 'DESC']);
        $data = array_map(fn($invoice) => $formatter->formatInvoice($invoice), $invoices);
        
        return $this->jsonResponse($data);
    }

    #[Route('', name: 'api_invoices_create', methods: ['POST'])]
    public function create(
        Request $request,
        EntityManagerInterface $entityManager,
        ValidatorInterface $validator,
        CustomerRepository $customerRepository,
        ResourceFormatter $formatter,
    ): JsonResponse {
        $payload = $this->decodeJson($request);

        $violations = $validator->validate($payload, new Assert\Collection([
            'customerId' => new Assert\Optional(new Assert\Uuid()),
            'customerName' => [new Assert\NotBlank(), new Assert\Type('string')],
            'customerAddress' => new Assert\Optional(new Assert\Type('string')),
            'vehicleRego' => new Assert\Optional(new Assert\Type('string')),
            'vehicleOdo' => new Assert\Optional(new Assert\Type('string')),
            'vehicleDesc' => new Assert\Optional(new Assert\Type('string')),
            'lineItems' => [
                new Assert\NotBlank(),
                new Assert\Type('array'),
                new Assert\Count(min: 1),
            ],
            'date' => new Assert\Optional(new Assert\Date()),
            'status' => new Assert\Optional(new Assert\Type('string')),
        ]));

        if (\count($violations) > 0) {
            return $this->validationErrorResponse($violations);
        }

        $invoice = (new Invoice())
            ->setInvoiceNumber($this->generateInvoiceNumber($entityManager))
            ->setCustomerName($payload['customerName'])
            ->setCustomerAddress($payload['customerAddress'] ?? null)
            ->setVehicleRego($payload['vehicleRego'] ?? null)
            ->setVehicleOdo($payload['vehicleOdo'] ?? null)
            ->setVehicleDesc($payload['vehicleDesc'] ?? null)
            ->setIssuedOn(
                isset($payload['date']) ? new \DateTimeImmutable($payload['date']) : new \DateTimeImmutable('today')
            );

        if (isset($payload['status'])) {
            $invoice->setStatus($payload['status']);
        }

        // Handle customer - either link existing or create new
        if (!empty($payload['customerId'])) {
            // Link existing customer
            $customer = $customerRepository->find(Uuid::fromString($payload['customerId']));
            if ($customer) {
                $invoice->setCustomer($customer);
            }
        } elseif (!empty($payload['customerName'])) {
            // Create new customer
            $customer = new Customer();
            $customer->setName($payload['customerName']);
            if (!empty($payload['customerAddress'])) {
                $customer->setAddress($payload['customerAddress']);
            }
            
            // Create new vehicle if vehicle details provided
            if (!empty($payload['vehicleRego']) || !empty($payload['vehicleDesc'])) {
                $vehicle = new Vehicle();
                if (!empty($payload['vehicleRego'])) {
                    $vehicle->setRego($payload['vehicleRego']);
                }
                if (!empty($payload['vehicleOdo'])) {
                    $vehicle->setOdo($payload['vehicleOdo']);
                }
                if (!empty($payload['vehicleDesc'])) {
                    $vehicle->setDescription($payload['vehicleDesc']);
                }
                $vehicle->setCustomer($customer);
                $customer->getVehicles()->add($vehicle);
                $entityManager->persist($vehicle);
            }
            
            $entityManager->persist($customer);
            $invoice->setCustomer($customer);
        }

        $lineViolations = $this->validateLineItems($payload['lineItems'], $validator);
        if ($lineViolations) {
            return $lineViolations;
        }

        foreach ($payload['lineItems'] as $index => $linePayload) {
            $lineItem = $this->hydrateLineItem(new InvoiceLineItem(), $linePayload, $index);
            $invoice->addLineItem($lineItem);
        }

        $entityManager->persist($invoice);
        $entityManager->flush();

        return $this->jsonResponse($formatter->formatInvoice($invoice), JsonResponse::HTTP_CREATED);
    }

    #[Route('/{id}', name: 'api_invoices_show', methods: ['GET'])]
    public function show(string $id, InvoiceRepository $repository, ResourceFormatter $formatter): JsonResponse
    {
        $invoice = $repository->find(Uuid::fromString($id));
        if (null === $invoice) {
            throw $this->createNotFoundException(sprintf('Invoice %s not found', $id));
        }

        return $this->jsonResponse($formatter->formatInvoice($invoice));
    }

    #[Route('/{id}', name: 'api_invoices_update', methods: ['PUT'])]
    public function update(
        string $id,
        Request $request,
        EntityManagerInterface $entityManager,
        ValidatorInterface $validator,
        CustomerRepository $customerRepository,
        InvoiceRepository $repository,
        ResourceFormatter $formatter
    ): JsonResponse {
        $invoice = $repository->find(Uuid::fromString($id));
        if (null === $invoice) {
            throw $this->createNotFoundException(sprintf('Invoice %s not found', $id));
        }

        $payload = $this->decodeJson($request);

        $violations = $validator->validate($payload, new Assert\Collection([
            'customerId' => new Assert\Optional([new Assert\Type('string')]), // Allow string or null
            'customerName' => [new Assert\NotBlank(), new Assert\Type('string')],
            'customerAddress' => new Assert\Optional([new Assert\Type('string')]),
            'vehicleRego' => new Assert\Optional([new Assert\Type('string')]),
            'vehicleOdo' => new Assert\Optional([new Assert\Type('string')]),
            'vehicleDesc' => new Assert\Optional([new Assert\Type('string')]),
            'lineItems' => [
                new Assert\NotBlank(),
                new Assert\Type('array'),
                new Assert\Count(min: 1),
            ],
            'date' => new Assert\Optional([new Assert\Type('string')]),
            'status' => new Assert\Optional([new Assert\Type('string')]),
            'invoiceNumber' => new Assert\Optional([new Assert\Type('string')]),
        ]));

        if (\count($violations) > 0) {
            return $this->validationErrorResponse($violations);
        }

        $invoice
            ->setCustomerName($payload['customerName'])
            ->setCustomerAddress($payload['customerAddress'] ?? null)
            ->setVehicleRego($payload['vehicleRego'] ?? null)
            ->setVehicleOdo($payload['vehicleOdo'] ?? null)
            ->setVehicleDesc($payload['vehicleDesc'] ?? null);

        if (isset($payload['date'])) {
            $invoice->setIssuedOn(new \DateTimeImmutable($payload['date']));
        }
        
        if (isset($payload['status'])) {
            $invoice->setStatus($payload['status']);
        }

        if (!empty($payload['customerId'])) {
            $customer = $customerRepository->find(Uuid::fromString($payload['customerId']));
            if ($customer) {
                $invoice->setCustomer($customer);
            }
        }

        $lineViolations = $this->validateLineItems($payload['lineItems'], $validator);
        if ($lineViolations) {
            return $lineViolations;
        }

        // Reconcile Line Items
        // 1. Get existing line items
        $existingItems = [];
        foreach ($invoice->getLineItems() as $item) {
            $existingItems[$item->getId()->toRfc4122()] = $item;
        }

        // 2. Process payload
        foreach ($payload['lineItems'] as $index => $linePayload) {
            if (isset($linePayload['id']) && isset($existingItems[$linePayload['id']])) {
                // Update existing
                $lineItem = $existingItems[$linePayload['id']];
                $this->hydrateLineItem($lineItem, $linePayload, $index);
                unset($existingItems[$linePayload['id']]); // Mark as processed
            } else {
                // Create new
                $lineItem = $this->hydrateLineItem(new InvoiceLineItem(), $linePayload, $index);
                $invoice->addLineItem($lineItem);
            }
        }

        // 3. Remove remaining (deleted) items
        foreach ($existingItems as $itemToRemove) {
            $invoice->removeLineItem($itemToRemove);
            $entityManager->remove($itemToRemove);
        }

        $entityManager->flush();

        return $this->jsonResponse($formatter->formatInvoice($invoice));
    }

    /**
     * @param array<int, array<string, mixed>> $lineItems
     */
    private function validateLineItems(array $lineItems, ValidatorInterface $validator): ?JsonResponse
    {
        $lineConstraint = new Assert\Collection([
            'id' => new Assert\Optional(new Assert\Uuid()),
            'description' => [new Assert\NotBlank(), new Assert\Type('string')],
            'quantity' => new Assert\Optional([new Assert\Type('numeric')]),
            'price' => new Assert\Optional([new Assert\Type('numeric')]),
            'included' => new Assert\Optional(new Assert\Type('bool')),
            'includedBy' => new Assert\Optional(new Assert\Type('string')),
            'isChecklist' => new Assert\Optional(new Assert\Type('bool')),
        ]);

        foreach ($lineItems as $index => $lineItem) {
            $violations = $validator->validate($lineItem, $lineConstraint);
            if (\count($violations) > 0) {
                return $this->validationErrorResponse($violations);
            }
        }

        return null;
    }

    /**
     * @param array<string, mixed> $payload
     */
    private function hydrateLineItem(InvoiceLineItem $lineItem, array $payload, int $position): InvoiceLineItem
    {
        $lineItem
            ->setDescription($payload['description'])
            ->setPosition($position);

        if (array_key_exists('quantity', $payload) && $payload['quantity'] !== null && $payload['quantity'] !== '') {
            $lineItem->setQuantity($this->asMoney($payload['quantity']));
        }
        if (array_key_exists('price', $payload) && $payload['price'] !== null && $payload['price'] !== '') {
            $lineItem->setPrice($this->asMoney($payload['price']));
        }
        if (array_key_exists('included', $payload)) {
            $lineItem->setIncluded((bool) $payload['included']);
        }
        if (array_key_exists('isChecklist', $payload)) {
            $lineItem->setIsChecklist((bool) $payload['isChecklist']);
        }
        if (array_key_exists('includedBy', $payload)) {
            $lineItem->setIncludedByServiceId($payload['includedBy']);
        }

        return $lineItem;
    }

    private function generateInvoiceNumber(EntityManagerInterface $entityManager): string
    {
        $today = new \DateTimeImmutable('today');
        $dateStr = $today->format('Ymd');
        
        // Count invoices created today
        $qb = $entityManager->createQueryBuilder();
        $count = $qb->select('COUNT(i.id)')
            ->from(Invoice::class, 'i')
            ->where('i.issuedOn >= :startOfDay')
            ->andWhere('i.issuedOn < :endOfDay')
            ->setParameter('startOfDay', $today)
            ->setParameter('endOfDay', $today->modify('+1 day'))
            ->getQuery()
            ->getSingleScalarResult();
        
        $dailyNumber = $count + 1;
        
        do {
            $invoiceNumber = sprintf('%02d%s', $dailyNumber, $dateStr);
            $exists = $entityManager->getRepository(Invoice::class)->findOneBy(['invoiceNumber' => $invoiceNumber]);
            if ($exists) {
                $dailyNumber++;
            }
        } while ($exists);
        
        return $invoiceNumber;
    }

    private function asMoney(float|int|string $value): string
    {
        return number_format((float) $value, 2, '.', '');
    }
}

