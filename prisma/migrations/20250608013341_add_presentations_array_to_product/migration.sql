-- DropForeignKey
ALTER TABLE "Presentation" DROP CONSTRAINT "Presentation_productId_fkey";

-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "presentations" TEXT[];
