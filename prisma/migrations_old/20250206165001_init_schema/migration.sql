/*
  Warnings:

  - You are about to drop the `EventParticipant` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "EventParticipant" DROP CONSTRAINT "EventParticipant_empresaId_fkey";

-- DropForeignKey
ALTER TABLE "EventParticipant" DROP CONSTRAINT "EventParticipant_eventId_fkey";

-- AlterTable
ALTER TABLE "Workshop" ADD COLUMN     "classroomId" TEXT,
ALTER COLUMN "eventId" DROP NOT NULL;

-- DropTable
DROP TABLE "EventParticipant";

-- CreateTable
CREATE TABLE "Classroom" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Classroom_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Workshop" ADD CONSTRAINT "Workshop_classroomId_fkey" FOREIGN KEY ("classroomId") REFERENCES "Classroom"("id") ON DELETE CASCADE ON UPDATE CASCADE;
