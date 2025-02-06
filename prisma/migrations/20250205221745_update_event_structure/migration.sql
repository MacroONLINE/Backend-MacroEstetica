/*
  Warnings:

  - You are about to drop the column `bannerUrl` on the `Event` table. All the data in the column will be lost.
  - You are about to drop the column `companyId` on the `Event` table. All the data in the column will be lost.
  - You are about to drop the column `ctaButtonText` on the `Event` table. All the data in the column will be lost.
  - You are about to drop the column `ctaUrl` on the `Event` table. All the data in the column will be lost.
  - You are about to drop the column `date` on the `Event` table. All the data in the column will be lost.
  - You are about to drop the column `description` on the `Event` table. All the data in the column will be lost.
  - You are about to drop the column `instructorId` on the `Event` table. All the data in the column will be lost.
  - You are about to drop the column `location` on the `Event` table. All the data in the column will be lost.
  - You are about to drop the column `logoUrl` on the `Event` table. All the data in the column will be lost.
  - You are about to drop the column `time` on the `Event` table. All the data in the column will be lost.
  - You are about to drop the column `channelName` on the `EventStream` table. All the data in the column will be lost.
  - You are about to drop the `_EventCategories` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Event" DROP CONSTRAINT "Event_instructorId_fkey";

-- DropForeignKey
ALTER TABLE "_EventCategories" DROP CONSTRAINT "_EventCategories_A_fkey";

-- DropForeignKey
ALTER TABLE "_EventCategories" DROP CONSTRAINT "_EventCategories_B_fkey";

-- DropIndex
DROP INDEX "EventStream_channelName_key";

-- AlterTable
ALTER TABLE "Event" DROP COLUMN "bannerUrl",
DROP COLUMN "companyId",
DROP COLUMN "ctaButtonText",
DROP COLUMN "ctaUrl",
DROP COLUMN "date",
DROP COLUMN "description",
DROP COLUMN "instructorId",
DROP COLUMN "location",
DROP COLUMN "logoUrl",
DROP COLUMN "time",
ADD COLUMN     "channelUrl" TEXT,
ADD COLUMN     "leadingCompanyId" TEXT,
ADD COLUMN     "longDescription" TEXT,
ADD COLUMN     "mainBannerUrl" TEXT,
ADD COLUMN     "mainImageUrl" TEXT,
ADD COLUMN     "mapUrl" TEXT,
ADD COLUMN     "physicalLocation" TEXT,
ADD COLUMN     "target" "Target",
ALTER COLUMN "endDateTime" DROP DEFAULT,
ALTER COLUMN "startDateTime" DROP DEFAULT;

-- AlterTable
ALTER TABLE "EventStream" DROP COLUMN "channelName",
ADD COLUMN     "channelUrl" TEXT;

-- DropTable
DROP TABLE "_EventCategories";

-- CreateTable
CREATE TABLE "EventParticipant" (
    "id" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,
    "empresaId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "EventParticipant_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EventEnrollment" (
    "id" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "EventEnrollment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EventOrganizer" (
    "id" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "career" TEXT,
    "photoUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "EventOrganizer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Workshop" (
    "id" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "whatYouWillLearn" TEXT,
    "price" DOUBLE PRECISION,
    "startDateTime" TIMESTAMP(3) NOT NULL,
    "endDateTime" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Workshop_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WorkshopEnrollment" (
    "id" TEXT NOT NULL,
    "workshopId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "WorkshopEnrollment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EventOffer" (
    "id" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,
    "sectionTitle" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "EventOffer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EventOfferProduct" (
    "id" TEXT NOT NULL,
    "offerId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "EventOfferProduct_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_WorkshopInstructors" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_StreamOrators" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "EventParticipant_eventId_empresaId_key" ON "EventParticipant"("eventId", "empresaId");

-- CreateIndex
CREATE UNIQUE INDEX "EventEnrollment_eventId_userId_key" ON "EventEnrollment"("eventId", "userId");

-- CreateIndex
CREATE UNIQUE INDEX "WorkshopEnrollment_workshopId_userId_key" ON "WorkshopEnrollment"("workshopId", "userId");

-- CreateIndex
CREATE UNIQUE INDEX "_WorkshopInstructors_AB_unique" ON "_WorkshopInstructors"("A", "B");

-- CreateIndex
CREATE INDEX "_WorkshopInstructors_B_index" ON "_WorkshopInstructors"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_StreamOrators_AB_unique" ON "_StreamOrators"("A", "B");

-- CreateIndex
CREATE INDEX "_StreamOrators_B_index" ON "_StreamOrators"("B");

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_leadingCompanyId_fkey" FOREIGN KEY ("leadingCompanyId") REFERENCES "Empresa"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventParticipant" ADD CONSTRAINT "EventParticipant_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventParticipant" ADD CONSTRAINT "EventParticipant_empresaId_fkey" FOREIGN KEY ("empresaId") REFERENCES "Empresa"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventEnrollment" ADD CONSTRAINT "EventEnrollment_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventEnrollment" ADD CONSTRAINT "EventEnrollment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventOrganizer" ADD CONSTRAINT "EventOrganizer_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Workshop" ADD CONSTRAINT "Workshop_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkshopEnrollment" ADD CONSTRAINT "WorkshopEnrollment_workshopId_fkey" FOREIGN KEY ("workshopId") REFERENCES "Workshop"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkshopEnrollment" ADD CONSTRAINT "WorkshopEnrollment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventOffer" ADD CONSTRAINT "EventOffer_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventOfferProduct" ADD CONSTRAINT "EventOfferProduct_offerId_fkey" FOREIGN KEY ("offerId") REFERENCES "EventOffer"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_WorkshopInstructors" ADD CONSTRAINT "_WorkshopInstructors_A_fkey" FOREIGN KEY ("A") REFERENCES "Instructor"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_WorkshopInstructors" ADD CONSTRAINT "_WorkshopInstructors_B_fkey" FOREIGN KEY ("B") REFERENCES "Workshop"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_StreamOrators" ADD CONSTRAINT "_StreamOrators_A_fkey" FOREIGN KEY ("A") REFERENCES "EventStream"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_StreamOrators" ADD CONSTRAINT "_StreamOrators_B_fkey" FOREIGN KEY ("B") REFERENCES "Instructor"("id") ON DELETE CASCADE ON UPDATE CASCADE;
