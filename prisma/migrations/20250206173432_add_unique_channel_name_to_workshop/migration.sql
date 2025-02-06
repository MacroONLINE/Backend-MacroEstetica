/*
  Warnings:

  - A unique constraint covering the columns `[channelName]` on the table `Workshop` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Workshop_channelName_key" ON "Workshop"("channelName");
