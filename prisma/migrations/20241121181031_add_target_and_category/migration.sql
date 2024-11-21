-- CreateEnum
CREATE TYPE "Target" AS ENUM ('MEDICO', 'ESTETICISTA');

-- DropForeignKey
ALTER TABLE "Empresa" DROP CONSTRAINT "Empresa_categoryId_fkey";

-- AlterTable
ALTER TABLE "Empresa" ADD COLUMN     "target" "Target" NOT NULL DEFAULT 'MEDICO';

-- AlterTable
ALTER TABLE "Instructor" ALTER COLUMN "profession" SET DEFAULT 'MEDICO';

-- AddForeignKey
ALTER TABLE "Empresa" ADD CONSTRAINT "Empresa_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE CASCADE ON UPDATE CASCADE;
