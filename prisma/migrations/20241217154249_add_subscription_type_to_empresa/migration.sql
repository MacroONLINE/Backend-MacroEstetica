-- CreateEnum
CREATE TYPE "SubscriptionType" AS ENUM ('ORO', 'PLATA', 'BRONCE');

-- AlterTable
ALTER TABLE "Empresa" ADD COLUMN     "subscription" "SubscriptionType";
