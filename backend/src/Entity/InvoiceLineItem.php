<?php

namespace App\Entity;

use App\Repository\InvoiceLineItemRepository;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Bridge\Doctrine\Types\UuidType;
use Symfony\Component\Uid\Uuid;

#[ORM\Entity(repositoryClass: InvoiceLineItemRepository::class)]
#[ORM\Table(name: 'invoice_line_items')]
class InvoiceLineItem
{
    #[ORM\Id]
    #[ORM\Column(type: UuidType::NAME, unique: true)]
    private Uuid $id;

    #[ORM\ManyToOne(inversedBy: 'lineItems')]
    #[ORM\JoinColumn(nullable: false, onDelete: 'CASCADE')]
    private ?Invoice $invoice = null;

    #[ORM\Column(type: Types::TEXT)]
    private string $description;

    #[ORM\Column(type: Types::DECIMAL, precision: 10, scale: 2, nullable: true)]
    private ?string $quantity = null;

    #[ORM\Column(type: Types::DECIMAL, precision: 10, scale: 2, nullable: true)]
    private ?string $price = null;

    #[ORM\Column(options: ['default' => false])]
    private bool $included = false;

    #[ORM\Column(length: 36, nullable: true)]
    private ?string $includedByServiceId = null;

    #[ORM\Column(options: ['default' => false])]
    private bool $isChecklist = false;

    #[ORM\Column(type: Types::SMALLINT)]
    private int $position = 0;

    public function __construct(?Uuid $id = null)
    {
        $this->id = $id ?? Uuid::v7();
    }

    public function getId(): Uuid
    {
        return $this->id;
    }

    public function getInvoice(): ?Invoice
    {
        return $this->invoice;
    }

    public function setInvoice(?Invoice $invoice): self
    {
        $this->invoice = $invoice;

        return $this;
    }

    public function getDescription(): string
    {
        return $this->description;
    }

    public function setDescription(string $description): self
    {
        $this->description = $description;

        return $this;
    }

    public function getQuantity(): ?string
    {
        return $this->quantity;
    }

    public function setQuantity(?string $quantity): self
    {
        $this->quantity = $quantity;

        return $this;
    }

    public function getPrice(): ?string
    {
        return $this->price;
    }

    public function setPrice(?string $price): self
    {
        $this->price = $price;

        return $this;
    }

    public function isIncluded(): bool
    {
        return $this->included;
    }

    public function setIncluded(bool $included): self
    {
        $this->included = $included;

        return $this;
    }

    public function getIncludedByServiceId(): ?string
    {
        return $this->includedByServiceId;
    }

    public function setIncludedByServiceId(?string $includedByServiceId): self
    {
        $this->includedByServiceId = $includedByServiceId;

        return $this;
    }

    public function isChecklist(): bool
    {
        return $this->isChecklist;
    }

    public function setIsChecklist(bool $isChecklist): self
    {
        $this->isChecklist = $isChecklist;

        return $this;
    }

    public function getPosition(): int
    {
        return $this->position;
    }

    public function setPosition(int $position): self
    {
        $this->position = $position;

        return $this;
    }
}

