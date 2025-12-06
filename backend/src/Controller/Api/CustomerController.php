<?php

namespace App\Controller\Api;

use App\Entity\Customer;
use App\Entity\Vehicle;
use App\Repository\CustomerRepository;
use App\Repository\VehicleRepository;
use App\Service\Api\ResourceFormatter;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Http\Attribute\IsGranted;
use Symfony\Component\Uid\Uuid;
use Symfony\Component\Validator\Constraints as Assert;
use Symfony\Component\Validator\Validator\ValidatorInterface;

#[Route('/api/customers')]
#[IsGranted('ROLE_USER')]
class CustomerController extends ApiController
{
    #[Route('', name: 'api_customers_index', methods: ['GET'])]
    public function index(CustomerRepository $customerRepository, ResourceFormatter $formatter): JsonResponse
    {
        $customers = array_map(
            fn(Customer $customer) => $formatter->formatCustomer($customer),
            $customerRepository->findAll()
        );

        return $this->jsonResponse($customers);
    }

    #[Route('', name: 'api_customers_create', methods: ['POST'])]
    public function create(
        Request $request,
        EntityManagerInterface $entityManager,
        ValidatorInterface $validator,
        ResourceFormatter $formatter,
    ): JsonResponse {
        $payload = $this->decodeJson($request);

        $violations = $validator->validate($payload, new Assert\Collection([
            'name' => [new Assert\NotBlank(), new Assert\Type('string')],
            'address' => new Assert\Optional(new Assert\Type('string')),
            'vehicles' => new Assert\Optional(new Assert\Type('array')),
        ]));

        if (\count($violations) > 0) {
            return $this->validationErrorResponse($violations);
        }

        $customer = (new Customer())
            ->setName($payload['name'])
            ->setAddress($payload['address'] ?? null);

        foreach ($payload['vehicles'] ?? [] as $vehiclePayload) {
            $vehicle = $this->hydrateVehicle(new Vehicle(), $vehiclePayload);
            $customer->addVehicle($vehicle);
        }

        $entityManager->persist($customer);
        $entityManager->flush();

        return $this->jsonResponse($formatter->formatCustomer($customer), JsonResponse::HTTP_CREATED);
    }

    #[Route('/{id}', name: 'api_customers_show', methods: ['GET'])]
    public function show(string $id, CustomerRepository $customerRepository, ResourceFormatter $formatter): JsonResponse
    {
        $customer = $this->findCustomerOr404($customerRepository, $id);

        return $this->jsonResponse($formatter->formatCustomer($customer));
    }

    #[Route('/{id}', name: 'api_customers_update', methods: ['PATCH'])]
    public function update(
        string $id,
        Request $request,
        CustomerRepository $customerRepository,
        EntityManagerInterface $entityManager,
        ValidatorInterface $validator,
        ResourceFormatter $formatter,
    ): JsonResponse {
        $customer = $this->findCustomerOr404($customerRepository, $id);
        $payload = $this->decodeJson($request);

        $violations = $validator->validate($payload, new Assert\Collection([
            'name' => new Assert\Optional([new Assert\NotBlank(), new Assert\Type('string')]),
            'address' => new Assert\Optional(new Assert\Type('string')),
            'vehicles' => new Assert\Optional(new Assert\Type('array')),
        ]));

        if (\count($violations) > 0) {
            return $this->validationErrorResponse($violations);
        }

        if (array_key_exists('name', $payload)) {
            $customer->setName($payload['name']);
        }

        if (array_key_exists('address', $payload)) {
            $customer->setAddress($payload['address']);
        }

        if (array_key_exists('vehicles', $payload) && \is_array($payload['vehicles'])) {
            foreach ($customer->getVehicles()->toArray() as $existingVehicle) {
                $customer->removeVehicle($existingVehicle);
            }
            foreach ($payload['vehicles'] as $vehiclePayload) {
                $vehicle = $this->hydrateVehicle(new Vehicle(), $vehiclePayload);
                $customer->addVehicle($vehicle);
            }
        }

        $entityManager->flush();

        return $this->jsonResponse($formatter->formatCustomer($customer));
    }

    #[Route('/{id}', name: 'api_customers_delete', methods: ['DELETE'])]
    public function delete(
        string $id,
        CustomerRepository $customerRepository,
        EntityManagerInterface $entityManager,
    ): JsonResponse {
        $customer = $this->findCustomerOr404($customerRepository, $id);
        $entityManager->remove($customer);
        $entityManager->flush();

        return $this->jsonResponse(null, JsonResponse::HTTP_NO_CONTENT);
    }

