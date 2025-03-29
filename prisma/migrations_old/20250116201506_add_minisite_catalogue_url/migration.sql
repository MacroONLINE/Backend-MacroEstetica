/*
  Warnings:

  - You are about to drop the column `catalogoUrl` on the `Minisite` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Minisite" DROP COLUMN "catalogoUrl",
ADD COLUMN     "catalogueUrl" TEXT;
