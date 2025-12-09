<?php

namespace App\Controller\Api;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpKernel\Exception\BadRequestHttpException;
use Symfony\Component\Validator\ConstraintViolationInterface;
use Symfony\Component\Validator\ConstraintViolationListInterface;

abstract class ApiController extends AbstractController
{
    protected function jsonResponse(mixed $data, int $status = JsonResponse::HTTP_OK): JsonResponse
    {
        return $this->json($data, $status);
    }

    /**
     * @return array<string, mixed>
     */
    protected function decodeJson(Request $request): array
    {
        $content = $request->getContent() ?: '{}';

        try {
            $decoded = json_decode($content, true, 512, JSON_THROW_ON_ERROR);
        } catch (\Throwable $exception) {
            throw new BadRequestHttpException('Invalid JSON payload: ' . $exception->getMessage(), $exception);
        }

        if (!is_array($decoded)) {
            throw new BadRequestHttpException('JSON payload must decode to an object');
        }

        return $decoded;
    }

    protected function validationErrorResponse(ConstraintViolationListInterface $violations): JsonResponse
    {
        $errors = [];
        /** @var ConstraintViolationInterface $violation */
        foreach ($violations as $violation) {
            $errors[] = [
                'field' => $violation->getPropertyPath(),
                'message' => $violation->getMessage(),
            ];
        }

        return $this->json(['errors' => $errors], JsonResponse::HTTP_UNPROCESSABLE_ENTITY);
    }
}

