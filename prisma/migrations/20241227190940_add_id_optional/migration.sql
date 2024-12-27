/*
  Warnings:

  - You are about to drop the `Payment` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Payment" DROP CONSTRAINT "Payment_courseId_fkey";

-- DropForeignKey
ALTER TABLE "Payment" DROP CONSTRAINT "Payment_userId_fkey";

-- AlterTable
ALTER TABLE "Transaction" ALTER COLUMN "stripePaymentIntentId" DROP NOT NULL,
ALTER COLUMN "stripeCheckoutSessionId" DROP NOT NULL,
ALTER COLUMN "userId" DROP NOT NULL,
ALTER COLUMN "courseId" DROP NOT NULL;

-- DropTable
DROP TABLE "Payment";
