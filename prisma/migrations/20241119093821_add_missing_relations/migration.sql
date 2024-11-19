/*
  Warnings:

  - The primary key for the `VerificationToken` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `createdAt` on the `VerificationToken` table. All the data in the column will be lost.
  - You are about to drop the column `id` on the `VerificationToken` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `VerificationToken` table. All the data in the column will be lost.
  - Made the column `rating` on table `Comment` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "VerificationToken" DROP CONSTRAINT "VerificationToken_userId_fkey";

-- AlterTable
ALTER TABLE "Comment" ALTER COLUMN "rating" SET NOT NULL;

-- AlterTable
ALTER TABLE "Medico" ALTER COLUMN "verification" DROP DEFAULT;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "countryCode" TEXT DEFAULT 'MX',
ADD COLUMN     "emailVerified" TIMESTAMP(3),
ADD COLUMN     "province" TEXT,
ALTER COLUMN "country" SET DEFAULT 'Mexico';

-- AlterTable
ALTER TABLE "VerificationToken" DROP CONSTRAINT "VerificationToken_pkey",
DROP COLUMN "createdAt",
DROP COLUMN "id",
DROP COLUMN "userId",
ADD CONSTRAINT "VerificationToken_pkey" PRIMARY KEY ("identifier");
