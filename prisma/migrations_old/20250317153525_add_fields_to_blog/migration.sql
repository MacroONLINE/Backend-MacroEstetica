-- AlterTable
ALTER TABLE "BlogCategory" ADD COLUMN     "iconUrl" TEXT;

-- AlterTable
ALTER TABLE "BlogPost" ADD COLUMN     "notUsefulCount" INTEGER DEFAULT 0,
ADD COLUMN     "totalReaders" INTEGER DEFAULT 0,
ADD COLUMN     "usefulCount" INTEGER DEFAULT 0;
