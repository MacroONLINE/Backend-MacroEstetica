-- AlterTable
ALTER TABLE "Class" ALTER COLUMN "moduleId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Comment" ADD COLUMN     "courseId" TEXT,
ALTER COLUMN "classId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Course" ADD COLUMN     "aboutDescription" TEXT,
ADD COLUMN     "requirements" JSONB,
ADD COLUMN     "totalHours" INTEGER NOT NULL DEFAULT 1,
ADD COLUMN     "whatYouWillLearn" JSONB;

-- AlterTable
ALTER TABLE "Module" ALTER COLUMN "courseId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Product" ALTER COLUMN "updatedAt" SET DEFAULT CURRENT_TIMESTAMP;

-- CreateTable
CREATE TABLE "Resource" (
    "id" TEXT NOT NULL,
    "courseId" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Resource_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Resource" ADD CONSTRAINT "Resource_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE CASCADE ON UPDATE CASCADE;
