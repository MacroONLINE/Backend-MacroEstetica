/*
  Warnings:

  - The values [ESTETICISTA] on the enum `Target` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "Target_new" AS ENUM ('MEDICO', 'COSMETOLOGO');
ALTER TABLE "Course" ALTER COLUMN "target" DROP DEFAULT;
ALTER TABLE "Course" ALTER COLUMN "target" TYPE "Target_new" USING ("target"::text::"Target_new");
ALTER TYPE "Target" RENAME TO "Target_old";
ALTER TYPE "Target_new" RENAME TO "Target";
DROP TYPE "Target_old";
ALTER TABLE "Course" ALTER COLUMN "target" SET DEFAULT 'MEDICO';
COMMIT;
