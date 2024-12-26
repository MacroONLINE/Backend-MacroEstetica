import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Giro, Target } from '@prisma/client';

@Injectable()
export class EmpresaService {
  constructor(private readonly prisma: PrismaService) {}

  async getAllByCategory(category: Giro) {
    return this.prisma.empresa.findMany({
      where: {
        giro: category,
      },
      include: {
        user: true, // Incluye información del usuario relacionado, si es necesario
      },
    });
  }

  async getAllByTarget(target: Target) {
    return this.prisma.empresa.findMany({
      where: {
        user: {
          role: target,
        },
      },
      include: {
        user: true, 
      },
    });
  }

  async getAllByGiroAndTarget(giro: Giro, target: Target) {
    return this.prisma.empresa.findMany({
      where: {
        giro,
        user: {
          role: target,
        },
      },
      include: {
        user: true, 
      },
    });
  }
}
