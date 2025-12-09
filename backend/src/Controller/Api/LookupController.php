<?php

namespace App\Controller\Api;

use App\Repository\CustomerRepository;
use App\Repository\ProductRepository;
use App\Repository\ServiceRepository;
use App\Service\Api\ResourceFormatter;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Http\Attribute\IsGranted;

#[Route('/api/lookups', name: 'api_lookups', methods: ['GET'])]
#[IsGranted('ROLE_USER')]
class LookupController extends ApiController
{
    public function __invoke(
        CustomerRepository $customerRepository,
        ServiceRepository $serviceRepository,
        ProductRepository $productRepository,
        ResourceFormatter $formatter,
    ): JsonResponse {
        $customers = array_map(
            fn($customer) => $formatter->formatCustomer($customer),
            $customerRepository->findAll()
        );
        $services = array_map(
            fn($service) => $formatter->formatService($service),
            $serviceRepository->findAll()
        );
        $products = array_map(
            fn($product) => $formatter->formatProduct($product),
            $productRepository->findAll()
        );

        return $this->jsonResponse([
            'customers' => $customers,
            'services' => $services,
            'products' => $products,
        ]);
    }
}

