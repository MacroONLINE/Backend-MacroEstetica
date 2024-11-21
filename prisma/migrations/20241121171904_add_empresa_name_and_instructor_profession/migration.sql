-- Crear el enum para 'profession'
CREATE TYPE "Profession" AS ENUM ('MEDICO', 'ESTETICISTA');

-- Modificar la tabla 'Empresa'
ALTER TABLE "Empresa" 
ADD COLUMN "categoryId" TEXT,
ADD COLUMN "name" TEXT DEFAULT 'Default Name';

-- Actualizar los registros existentes de 'Empresa'
UPDATE "Empresa" SET "name" = 'Default Name' WHERE "name" IS NULL;

-- Hacer que la columna 'name' sea obligatoria después de actualizar los registros
ALTER TABLE "Empresa" ALTER COLUMN "name" SET NOT NULL;

-- Modificar la tabla 'Instructor'
ALTER TABLE "Instructor" 
DROP COLUMN "bio",
ADD COLUMN "profession" "Profession" DEFAULT 'ESTETICISTA';

-- Actualizar los registros existentes de 'Instructor'
UPDATE "Instructor" SET "profession" = 'ESTETICISTA' WHERE "profession" IS NULL;

-- Hacer que la columna 'profession' sea obligatoria después de actualizar los registros
ALTER TABLE "Instructor" ALTER COLUMN "profession" DROP DEFAULT;

-- Añadir la clave foránea para 'categoryId' en la tabla 'Empresa'
ALTER TABLE "Empresa" 
ADD CONSTRAINT "Empresa_categoryId_fkey" 
FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE SET NULL ON UPDATE CASCADE;
