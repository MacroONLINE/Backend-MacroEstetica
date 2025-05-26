-- CreateEnum
CREATE TYPE "FeatureCode" AS ENUM ('PRODUCTS_TOTAL', 'CATEGORIES_TOTAL', 'BANNER_PRODUCT_SLOTS', 'STATIC_IMAGES_TOTAL', 'FEATURED_PRODUCTS_TOTAL', 'CLASSROOM_TRANSMISSIONS_TOTAL');

-- CreateTable
CREATE TABLE "PlanFeature" (
    "id" TEXT NOT NULL,
    "plan" "SubscriptionType" NOT NULL,
    "code" "FeatureCode" NOT NULL,
    "limit" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PlanFeature_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CompanyUsage" (
    "id" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "code" "FeatureCode" NOT NULL,
    "used" INTEGER NOT NULL DEFAULT 0,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CompanyUsage_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PlanFeature_plan_code_key" ON "PlanFeature"("plan", "code");

-- CreateIndex
CREATE UNIQUE INDEX "CompanyUsage_companyId_code_key" ON "CompanyUsage"("companyId", "code");

-- AddForeignKey
ALTER TABLE "CompanyUsage" ADD CONSTRAINT "CompanyUsage_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Empresa"("id") ON DELETE CASCADE ON UPDATE CASCADE;
