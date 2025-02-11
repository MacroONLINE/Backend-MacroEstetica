import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ClassroomService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Crea un nuevo Classroom
   */
  async createClassroom(data: any) {
    return this.prisma.classroom.create({
      data: {
        title: data.title,
        description: data.description,
        price: data.price,
        startDateTime: data.startDateTime,
        endDateTime: data.endDateTime,
        imageUrl: data.imageUrl,
        channelName: data.channelName,
      },
    });
  }

  /**
   * Obtiene un Classroom por su ID (incluyendo orators, attendees y enrollments)
   */
  async getClassroomById(id: string) {
    return this.prisma.classroom.findUnique({
      where: { id },
      include: {
        orators: true,
        attendees: true,
        enrollments: true,
      },
    });
  }

  /**
   * Actualiza datos de un Classroom
   */
  async updateClassroom(id: string, data: any) {
    const classroom = await this.prisma.classroom.findUnique({ where: { id } });
    if (!classroom) throw new NotFoundException('Classroom no encontrado');

    return this.prisma.classroom.update({
      where: { id },
      data: {
        title: data.title,
        description: data.description,
        price: data.price,
        startDateTime: data.startDateTime,
        endDateTime: data.endDateTime,
        imageUrl: data.imageUrl,
        channelName: data.channelName,
      },
    });
  }

  /**
   * Elimina un Classroom
   */
  async deleteClassroom(id: string) {
    const classroom = await this.prisma.classroom.findUnique({ where: { id } });
    if (!classroom) throw new NotFoundException('Classroom no encontrado');

    await this.prisma.classroom.delete({ where: { id } });
    return { message: 'Classroom eliminado correctamente' };
  }

  /**
   * Obtiene todos los Classrooms que aún no han iniciado (startDateTime >= now)
   */
  async getUpcomingClassrooms() {
    const now = new Date();
    return this.prisma.classroom.findMany({
      where: {
        startDateTime: {
          gte: now,
        },
      },
      include: {
        orators: true,
        attendees: true,
        enrollments: true,
      },
    });
  }
}
