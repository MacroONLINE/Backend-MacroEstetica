-- CreateTable
CREATE TABLE "CoursesFetch" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "instructor" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "comments" INTEGER NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "rating" DOUBLE PRECISION NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "categoryName" TEXT NOT NULL,
    "categoryIcon" TEXT NOT NULL,
    "featured" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "CoursesFetch_pkey" PRIMARY KEY ("id")
);
