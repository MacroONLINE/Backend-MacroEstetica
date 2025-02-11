/*
  Warnings:

  - You are about to drop the column `eventId` on the `Classroom` table. All the data in the column will be lost.
  - You are about to drop the column `whatYouWillLearn` on the `Classroom` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Classroom" DROP COLUMN "eventId",
DROP COLUMN "whatYouWillLearn";
