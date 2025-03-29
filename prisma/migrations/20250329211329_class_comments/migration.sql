-- CreateTable
CREATE TABLE "ClassComment" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "classId" TEXT NOT NULL,
    "parentCommentId" TEXT,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ClassComment_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ClassComment" ADD CONSTRAINT "ClassComment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClassComment" ADD CONSTRAINT "ClassComment_classId_fkey" FOREIGN KEY ("classId") REFERENCES "Class"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClassComment" ADD CONSTRAINT "ClassComment_parentCommentId_fkey" FOREIGN KEY ("parentCommentId") REFERENCES "ClassComment"("id") ON DELETE CASCADE ON UPDATE CASCADE;
