<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20251206163000 extends AbstractMigration
{
    public function getDescription(): string
    {
        return 'Create quotation and quotation_line_items tables';
    }

    public function up(Schema $schema): void
    {
        // Quotation Table (mirrors invoice)
        $this->addSql('CREATE TABLE quotation (id UUID NOT NULL, quotation_number VARCHAR(32) NOT NULL, issued_on DATE NOT NULL, customer_name VARCHAR(255) NOT NULL, customer_address TEXT DEFAULT NULL, vehicle_rego VARCHAR(64) DEFAULT NULL, vehicle_odo VARCHAR(64) DEFAULT NULL, vehicle_desc VARCHAR(255) DEFAULT NULL, created_at TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL, customer_id UUID DEFAULT NULL, PRIMARY KEY (id))');
        $this->addSql('CREATE UNIQUE INDEX UNIQ_QUOTATION_NUMBER ON quotation (quotation_number)');
        $this->addSql('CREATE INDEX IDX_QUOTATION_CUSTOMER_ID ON quotation (customer_id)');
        $this->addSql('ALTER TABLE quotation ADD CONSTRAINT FK_QUOTATION_CUSTOMER FOREIGN KEY (customer_id) REFERENCES customer (id) NOT DEFERRABLE INITIALLY IMMEDIATE');

        // Quotation Line Items Table (mirrors invoice_line_items)
        $this->addSql('CREATE TABLE quotation_line_items (id UUID NOT NULL, description TEXT NOT NULL, quantity NUMERIC(10, 2) DEFAULT NULL, price NUMERIC(10, 2) DEFAULT NULL, included BOOLEAN DEFAULT false NOT NULL, included_by_service_id VARCHAR(36) DEFAULT NULL, is_checklist BOOLEAN DEFAULT false NOT NULL, position SMALLINT NOT NULL, quotation_id UUID NOT NULL, PRIMARY KEY (id))');
        $this->addSql('CREATE INDEX IDX_QUOTATION_LINE_ITEMS_QUOTATION_ID ON quotation_line_items (quotation_id)');
        $this->addSql('ALTER TABLE quotation_line_items ADD CONSTRAINT FK_QUOTATION_LINE_ITEMS_QUOTATION FOREIGN KEY (quotation_id) REFERENCES quotation (id) ON DELETE CASCADE NOT DEFERRABLE INITIALLY IMMEDIATE');
    }

    public function down(Schema $schema): void
    {
        $this->addSql('DROP TABLE quotation_line_items');
        $this->addSql('DROP TABLE quotation');
    }
}
