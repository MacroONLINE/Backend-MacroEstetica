/*
  Warnings:

  - You are about to drop the `MinisiteOffer` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `MinisiteOfferProduct` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterEnum
ALTER TYPE "FeatureCode" ADD VALUE 'OFFER_PRODUCTS_TOTAL';

-- DropForeignKey
ALTER TABLE "MinisiteOffer" DROP CONSTRAINT "MinisiteOffer_minisiteId_fkey";

-- DropForeignKey
ALTER TABLE "MinisiteOfferProduct" DROP CONSTRAINT "MinisiteOfferProduct_offerId_fkey";

-- DropIndex
DROP INDEX "Product_categoryId_name_key";

-- AlterTable
ALTER TABLE "Product" ALTER COLUMN "updatedAt" DROP DEFAULT,
ALTER COLUMN "categoryId" DROP NOT NULL;

-- DropTable
DROP TABLE "MinisiteOffer";

-- DropTable
DROP TABLE "MinisiteOfferProduct";

-- CreateTable
CREATE TABLE "MinisiteProductOffer" (
    "id" TEXT NOT NULL,
    "minisiteId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MinisiteProductOffer_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "MinisiteProductOffer_minisiteId_productId_key" ON "MinisiteProductOffer"("minisiteId", "productId");

-- AddForeignKey
ALTER TABLE "MinisiteProductOffer" ADD CONSTRAINT "MinisiteProductOffer_minisiteId_fkey" FOREIGN KEY ("minisiteId") REFERENCES "Minisite"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MinisiteProductOffer" ADD CONSTRAINT "MinisiteProductOffer_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;
