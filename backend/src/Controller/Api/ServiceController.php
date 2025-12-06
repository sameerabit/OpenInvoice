<?php

namespace App\Controller\Api;

use App\Entity\Service;
use App\Repository\ProductRepository;
use App\Repository\ServiceRepository;
use App\Service\Api\ResourceFormatter;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Http\Attribute\IsGranted;
use Symfony\Component\Uid\Uuid;
use Symfony\Component\Validator\Constraints as Assert;
use Symfony\Component\Validator\Validator\ValidatorInterface;

#[Route('/api/services')]
#[IsGranted('ROLE_USER')]
class ServiceController extends ApiController
{
    #[Route('', name: 'api_services_index', methods: ['GET'])]
    public function index(ServiceRepository $repository, ResourceFormatter $formatter): JsonResponse
    {
        $services = array_map(
            fn(Service $service) => $formatter->formatService($service),
            $repository->findAll()
        );

        return $this->jsonResponse($services);
    }

    #[Route('', name: 'api_services_create', methods: ['POST'])]
    public function create(
        Request $request,
        EntityManagerInterface $entityManager,
        ValidatorInterface $validator,
        ProductRepository $productRepository,
        ResourceFormatter $formatter,
    ): JsonResponse {
        $payload = $this->decodeJson($request);
        $violations = $validator->validate($payload, new Assert\Collection([
            'description' => [new Assert\NotBlank(), new Assert\Type('string')],
            'price' => [new Assert\NotBlank(), new Assert\Type('numeric'), new Assert\PositiveOrZero()],
            'checklist' => new Assert\Optional(new Assert\Type('string')),
            'includedProductIds' => new Assert\Optional(new Assert\All(new Assert\Uuid())),
        ]));

        if (\count($violations) > 0) {
            return $this->validationErrorResponse($violations);
        }

        $service = (new Service())
            ->setDescription($payload['description'])
            ->setPrice($this->asMoney($payload['price']))
            ->setChecklist($payload['checklist'] ?? null);

        $this->syncIncludedProducts($service, $payload['includedProductIds'] ?? [], $productRepository);

        $entityManager->persist($service);
        $entityManager->flush();

        return $this->jsonResponse($formatter->formatService($service), JsonResponse::HTTP_CREATED);
    }

    #[Route('/{id}', name: 'api_services_update', methods: ['PATCH'])]
    public function update(
        string $id,
        Request $request,
        ServiceRepository $serviceRepository,
        EntityManagerInterface $entityManager,
        ValidatorInterface $validator,
        ProductRepository $productRepository,
        ResourceFormatter $formatter,
    ): JsonResponse {
        $service = $this->findServiceOr404($serviceRepository, $id);
        $payload = $this->decodeJson($request);

        $violations = $validator->validate($payload, new Assert\Collection([
            'description' => new Assert\Optional([new Assert\NotBlank(), new Assert\Type('string')]),
            'price' => new Assert\Optional([new Assert\Type('numeric'), new Assert\PositiveOrZero()]),
            'checklist' => new Assert\Optional(new Assert\Type('string')),
            'includedProductIds' => new Assert\Optional(new Assert\All(new Assert\Uuid())),
        ]));

        if (\count($violations) > 0) {
            return $this->validationErrorResponse($violations);
        }

        if (array_key_exists('description', $payload)) {
            $service->setDescription($payload['description']);
        }

        if (array_key_exists('price', $payload)) {
            $service->setPrice($this->asMoney($payload['price']));
        }

        if (array_key_exists('checklist', $payload)) {
            $service->setChecklist($payload['checklist']);
        }

        if (array_key_exists('includedProductIds', $payload)) {
            error_log('UPDATE SERVICE: includedProductIds received: ' . json_encode($payload['includedProductIds']));
            $this->syncIncludedProducts($service, $payload['includedProductIds'] ?? [], $productRepository);
            error_log('UPDATE SERVICE: After sync, service has ' . count($service->getIncludedProducts()) . ' products');
        } else {
            error_log('UPDATE SERVICE: includedProductIds NOT in payload. Payload keys: ' . json_encode(array_keys($payload)));
        }

        $entityManager->flush();

        return $this->jsonResponse($formatter->formatService($service));
    }

    #[Route('/{id}', name: 'api_services_delete', methods: ['DELETE'])]
    public function delete(
        string $id,
        ServiceRepository $serviceRepository,
        EntityManagerInterface $entityManager,
    ): JsonResponse {
        $service = $this->findServiceOr404($serviceRepository, $id);
        $entityManager->remove($service);
        $entityManager->flush();

        return $this->jsonResponse(null, JsonResponse::HTTP_NO_CONTENT);
    }

    private function findServiceOr404(ServiceRepository $repository, string $id): Service
    {
        $uuid = Uuid::fromString($id);
        $service = $repository->find($uuid);

        if (null === $service) {
            throw $this->createNotFoundException(sprintf('Service %s not found', $id));
        }

        return $service;
    }

    /**
     * @param string[] $productIds
     */
    private function syncIncludedProducts(Service $service, array $productIds, ProductRepository $productRepository): void
    {
        error_log('syncIncludedProducts called with IDs: ' . json_encode($productIds));
        
        if (empty($productIds)) {
            error_log('syncIncludedProducts: productIds is empty, clearing included products');
            $service->setIncludedProducts([]);

            return;
        }

        $uuids = array_map(fn(string $id) => Uuid::fromString($id), $productIds);
        error_log('syncIncludedProducts: Converted to UUIDs: ' . count($uuids));
        error_log('syncIncludedProducts: First UUID: ' . $uuids[0]->toRfc4122());
        
        // Fetch products one by one to avoid UUID array comparison issues
        $products = [];
        foreach ($uuids as $uuid) {
            $product = $productRepository->find($uuid);
            if ($product) {
                $products[] = $product;
            } else {
                error_log('syncIncludedProducts: Product not found for UUID: ' . $uuid->toRfc4122());
            }
        }

        error_log('syncIncludedProducts: Found ' . count($products) . ' products in database');
        $service->setIncludedProducts($products);
        error_log('syncIncludedProducts: Set included products, collection now has ' . count($service->getIncludedProducts()) . ' items');
    }

    private function asMoney(float|int|string $value): string
    {
        return number_format((float) $value, 2, '.', '');
    }
}

