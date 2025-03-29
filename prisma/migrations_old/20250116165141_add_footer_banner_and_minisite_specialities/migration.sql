-- AlterTable
ALTER TABLE "EmpresaSubscription" ALTER COLUMN "updatedAt" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "ProductCompanyCategory" ADD COLUMN     "footerBanner" TEXT,
ADD COLUMN     "iconUrl" TEXT;

-- CreateTable
CREATE TABLE "MinisiteSpeciality" (
    "id" TEXT NOT NULL,
    "minisiteId" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MinisiteSpeciality_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "MinisiteSpeciality" ADD CONSTRAINT "MinisiteSpeciality_minisiteId_fkey" FOREIGN KEY ("minisiteId") REFERENCES "Minisite"("id") ON DELETE CASCADE ON UPDATE CASCADE;
