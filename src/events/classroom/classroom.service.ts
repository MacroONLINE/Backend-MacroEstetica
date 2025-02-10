import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ClassroomService {
  constructor(private readonly prisma: PrismaService) {}

  async createClassroom(data: any) {
    return this.prisma.classroom.create({
      data: {
        title: data.title,
        description: data.description,
      },
    });
  }

  async getClassroomById(id: string) {
    return this.prisma.classroom.findUnique({
      where: { id },
      include: {
        workshops: true,
      },
    });
  }

  async updateClassroom(id: string, data: any) {
    const classroom = await this.prisma.classroom.findUnique({ where: { id } });
    if (!classroom) throw new NotFoundException('Classroom no encontrado');

    return this.prisma.classroom.update({
      where: { id },
      data: {
        title: data.title,
        description: data.description,
      },
    });
  }

  async deleteClassroom(id: string) {
    const classroom = await this.prisma.classroom.findUnique({ where: { id } });
    if (!classroom) throw new NotFoundException('Classroom no encontrado');

    await this.prisma.classroom.delete({ where: { id } });
    return { message: 'Classroom eliminado correctamente' };
  }

  
  async getUpcomingWorkshopsForClassroom(classroomId: string) {
    const now = new Date();
    return this.prisma.workshop.findMany({
      where: {
        classroomId,
        startDateTime: {
          gte: now, 
        },
      },
      orderBy: {
        startDateTime: 'asc',
      },
    });
  }

  async getUpcomingClassrooms() {
    const now = new Date();
    return this.prisma.classroom.findMany({
      where: {
        workshops: {
          some: {
            startDateTime: { gte: now },
          },
        },
      },
      include: {
        workshops: true,
      },
    });
  }
}
