/*
  Warnings:

  - You are about to drop the column `ximageUrl` on the `Workshop` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Workshop" DROP COLUMN "ximageUrl",
ADD COLUMN     "imageUrl" TEXT;
