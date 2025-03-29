/*
  Warnings:

  - You are about to drop the `Subscription` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterTable
ALTER TABLE "Medico" ALTER COLUMN "type" SET DEFAULT 'ESTETICISTA';

-- DropTable
DROP TABLE "Subscription";
