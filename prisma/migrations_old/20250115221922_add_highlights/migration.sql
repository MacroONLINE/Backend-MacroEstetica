-- AlterTable
ALTER TABLE "Minisite" ADD COLUMN     "slogan" TEXT;

-- CreateTable
CREATE TABLE "MinisiteHighlightProduct" (
    "id" TEXT NOT NULL,
    "minisiteId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "highlightFeatures" TEXT[],
    "highlightDescription" TEXT,
    "hoghlightImageUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MinisiteHighlightProduct_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "MinisiteHighlightProduct_minisiteId_productId_key" ON "MinisiteHighlightProduct"("minisiteId", "productId");

-- AddForeignKey
ALTER TABLE "MinisiteHighlightProduct" ADD CONSTRAINT "MinisiteHighlightProduct_minisiteId_fkey" FOREIGN KEY ("minisiteId") REFERENCES "Minisite"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MinisiteHighlightProduct" ADD CONSTRAINT "MinisiteHighlightProduct_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;
