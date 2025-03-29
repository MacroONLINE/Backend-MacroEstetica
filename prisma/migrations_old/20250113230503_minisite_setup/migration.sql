-- AlterTable
ALTER TABLE "Banner" ALTER COLUMN "updatedAt" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "Event" ALTER COLUMN "updatedAt" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "Session" ALTER COLUMN "updatedAt" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "Transaction" ALTER COLUMN "updatedAt" SET DEFAULT CURRENT_TIMESTAMP;

-- CreateTable
CREATE TABLE "Minisite" (
    "id" TEXT NOT NULL,
    "empresaId" TEXT NOT NULL,
    "highlightTitle" TEXT,
    "highlightDescription" TEXT,
    "videoUrl" TEXT,
    "aboutDescription" JSONB,
    "followersCount" INTEGER DEFAULT 0,
    "coursesCount" INTEGER DEFAULT 0,
    "productsCount" INTEGER DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Minisite_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MinisiteSlide" (
    "id" TEXT NOT NULL,
    "minisiteId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "cta" TEXT,
    "imageSrc" TEXT,
    "order" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MinisiteSlide_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MinisiteBenefit" (
    "id" TEXT NOT NULL,
    "minisiteId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MinisiteBenefit_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MinisiteOffer" (
    "id" TEXT NOT NULL,
    "minisiteId" TEXT NOT NULL,
    "sectionTitle" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MinisiteOffer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MinisiteOfferProduct" (
    "id" TEXT NOT NULL,
    "offerId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MinisiteOfferProduct_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MinisiteFeaturedProduct" (
    "id" TEXT NOT NULL,
    "minisiteId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "order" INTEGER,
    "tagline" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MinisiteFeaturedProduct_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Minisite_empresaId_key" ON "Minisite"("empresaId");

-- AddForeignKey
ALTER TABLE "Minisite" ADD CONSTRAINT "Minisite_empresaId_fkey" FOREIGN KEY ("empresaId") REFERENCES "Empresa"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MinisiteSlide" ADD CONSTRAINT "MinisiteSlide_minisiteId_fkey" FOREIGN KEY ("minisiteId") REFERENCES "Minisite"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MinisiteBenefit" ADD CONSTRAINT "MinisiteBenefit_minisiteId_fkey" FOREIGN KEY ("minisiteId") REFERENCES "Minisite"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MinisiteOffer" ADD CONSTRAINT "MinisiteOffer_minisiteId_fkey" FOREIGN KEY ("minisiteId") REFERENCES "Minisite"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MinisiteOfferProduct" ADD CONSTRAINT "MinisiteOfferProduct_offerId_fkey" FOREIGN KEY ("offerId") REFERENCES "MinisiteOffer"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MinisiteFeaturedProduct" ADD CONSTRAINT "MinisiteFeaturedProduct_minisiteId_fkey" FOREIGN KEY ("minisiteId") REFERENCES "Minisite"("id") ON DELETE CASCADE ON UPDATE CASCADE;
