<?php

namespace App\Service\Api;

use App\Entity\Customer;
use App\Entity\Invoice;
use App\Entity\InvoiceLineItem;
use App\Entity\Product;
use App\Entity\Quotation;
use App\Entity\QuotationLineItem;
use App\Entity\Service;
use App\Entity\Vehicle;

class ResourceFormatter
{
    /**
     * @return array<string, mixed>
     */
    public function formatCustomer(Customer $customer, bool $includeVehicles = true): array
    {
        return [
            'id' => $customer->getId()->toRfc4122(),
            'name' => $customer->getName(),
            'address' => $customer->getAddress(),
            'vehicles' => $includeVehicles
                ? array_map(
                    fn(Vehicle $vehicle) => $this->formatVehicle($vehicle),
                    $customer->getVehicles()->toArray()
                )
                : null,
        ];
    }

    /**
     * @return array<string, mixed>
     */
    public function formatVehicle(Vehicle $vehicle): array
    {
        return [
            'id' => $vehicle->getId()->toRfc4122(),
            'rego' => $vehicle->getRego(),
            'odo' => $vehicle->getOdo(),
            'desc' => $vehicle->getDescription(),
        ];
    }

    /**
     * @return array<string, mixed>
     */
    public function formatProduct(Product $product): array
    {
        return [
            'id' => $product->getId()->toRfc4122(),
            'type' => 'product',
            'description' => $product->getDescription(),
            'price' => (float) $product->getPrice(),
        ];
    }

    /**
     * @return array<string, mixed>
     */
    public function formatService(Service $service): array
    {
        return [
            'id' => $service->getId()->toRfc4122(),
            'type' => 'service',
            'description' => $service->getDescription(),
            'price' => (float) $service->getPrice(),
            'checklist' => $service->getChecklist(),
            'includedProductIds' => array_map(
                fn(Product $product) => $product->getId()->toRfc4122(),
                $service->getIncludedProducts()->toArray()
            ),
        ];
    }

    /**
     * @return array<string, mixed>
     */
    public function formatInvoice(Invoice $invoice): array
    {
        $items = $invoice->getLineItems()->toArray();
        usort($items, fn(InvoiceLineItem $a, InvoiceLineItem $b) => $a->getPosition() <=> $b->getPosition());

        return [
            'id' => $invoice->getId()->toRfc4122(),
            'customerId' => $invoice->getCustomer()?->getId()->toRfc4122(),
            'invoiceNumber' => $invoice->getInvoiceNumber(),
            'date' => $invoice->getIssuedOn()->format('Y-m-d'),
            'customerName' => $invoice->getCustomerName(),
            'customerAddress' => $invoice->getCustomerAddress(),
            'vehicleRego' => $invoice->getVehicleRego(),
            'vehicleOdo' => $invoice->getVehicleOdo(),
            'vehicleDesc' => $invoice->getVehicleDesc(),
            'status' => $invoice->getStatus(),
            'lineItems' => array_map(
                fn(InvoiceLineItem $lineItem) => $this->formatLineItem($lineItem),
                $items
            ),
        ];
    }

    /**
     * @return array<string, mixed>
     */
    /**
     * @return array<string, mixed>
     */
    public function formatLineItem(InvoiceLineItem $lineItem): array
    {
        return [
            'id' => $lineItem->getId()->toRfc4122(),
            'description' => $lineItem->getDescription(),
            'quantity' => $lineItem->getQuantity() !== null ? (float) $lineItem->getQuantity() : null,
            'price' => $lineItem->getPrice() !== null ? (float) $lineItem->getPrice() : null,
            'included' => $lineItem->isIncluded(),
            'includedBy' => $lineItem->getIncludedByServiceId(),
            'isChecklist' => $lineItem->isChecklist(),
            'position' => $lineItem->getPosition(),
        ];
    }

    /**
     * @return array<string, mixed>
     */
    public function formatQuotation(Quotation $quotation): array
    {
        $items = $quotation->getLineItems()->toArray();
        usort($items, fn(QuotationLineItem $a, QuotationLineItem $b) => $a->getPosition() <=> $b->getPosition());

        return [
            'id' => $quotation->getId()->toRfc4122(),
            'customerId' => $quotation->getCustomer()?->getId()->toRfc4122(),
            'quotationNumber' => $quotation->getQuotationNumber(),
            'date' => $quotation->getIssuedOn()->format('Y-m-d'),
            'customerName' => $quotation->getCustomerName(),
            'customerAddress' => $quotation->getCustomerAddress(),
            'vehicleRego' => $quotation->getVehicleRego(),
            'vehicleOdo' => $quotation->getVehicleOdo(),
            'vehicleDesc' => $quotation->getVehicleDesc(),
            'status' => $quotation->getStatus(),
            'lineItems' => array_map(
                fn(QuotationLineItem $lineItem) => $this->formatQuotationLineItem($lineItem),
                $items
            ),
        ];
    }

    /**
     * @return array<string, mixed>
     */
    public function formatQuotationLineItem(QuotationLineItem $lineItem): array
    {
        return [
            'id' => $lineItem->getId()->toRfc4122(),
            'description' => $lineItem->getDescription(),
            'quantity' => $lineItem->getQuantity() !== null ? (float) $lineItem->getQuantity() : null,
            'price' => $lineItem->getPrice() !== null ? (float) $lineItem->getPrice() : null,
            'included' => $lineItem->isIncluded(),
            'includedBy' => $lineItem->getIncludedByServiceId(),
            'isChecklist' => $lineItem->isChecklist(),
            'position' => $lineItem->getPosition(),
        ];
    }
}

