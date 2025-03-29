/*
  Warnings:

  - You are about to drop the column `availableQuantity` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `cost` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `discount` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `productCode` on the `Product` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[categoryId,name]` on the table `Product` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `categoryId` to the `Product` table without a default value. This is not possible if the table is not empty.
  - Made the column `description` on table `Product` required. This step will fail if there are existing NULL values in that column.

*/
-- CreateEnum
CREATE TYPE "Unit" AS ENUM ('ML', 'G', 'KG', 'OZ', 'L', 'FL_OZ', 'MG');

-- DropIndex
DROP INDEX "Product_productCode_key";

-- AlterTable
ALTER TABLE "Product" DROP COLUMN "availableQuantity",
DROP COLUMN "cost",
DROP COLUMN "discount",
DROP COLUMN "productCode",
ADD COLUMN     "activeIngredients" TEXT[],
ADD COLUMN     "benefits" TEXT[],
ADD COLUMN     "categoryId" INTEGER NOT NULL,
ADD COLUMN     "features" TEXT[],
ADD COLUMN     "imageGallery" TEXT[],
ADD COLUMN     "imageMain" TEXT,
ADD COLUMN     "isBestSeller" BOOLEAN DEFAULT false,
ADD COLUMN     "isOnSale" BOOLEAN DEFAULT false,
ADD COLUMN     "lab" TEXT,
ADD COLUMN     "problemAddressed" TEXT,
ALTER COLUMN "description" SET NOT NULL,
ALTER COLUMN "isFeatured" DROP NOT NULL;

-- CreateTable
CREATE TABLE "ProductCompanyCategory" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "companyId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ProductCompanyCategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Presentation" (
    "id" SERIAL NOT NULL,
    "productId" INTEGER NOT NULL,
    "size" DECIMAL(65,30) NOT NULL,
    "unit" "Unit" NOT NULL,
    "description" TEXT,
    "price" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Presentation_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ProductCompanyCategory_companyId_idx" ON "ProductCompanyCategory"("companyId");

-- CreateIndex
CREATE UNIQUE INDEX "ProductCompanyCategory_name_companyId_key" ON "ProductCompanyCategory"("name", "companyId");

-- CreateIndex
CREATE INDEX "Presentation_productId_idx" ON "Presentation"("productId");

-- CreateIndex
CREATE UNIQUE INDEX "Product_categoryId_name_key" ON "Product"("categoryId", "name");

-- AddForeignKey
ALTER TABLE "ProductCompanyCategory" ADD CONSTRAINT "ProductCompanyCategory_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Empresa"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "ProductCompanyCategory"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Presentation" ADD CONSTRAINT "Presentation_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;
