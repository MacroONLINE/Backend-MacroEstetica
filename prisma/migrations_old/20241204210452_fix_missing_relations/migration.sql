/*
  Warnings:

  - You are about to drop the column `category` on the `Course` table. All the data in the column will be lost.
  - You are about to drop the column `certification` on the `Course` table. All the data in the column will be lost.
  - You are about to drop the column `certificationName` on the `Course` table. All the data in the column will be lost.
  - You are about to drop the column `colorCategory` on the `Course` table. All the data in the column will be lost.
  - You are about to drop the column `courseHours` on the `Course` table. All the data in the column will be lost.
  - You are about to drop the column `detailedDescription` on the `Course` table. All the data in the column will be lost.
  - You are about to drop the column `iconCategory` on the `Course` table. All the data in the column will be lost.
  - You are about to drop the column `instructorName` on the `Course` table. All the data in the column will be lost.
  - You are about to drop the column `modulesCount` on the `Course` table. All the data in the column will be lost.
  - You are about to drop the column `requirements` on the `Course` table. All the data in the column will be lost.
  - You are about to drop the column `resourcesCount` on the `Course` table. All the data in the column will be lost.
  - You are about to drop the column `whatYouWillLearn` on the `Course` table. All the data in the column will be lost.
  - You are about to drop the column `categoryId` on the `Empresa` table. All the data in the column will be lost.
  - You are about to drop the `CategoriesOnCourses` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `categoryId` to the `Course` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "CategoriesOnCourses" DROP CONSTRAINT "CategoriesOnCourses_categoryId_fkey";

-- DropForeignKey
ALTER TABLE "CategoriesOnCourses" DROP CONSTRAINT "CategoriesOnCourses_courseId_fkey";

-- DropForeignKey
ALTER TABLE "Empresa" DROP CONSTRAINT "Empresa_categoryId_fkey";

-- AlterTable
ALTER TABLE "Course" DROP COLUMN "category",
DROP COLUMN "certification",
DROP COLUMN "certificationName",
DROP COLUMN "colorCategory",
DROP COLUMN "courseHours",
DROP COLUMN "detailedDescription",
DROP COLUMN "iconCategory",
DROP COLUMN "instructorName",
DROP COLUMN "modulesCount",
DROP COLUMN "requirements",
DROP COLUMN "resourcesCount",
DROP COLUMN "whatYouWillLearn",
ADD COLUMN     "categoryId" TEXT NOT NULL,
ALTER COLUMN "rating" SET DEFAULT 0,
ALTER COLUMN "commentsCount" SET DEFAULT 0,
ALTER COLUMN "averageRating" SET DEFAULT 0,
ALTER COLUMN "discountPercentage" DROP NOT NULL,
ALTER COLUMN "participantsCount" SET DEFAULT 0;

-- AlterTable
ALTER TABLE "Empresa" DROP COLUMN "categoryId";

-- AlterTable
ALTER TABLE "Session" ALTER COLUMN "updatedAt" DROP DEFAULT;

-- DropTable
DROP TABLE "CategoriesOnCourses";

-- AddForeignKey
ALTER TABLE "Course" ADD CONSTRAINT "Course_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE CASCADE ON UPDATE CASCADE;