    #[Route('/{id}/vehicles', name: 'api_customers_add_vehicle', methods: ['POST'])]
    public function addVehicle(
        string $id,
        Request $request,
        CustomerRepository $customerRepository,
        EntityManagerInterface $entityManager,
        ValidatorInterface $validator,
        ResourceFormatter $formatter,
    ): JsonResponse {
        $customer = $this->findCustomerOr404($customerRepository, $id);
        $payload = $this->decodeJson($request);

        $violations = $validator->validate($payload, new Assert\Collection([
            'rego' => new Assert\Optional(new Assert\Type('string')),
            'odo' => new Assert\Optional(new Assert\Type('string')),
            'desc' => new Assert\Optional(new Assert\Type('string')),
        ]));

        if (\count($violations) > 0) {
            return $this->validationErrorResponse($violations);
        }

        $vehicle = $this->hydrateVehicle(new Vehicle(), $payload);
        $customer->addVehicle($vehicle);
        $entityManager->flush();

        return $this->jsonResponse($formatter->formatVehicle($vehicle), JsonResponse::HTTP_CREATED);
    }

    #[Route('/{customerId}/vehicles/{vehicleId}', name: 'api_customers_update_vehicle', methods: ['PATCH'])]
    public function updateVehicle(
        string $customerId,
        string $vehicleId,
        Request $request,
        CustomerRepository $customerRepository,
        VehicleRepository $vehicleRepository,
        EntityManagerInterface $entityManager,
        ValidatorInterface $validator,
        ResourceFormatter $formatter,
    ): JsonResponse {
        $customer = $this->findCustomerOr404($customerRepository, $customerId);
        $vehicle = $this->findVehicleOr404($vehicleRepository, $vehicleId, $customer);

        $payload = $this->decodeJson($request);

        $violations = $validator->validate($payload, new Assert\Collection([
            'rego' => new Assert\Optional(new Assert\Type('string')),
            'odo' => new Assert\Optional(new Assert\Type('string')),
            'desc' => new Assert\Optional(new Assert\Type('string')),
        ]));

        if (\count($violations) > 0) {
            return $this->validationErrorResponse($violations);
        }

        $this->hydrateVehicle($vehicle, $payload);
        $entityManager->flush();

        return $this->jsonResponse($formatter->formatVehicle($vehicle));
    }

    #[Route('/{customerId}/vehicles/{vehicleId}', name: 'api_customers_delete_vehicle', methods: ['DELETE'])]
    public function deleteVehicle(
        string $customerId,
        string $vehicleId,
        CustomerRepository $customerRepository,
        VehicleRepository $vehicleRepository,
        EntityManagerInterface $entityManager,
    ): JsonResponse {
        $customer = $this->findCustomerOr404($customerRepository, $customerId);
        $vehicle = $this->findVehicleOr404($vehicleRepository, $vehicleId, $customer);

        $entityManager->remove($vehicle);
        $entityManager->flush();

        return $this->jsonResponse(null, JsonResponse::HTTP_NO_CONTENT);
    }

    private function findCustomerOr404(CustomerRepository $repository, string $id): Customer
    {
        $uuid = Uuid::fromString($id);
        $customer = $repository->find($uuid);

        if (null === $customer) {
            throw $this->createNotFoundException(sprintf('Customer %s not found', $id));
        }

        return $customer;
    }

    private function findVehicleOr404(VehicleRepository $repository, string $vehicleId, Customer $customer): Vehicle
    {
        $uuid = Uuid::fromString($vehicleId);
        $vehicle = $repository->find($uuid);

        if (null === $vehicle || !$vehicle->getCustomer()?->getId()->equals($customer->getId())) {
            throw $this->createNotFoundException(sprintf('Vehicle %s not found', $vehicleId));
        }

        return $vehicle;
    }

    /**
     * @param array<string, mixed> $payload
     */
    private function hydrateVehicle(Vehicle $vehicle, array $payload): Vehicle
    {
        if (array_key_exists('rego', $payload)) {
            $vehicle->setRego($payload['rego']);
        }

        if (array_key_exists('odo', $payload)) {
            $vehicle->setOdo($payload['odo']);
        }

        if (array_key_exists('desc', $payload)) {
            $vehicle->setDescription($payload['desc']);
        }

        return $vehicle;
    }
}

