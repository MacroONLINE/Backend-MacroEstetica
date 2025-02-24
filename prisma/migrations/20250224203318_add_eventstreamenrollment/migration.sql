-- CreateTable
CREATE TABLE "EventStreamEnrollment" (
    "id" TEXT NOT NULL,
    "eventStreamId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "EventStreamEnrollment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "EventStreamEnrollment_eventStreamId_userId_key" ON "EventStreamEnrollment"("eventStreamId", "userId");

-- AddForeignKey
ALTER TABLE "EventStreamEnrollment" ADD CONSTRAINT "EventStreamEnrollment_eventStreamId_fkey" FOREIGN KEY ("eventStreamId") REFERENCES "EventStream"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventStreamEnrollment" ADD CONSTRAINT "EventStreamEnrollment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
