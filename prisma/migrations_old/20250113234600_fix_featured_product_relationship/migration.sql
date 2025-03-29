/*
  Warnings:

  - A unique constraint covering the columns `[productId]` on the table `MinisiteFeaturedProduct` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "MinisiteFeaturedProduct_productId_key" ON "MinisiteFeaturedProduct"("productId");

-- AddForeignKey
ALTER TABLE "MinisiteFeaturedProduct" ADD CONSTRAINT "MinisiteFeaturedProduct_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;
