/*
  Warnings:

  - You are about to drop the `Producto` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Producto" DROP CONSTRAINT "Producto_idEmpresa_fkey";

-- DropTable
DROP TABLE "Producto";

-- CreateTable
CREATE TABLE "Product" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(200) NOT NULL,
    "description" TEXT,
    "cost" DECIMAL(10,2) NOT NULL,
    "discount" DECIMAL(10,2),
    "productCode" VARCHAR(100) NOT NULL,
    "availableQuantity" INTEGER NOT NULL,
    "companyId" TEXT NOT NULL,
    "providerId" TEXT,
    "isFeatured" BOOLEAN NOT NULL DEFAULT false,
    "imageUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Product_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Product_productCode_key" ON "Product"("productCode");

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Empresa"("id") ON DELETE CASCADE ON UPDATE CASCADE;
