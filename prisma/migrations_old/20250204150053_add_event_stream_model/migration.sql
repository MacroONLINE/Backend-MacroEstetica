/*
  Warnings:

  - You are about to drop the column `channelName` on the `Event` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Event" DROP COLUMN "channelName",
ALTER COLUMN "ctaUrl" SET DEFAULT '';

-- AlterTable
ALTER TABLE "Subscription" ALTER COLUMN "updatedAt" SET DEFAULT CURRENT_TIMESTAMP;

-- CreateTable
CREATE TABLE "EventStream" (
    "id" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,
    "channelName" TEXT NOT NULL,
    "startDateTime" TIMESTAMP(3) NOT NULL,
    "endDateTime" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "EventStream_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "EventStream_channelName_key" ON "EventStream"("channelName");

-- AddForeignKey
ALTER TABLE "EventStream" ADD CONSTRAINT "EventStream_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE CASCADE ON UPDATE CASCADE;
