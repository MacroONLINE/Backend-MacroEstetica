-- AlterTable
ALTER TABLE "Classroom" ALTER COLUMN "categories" SET DEFAULT ARRAY['MEDICO_DERMATOLOGIA']::"Profession"[];

-- AlterTable
ALTER TABLE "Event" ALTER COLUMN "categories" SET DEFAULT ARRAY['MEDICO_DERMATOLOGIA']::"Profession"[];

-- AlterTable
ALTER TABLE "EventStream" ADD COLUMN     "description" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "name" TEXT NOT NULL DEFAULT '',
ALTER COLUMN "categories" SET DEFAULT ARRAY['MEDICO_DERMATOLOGIA']::"Profession"[];

-- AlterTable
ALTER TABLE "Workshop" ALTER COLUMN "categories" SET DEFAULT ARRAY['MEDICO_DERMATOLOGIA']::"Profession"[];
