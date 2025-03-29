-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "Profession" ADD VALUE 'MEDICO_DERMATOLOGIA';
ALTER TYPE "Profession" ADD VALUE 'MEDICO_MEDICINA_ESTETICA';
ALTER TYPE "Profession" ADD VALUE 'MEDICO_ESTUDIANTE_DE_MEDICINA';
ALTER TYPE "Profession" ADD VALUE 'COSMETOLOGO_COSMIATRIA';
ALTER TYPE "Profession" ADD VALUE 'COSMETOLOGO_COSMETOLOGIA';
ALTER TYPE "Profession" ADD VALUE 'COSMETOLOGO_ADMINISTRACION_SPA';
ALTER TYPE "Profession" ADD VALUE 'COSMETOLOGO_NUTRICION';
ALTER TYPE "Profession" ADD VALUE 'COSMETOLOGO_TERAPIA_FISICA_REHABILITACION';
ALTER TYPE "Profession" ADD VALUE 'COSMETOLOGO_MEDICINA_ALTERNATIVA';
ALTER TYPE "Profession" ADD VALUE 'COSMETOLOGO_QUIMICA_COSMETICA';
ALTER TYPE "Profession" ADD VALUE 'COSMETOLOGO_ESTUDIANTE_AREA_ESTETICA';
ALTER TYPE "Profession" ADD VALUE 'COSMETOLOGO_ESTETICA';

-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "SubscriptionType" ADD VALUE 'BASIC';
ALTER TYPE "SubscriptionType" ADD VALUE 'INTERMIDIATE';
ALTER TYPE "SubscriptionType" ADD VALUE 'PREMIUM';

-- AlterTable
ALTER TABLE "Medico" ALTER COLUMN "type" SET DEFAULT 'MEDICO';
