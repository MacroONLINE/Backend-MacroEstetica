-- DropForeignKey
ALTER TABLE "ClassComment" DROP CONSTRAINT "ClassComment_userId_fkey";

-- DropForeignKey
ALTER TABLE "ClassComment" DROP CONSTRAINT "ClassComment_classId_fkey";

-- DropForeignKey
ALTER TABLE "ClassComment" DROP CONSTRAINT "ClassComment_parentId_fkey";

-- AlterTable
ALTER TABLE "Comment" ADD COLUMN     "parentCommentId" TEXT;

-- DropTable
DROP TABLE "ClassComment";

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_parentCommentId_fkey" FOREIGN KEY ("parentCommentId") REFERENCES "Comment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

