/*
  Warnings:

  - You are about to drop the column `highlightDescription` on the `Minisite` table. All the data in the column will be lost.
  - You are about to drop the column `highlightTitle` on the `Minisite` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Minisite" DROP COLUMN "highlightDescription",
DROP COLUMN "highlightTitle";
