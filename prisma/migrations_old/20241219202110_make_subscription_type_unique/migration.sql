/*
  Warnings:

  - A unique constraint covering the columns `[type]` on the table `Subscription` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Subscription_type_key" ON "Subscription"("type");
