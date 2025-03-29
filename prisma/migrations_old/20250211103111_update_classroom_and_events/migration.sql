/*
  Warnings:

  - You are about to drop the column `instructorId` on the `Event` table. All the data in the column will be lost.
  - You are about to drop the column `classroomId` on the `Workshop` table. All the data in the column will be lost.
  - You are about to drop the `EventOffer` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `EventOfferProduct` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[channelName]` on the table `Classroom` will be added. If there are existing duplicate values, this will fail.
  - Made the column `description` on table `Classroom` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Event" DROP CONSTRAINT "Event_instructorId_fkey";

-- DropForeignKey
ALTER TABLE "EventOffer" DROP CONSTRAINT "EventOffer_eventId_fkey";

-- DropForeignKey
ALTER TABLE "EventOfferProduct" DROP CONSTRAINT "EventOfferProduct_offerId_fkey";

-- DropForeignKey
ALTER TABLE "Workshop" DROP CONSTRAINT "Workshop_classroomId_fkey";

-- AlterTable
ALTER TABLE "Classroom" ADD COLUMN     "channelName" TEXT,
ADD COLUMN     "endDateTime" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "eventId" TEXT,
ADD COLUMN     "imageUrl" TEXT,
ADD COLUMN     "price" DOUBLE PRECISION,
ADD COLUMN     "startDateTime" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "whatYouWillLearn" TEXT,
ALTER COLUMN "description" SET NOT NULL;

-- AlterTable
ALTER TABLE "Event" DROP COLUMN "instructorId";

-- AlterTable
ALTER TABLE "Workshop" DROP COLUMN "classroomId";

-- DropTable
DROP TABLE "EventOffer";

-- DropTable
DROP TABLE "EventOfferProduct";

-- CreateTable
CREATE TABLE "ClassroomEnrollment" (
    "id" TEXT NOT NULL,
    "classroomId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ClassroomEnrollment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_WorkshopAttendees" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_EventStreamAttendees" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_ClassroomInstructors" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_ClassroomAttendees" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "ClassroomEnrollment_classroomId_userId_key" ON "ClassroomEnrollment"("classroomId", "userId");

-- CreateIndex
CREATE UNIQUE INDEX "_WorkshopAttendees_AB_unique" ON "_WorkshopAttendees"("A", "B");

-- CreateIndex
CREATE INDEX "_WorkshopAttendees_B_index" ON "_WorkshopAttendees"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_EventStreamAttendees_AB_unique" ON "_EventStreamAttendees"("A", "B");

-- CreateIndex
CREATE INDEX "_EventStreamAttendees_B_index" ON "_EventStreamAttendees"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_ClassroomInstructors_AB_unique" ON "_ClassroomInstructors"("A", "B");

-- CreateIndex
CREATE INDEX "_ClassroomInstructors_B_index" ON "_ClassroomInstructors"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_ClassroomAttendees_AB_unique" ON "_ClassroomAttendees"("A", "B");

-- CreateIndex
CREATE INDEX "_ClassroomAttendees_B_index" ON "_ClassroomAttendees"("B");

-- CreateIndex
CREATE UNIQUE INDEX "Classroom_channelName_key" ON "Classroom"("channelName");

-- AddForeignKey
ALTER TABLE "ClassroomEnrollment" ADD CONSTRAINT "ClassroomEnrollment_classroomId_fkey" FOREIGN KEY ("classroomId") REFERENCES "Classroom"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClassroomEnrollment" ADD CONSTRAINT "ClassroomEnrollment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_WorkshopAttendees" ADD CONSTRAINT "_WorkshopAttendees_A_fkey" FOREIGN KEY ("A") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_WorkshopAttendees" ADD CONSTRAINT "_WorkshopAttendees_B_fkey" FOREIGN KEY ("B") REFERENCES "Workshop"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_EventStreamAttendees" ADD CONSTRAINT "_EventStreamAttendees_A_fkey" FOREIGN KEY ("A") REFERENCES "EventStream"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_EventStreamAttendees" ADD CONSTRAINT "_EventStreamAttendees_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ClassroomInstructors" ADD CONSTRAINT "_ClassroomInstructors_A_fkey" FOREIGN KEY ("A") REFERENCES "Classroom"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ClassroomInstructors" ADD CONSTRAINT "_ClassroomInstructors_B_fkey" FOREIGN KEY ("B") REFERENCES "Instructor"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ClassroomAttendees" ADD CONSTRAINT "_ClassroomAttendees_A_fkey" FOREIGN KEY ("A") REFERENCES "Classroom"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ClassroomAttendees" ADD CONSTRAINT "_ClassroomAttendees_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
