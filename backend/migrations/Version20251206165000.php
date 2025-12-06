<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20251206165000 extends AbstractMigration
{
    public function getDescription(): string
    {
        return 'Add status field to invoice and quotation tables';
    }

    public function up(Schema $schema): void
    {
        // Add status to invoice
        $this->addSql("ALTER TABLE invoice ADD status VARCHAR(20) DEFAULT 'DRAFT' NOT NULL");
        
        // Add status to quotation
        $this->addSql("ALTER TABLE quotation ADD status VARCHAR(20) DEFAULT 'DRAFT' NOT NULL");
    }

    public function down(Schema $schema): void
    {
        $this->addSql('ALTER TABLE invoice DROP status');
        $this->addSql('ALTER TABLE quotation DROP status');
    }
}
