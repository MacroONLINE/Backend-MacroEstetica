import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  // Hashear la contraseña
  const hashedPassword = await bcrypt.hash('securePassword123', 10);
  // Crear un usuario estándar
  await prisma.user.create({
    data: {
      firstName: 'Usuario',
      lastName: 'Estándar',
      email: 'usuario.estandar@example.com',
      password: hashedPassword,
      role: 'ESTANDAR',
    },
  });

  // Crear un usuario médico con datos asociados
  await prisma.user.create({
    data: {
      firstName: 'Dr. Ana',
      lastName: 'Rico',
      email: 'ana.rico@example.com',
      password: hashedPassword,
      role: 'MEDICO',
      medico: {
        create: {
          verification: 'http://example.com/verificacion/ana-gonzalez',
        },
      },
    },
  });

  // Crear un usuario empresa con datos asociados
  await prisma.user.create({
    data: {
      firstName: 'Empresa XYZ',
      lastName: 'S.A. de C.V.',
      email: 'contacto@empresa.xyz',
      password: hashedPassword,
      role: 'EMPRESA',
      empresa: {
        create: {
          dni: 'MX987654321',
        },
      },
    },
  });

  console.log('¡Seeding completado exitosamente!');
}

main()
  .catch((e) => {
    console.error('Error durante el seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
