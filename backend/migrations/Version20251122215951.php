<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20251122215951 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE customer (id UUID NOT NULL, name VARCHAR(255) NOT NULL, address TEXT DEFAULT NULL, created_at TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL, updated_at TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL, PRIMARY KEY (id))');
        $this->addSql('CREATE TABLE invoice (id UUID NOT NULL, invoice_number VARCHAR(32) NOT NULL, issued_on DATE NOT NULL, customer_name VARCHAR(255) NOT NULL, customer_address TEXT DEFAULT NULL, vehicle_rego VARCHAR(64) DEFAULT NULL, vehicle_odo VARCHAR(64) DEFAULT NULL, vehicle_desc VARCHAR(255) DEFAULT NULL, created_at TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL, customer_id UUID DEFAULT NULL, PRIMARY KEY (id), CONSTRAINT FK_906517449395C3F3 FOREIGN KEY (customer_id) REFERENCES customer (id) NOT DEFERRABLE INITIALLY IMMEDIATE)');
        $this->addSql('CREATE UNIQUE INDEX UNIQ_906517442DA68207 ON invoice (invoice_number)');
        $this->addSql('CREATE INDEX IDX_906517449395C3F3 ON invoice (customer_id)');
        $this->addSql('CREATE TABLE invoice_line_items (id UUID NOT NULL, description TEXT NOT NULL, quantity NUMERIC(10, 2) DEFAULT NULL, price NUMERIC(10, 2) DEFAULT NULL, included BOOLEAN DEFAULT false NOT NULL, included_by_service_id VARCHAR(36) DEFAULT NULL, is_checklist BOOLEAN DEFAULT false NOT NULL, position SMALLINT NOT NULL, invoice_id UUID NOT NULL, PRIMARY KEY (id), CONSTRAINT FK_E746BE502989F1FD FOREIGN KEY (invoice_id) REFERENCES invoice (id) ON DELETE CASCADE NOT DEFERRABLE INITIALLY IMMEDIATE)');
        $this->addSql('CREATE INDEX IDX_E746BE502989F1FD ON invoice_line_items (invoice_id)');
        $this->addSql('CREATE TABLE product (id UUID NOT NULL, description VARCHAR(255) NOT NULL, price NUMERIC(10, 2) NOT NULL, created_at TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL, updated_at TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL, PRIMARY KEY (id))');
        $this->addSql('CREATE TABLE services (id UUID NOT NULL, description VARCHAR(255) NOT NULL, price NUMERIC(10, 2) NOT NULL, checklist TEXT DEFAULT NULL, created_at TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL, updated_at TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL, PRIMARY KEY (id))');
        $this->addSql('CREATE TABLE service_included_products (service_id UUID NOT NULL, product_id UUID NOT NULL, PRIMARY KEY (service_id, product_id), CONSTRAINT FK_5370000DED5CA9E6 FOREIGN KEY (service_id) REFERENCES services (id) ON DELETE CASCADE NOT DEFERRABLE INITIALLY IMMEDIATE, CONSTRAINT FK_5370000D4584665A FOREIGN KEY (product_id) REFERENCES product (id) ON DELETE CASCADE NOT DEFERRABLE INITIALLY IMMEDIATE)');
        $this->addSql('CREATE INDEX IDX_5370000DED5CA9E6 ON service_included_products (service_id)');
        $this->addSql('CREATE INDEX IDX_5370000D4584665A ON service_included_products (product_id)');
        $this->addSql('CREATE TABLE "user" (id UUID NOT NULL, email VARCHAR(180) NOT NULL, roles JSON NOT NULL, password VARCHAR(255) NOT NULL, PRIMARY KEY (id))');
        $this->addSql('CREATE UNIQUE INDEX UNIQ_8D93D649E7927C74 ON "user" (email)');
        $this->addSql('CREATE TABLE vehicle (id UUID NOT NULL, rego VARCHAR(64) DEFAULT NULL, odo VARCHAR(64) DEFAULT NULL, description VARCHAR(255) DEFAULT NULL, created_at TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL, updated_at TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL, customer_id UUID DEFAULT NULL, PRIMARY KEY (id), CONSTRAINT FK_1B80E4869395C3F3 FOREIGN KEY (customer_id) REFERENCES customer (id) ON DELETE CASCADE NOT DEFERRABLE INITIALLY IMMEDIATE)');
        $this->addSql('CREATE INDEX IDX_1B80E4869395C3F3 ON vehicle (customer_id)');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('DROP TABLE customer');
        $this->addSql('DROP TABLE invoice');
        $this->addSql('DROP TABLE invoice_line_items');
        $this->addSql('DROP TABLE product');
        $this->addSql('DROP TABLE services');
        $this->addSql('DROP TABLE service_included_products');
        $this->addSql('DROP TABLE "user"');
        $this->addSql('DROP TABLE vehicle');
    }
}
