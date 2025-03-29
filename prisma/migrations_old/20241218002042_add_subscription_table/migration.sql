-- AlterTable
ALTER TABLE "Medico" ALTER COLUMN "type" SET DEFAULT 'COSMETOLOGO';

-- CreateTable
CREATE TABLE "Subscription" (
    "id" TEXT NOT NULL,
    "type" "SubscriptionType" NOT NULL,
    "priceMonthly" DOUBLE PRECISION NOT NULL,
    "priceAnnual" DOUBLE PRECISION NOT NULL,
    "description" TEXT,
    "details" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Subscription_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Subscription_type_key" ON "Subscription"("type");
