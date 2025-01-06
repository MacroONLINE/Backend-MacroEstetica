import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class EventsService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Obtiene todos los eventos asociados a una empresa.
   * @param empresaId ID de la empresa
   * @returns Lista de eventos
   */
  async getEventsByEmpresaId(empresaId: string) {
    return this.prisma.event.findMany({
      where: { companyId: empresaId },
      include: {
        // Ajusta lo que quieras incluir en la respuesta
        instructor: true,
        categories: true,
        attendees: true,
      },
    });
  }


}
