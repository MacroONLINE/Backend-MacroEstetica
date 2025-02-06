/*
  Warnings:

  - You are about to drop the column `channelUrl` on the `Event` table. All the data in the column will be lost.
  - You are about to drop the column `channelUrl` on the `EventStream` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[channelName]` on the table `EventStream` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Event" DROP COLUMN "channelUrl",
ADD COLUMN     "instructorId" TEXT;

-- AlterTable
ALTER TABLE "EventStream" DROP COLUMN "channelUrl",
ADD COLUMN     "channelName" TEXT;

-- AlterTable
ALTER TABLE "Workshop" ADD COLUMN     "channelName" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "EventStream_channelName_key" ON "EventStream"("channelName");

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_instructorId_fkey" FOREIGN KEY ("instructorId") REFERENCES "Instructor"("id") ON DELETE CASCADE ON UPDATE CASCADE;
