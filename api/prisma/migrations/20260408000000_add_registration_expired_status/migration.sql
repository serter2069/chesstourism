-- AlterEnum
-- PostgreSQL requires ALTER TYPE ... ADD VALUE to run outside a transaction
ALTER TYPE "RegistrationStatus" ADD VALUE 'EXPIRED';
