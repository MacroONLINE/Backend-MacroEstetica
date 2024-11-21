-- CreateTable
CREATE TABLE "Producto" (
    "id" SERIAL NOT NULL,
    "nombre" VARCHAR(200) NOT NULL,
    "descripcion" TEXT,
    "costo" DECIMAL(10,2) NOT NULL,
    "descuento" DECIMAL(10,2),
    "codigoProducto" VARCHAR(100) NOT NULL,
    "cantidadDisponible" INTEGER NOT NULL,
    "idEmpresa" TEXT NOT NULL,
    "idProveedor" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Producto_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Producto_codigoProducto_key" ON "Producto"("codigoProducto");

-- AddForeignKey
ALTER TABLE "Producto" ADD CONSTRAINT "Producto_idEmpresa_fkey" FOREIGN KEY ("idEmpresa") REFERENCES "Empresa"("id") ON DELETE CASCADE ON UPDATE CASCADE;
