-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('MALE', 'FEMALE', 'OTHER');

-- AlterTable
ALTER TABLE "Instructor" ADD COLUMN     "genero" "Gender",
ADD COLUMN     "validated" BOOLEAN DEFAULT false;
