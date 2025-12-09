<?php

namespace App\Entity;

use App\Repository\QuotationRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Bridge\Doctrine\Types\UuidType;
use Symfony\Component\Uid\Uuid;

#[ORM\Entity(repositoryClass: QuotationRepository::class)]
#[ORM\HasLifecycleCallbacks]
class Quotation
{
    #[ORM\Id]
    #[ORM\Column(type: UuidType::NAME, unique: true)]
    private Uuid $id;

    #[ORM\Column(length: 32, unique: true)]
    private string $quotationNumber;

    #[ORM\Column(type: Types::DATE_IMMUTABLE)]
    private \DateTimeImmutable $issuedOn;

    #[ORM\ManyToOne]
    private ?Customer $customer = null;

    #[ORM\Column(length: 255)]
    private string $customerName;

    #[ORM\Column(type: Types::TEXT, nullable: true)]
    private ?string $customerAddress = null;

    #[ORM\Column(length: 64, nullable: true)]
    private ?string $vehicleRego = null;

    #[ORM\Column(length: 64, nullable: true)]
    private ?string $vehicleOdo = null;

    #[ORM\Column(length: 255, nullable: true)]
    private ?string $vehicleDesc = null;

    #[ORM\Column(length: 20, options: ['default' => 'DRAFT'])]
    private string $status = 'DRAFT';

    #[ORM\Column(type: Types::DATETIME_IMMUTABLE)]
    private \DateTimeImmutable $createdAt;

    #[ORM\OneToMany(mappedBy: 'quotation', targetEntity: QuotationLineItem::class, cascade: ['persist'], orphanRemoval: true)]
    private Collection $lineItems;

    public function __construct(?Uuid $id = null)
    {
        $this->id = $id ?? Uuid::v7();
        $this->lineItems = new ArrayCollection();
        $this->issuedOn = new \DateTimeImmutable('today');
        $this->createdAt = new \DateTimeImmutable();
        $this->quotationNumber = 'QT-' . strtoupper($this->id->toBase58());
    }

    public function getId(): Uuid
    {
        return $this->id;
    }

    public function getQuotationNumber(): string
    {
        return $this->quotationNumber;
    }

    public function setQuotationNumber(string $quotationNumber): self
    {
        $this->quotationNumber = $quotationNumber;

        return $this;
    }

    public function getIssuedOn(): \DateTimeImmutable
    {
        return $this->issuedOn;
    }

    public function setIssuedOn(\DateTimeImmutable $issuedOn): self
    {
        $this->issuedOn = $issuedOn;

        return $this;
    }

    public function getCustomer(): ?Customer
    {
        return $this->customer;
    }

    public function setCustomer(?Customer $customer): self
    {
        $this->customer = $customer;

        return $this;
    }

    public function getCustomerName(): string
    {
        return $this->customerName;
    }

    public function setCustomerName(string $customerName): self
    {
        $this->customerName = $customerName;

        return $this;
    }

    public function getCustomerAddress(): ?string
    {
        return $this->customerAddress;
    }

    public function setCustomerAddress(?string $customerAddress): self
    {
        $this->customerAddress = $customerAddress;

        return $this;
    }

    public function getVehicleRego(): ?string
    {
        return $this->vehicleRego;
    }

    public function setVehicleRego(?string $vehicleRego): self
    {
        $this->vehicleRego = $vehicleRego;

        return $this;
    }

    public function getVehicleOdo(): ?string
    {
        return $this->vehicleOdo;
    }

    public function setVehicleOdo(?string $vehicleOdo): self
    {
        $this->vehicleOdo = $vehicleOdo;

        return $this;
    }

    public function getVehicleDesc(): ?string
    {
        return $this->vehicleDesc;
    }

    public function setVehicleDesc(?string $vehicleDesc): self
    {
        $this->vehicleDesc = $vehicleDesc;

        return $this;
    }

    public function getStatus(): string
    {
        return $this->status;
    }

    public function setStatus(string $status): self
    {
        $this->status = $status;

        return $this;
    }

    public function getCreatedAt(): \DateTimeImmutable
    {
        return $this->createdAt;
    }

    /**
     * @return Collection<int, QuotationLineItem>
     */
    public function getLineItems(): Collection
    {
        return $this->lineItems;
    }

    public function addLineItem(QuotationLineItem $lineItem): self
    {
        if (!$this->lineItems->contains($lineItem)) {
            $this->lineItems->add($lineItem);
            $lineItem->setQuotation($this);
        }

        return $this;
    }

    public function removeLineItem(QuotationLineItem $lineItem): self
    {
        if ($this->lineItems->removeElement($lineItem)) {
            if ($lineItem->getQuotation() === $this) {
                $lineItem->setQuotation(null);
            }
        }

        return $this;
    }
}
