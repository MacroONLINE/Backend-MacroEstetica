/*
  Warnings:

  - Made the column `profession` on table `Instructor` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Empresa" ALTER COLUMN "name" DROP DEFAULT;

-- AlterTable
ALTER TABLE "Instructor" ALTER COLUMN "profession" SET NOT NULL;
