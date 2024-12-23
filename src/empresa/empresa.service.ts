import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma, EmpresaCategory, Target } from '@prisma/client';


@Injectable()
export class EmpresaService {
  constructor(private readonly prisma: PrismaService) {}

  async getAllByCategory(category: EmpresaCategory) {
    return this.prisma.empresa.findMany({
      where: { categoria: category },
    });
  }
  
  async getAllByTarget(target: Target) {
    return this.prisma.empresa.findMany({
      where: { instructores: { some: { courses: { some: { target } } } } },
    });
  }
  
}
