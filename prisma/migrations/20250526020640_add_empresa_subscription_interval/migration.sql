-- CreateEnum
CREATE TYPE "SubscriptionInterval" AS ENUM ('MONTHLY', 'SEMIANNUAL', 'ANNUAL');

-- AlterTable
ALTER TABLE "EmpresaSubscription" ADD COLUMN     "interval" "SubscriptionInterval";
