<?php

namespace App\Controller\Api;

use App\Entity\Product;
use App\Repository\ProductRepository;
use App\Service\Api\ResourceFormatter;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Http\Attribute\IsGranted;
use Symfony\Component\Uid\Uuid;
use Symfony\Component\Validator\Constraints as Assert;
use Symfony\Component\Validator\Validator\ValidatorInterface;

#[Route('/api/products')]
#[IsGranted('ROLE_USER')]
class ProductController extends ApiController
{
    #[Route('', name: 'api_products_index', methods: ['GET'])]
    public function index(ProductRepository $repository, ResourceFormatter $formatter): JsonResponse
    {
        $products = array_map(
            fn(Product $product) => $formatter->formatProduct($product),
            $repository->findAll()
        );

        return $this->jsonResponse($products);
    }

    #[Route('', name: 'api_products_create', methods: ['POST'])]
    public function create(
        Request $request,
        EntityManagerInterface $entityManager,
        ValidatorInterface $validator,
        ResourceFormatter $formatter,
    ): JsonResponse {
        $payload = $this->decodeJson($request);

        $violations = $validator->validate($payload, new Assert\Collection([
            'description' => [new Assert\NotBlank(), new Assert\Type('string')],
            'price' => [new Assert\NotBlank(), new Assert\Type('numeric'), new Assert\PositiveOrZero()],
        ]));

        if (\count($violations) > 0) {
            return $this->validationErrorResponse($violations);
        }

        $product = (new Product())
            ->setDescription($payload['description'])
            ->setPrice($this->asMoney($payload['price']));

        $entityManager->persist($product);
        $entityManager->flush();

        return $this->jsonResponse($formatter->formatProduct($product), JsonResponse::HTTP_CREATED);
    }

    #[Route('/{id}', name: 'api_products_update', methods: ['PATCH'])]
    public function update(
        string $id,
        Request $request,
        ProductRepository $repository,
        EntityManagerInterface $entityManager,
        ValidatorInterface $validator,
        ResourceFormatter $formatter,
    ): JsonResponse {
        $product = $this->findProductOr404($repository, $id);
        $payload = $this->decodeJson($request);

        $violations = $validator->validate($payload, new Assert\Collection([
            'description' => new Assert\Optional([new Assert\NotBlank(), new Assert\Type('string')]),
            'price' => new Assert\Optional([new Assert\Type('numeric'), new Assert\PositiveOrZero()]),
        ]));

        if (\count($violations) > 0) {
            return $this->validationErrorResponse($violations);
        }

        if (array_key_exists('description', $payload)) {
            $product->setDescription($payload['description']);
        }
        if (array_key_exists('price', $payload)) {
            $product->setPrice($this->asMoney($payload['price']));
        }

        $entityManager->flush();

        return $this->jsonResponse($formatter->formatProduct($product));
    }

    #[Route('/{id}', name: 'api_products_delete', methods: ['DELETE'])]
    public function delete(
        string $id,
        ProductRepository $repository,
        EntityManagerInterface $entityManager,
    ): JsonResponse {
        $product = $this->findProductOr404($repository, $id);
        $entityManager->remove($product);
        $entityManager->flush();

        return $this->jsonResponse(null, JsonResponse::HTTP_NO_CONTENT);
    }

    private function findProductOr404(ProductRepository $repository, string $id): Product
    {
        $uuid = Uuid::fromString($id);
        $product = $repository->find($uuid);

        if (null === $product) {
            throw $this->createNotFoundException(sprintf('Product %s not found', $id));
        }

        return $product;
    }

    private function asMoney(float|int|string $value): string
    {
        return number_format((float) $value, 2, '.', '');
    }
}

