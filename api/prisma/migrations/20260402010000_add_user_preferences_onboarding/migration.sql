-- AlterTable
ALTER TABLE "User" ADD COLUMN "preferences" JSONB,
ADD COLUMN "onboardingCompleted" BOOLEAN NOT NULL DEFAULT false;
