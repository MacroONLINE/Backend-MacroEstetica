import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ClassroomService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Añade la propiedad isLive a uno o varios classrooms
   */
  private setIsLiveOnClassrooms(classrooms: any | any[]): void {
    const now = new Date();
    if (Array.isArray(classrooms)) {
      for (const cls of classrooms) {
        cls.isLive = now >= cls.startDateTime && now <= cls.endDateTime;
      }
    } else if (classrooms) {
      classrooms.isLive = now >= classrooms.startDateTime && now <= classrooms.endDateTime;
    }
  }

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

  async getClassroomById(id: string) {
    const classroom = await this.prisma.classroom.findUnique({
      where: { id },
      include: {
        orators: true,
        attendees: true,
        enrollments: true,
      },
    });
    if (!classroom) throw new NotFoundException('Classroom no encontrado');

    this.setIsLiveOnClassrooms(classroom);
    return classroom;
  }

  async updateClassroom(id: string, data: any) {
    const classroom = await this.prisma.classroom.findUnique({ where: { id } });
    if (!classroom) throw new NotFoundException('Classroom no encontrado');

    const updated = await this.prisma.classroom.update({
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
      include: {
        orators: true,
        attendees: true,
        enrollments: true,
      },
    });

    this.setIsLiveOnClassrooms(updated);
    return updated;
  }

  async deleteClassroom(id: string) {
    const classroom = await this.prisma.classroom.findUnique({ where: { id } });
    if (!classroom) throw new NotFoundException('Classroom no encontrado');

    await this.prisma.classroom.delete({ where: { id } });
    return { message: 'Classroom eliminado correctamente' };
  }

  async getUpcomingClassrooms() {
    const now = new Date();
    const classrooms = await this.prisma.classroom.findMany({
      where: { startDateTime: { gte: now } },
      include: { orators: true, attendees: true, enrollments: true },
    });
    this.setIsLiveOnClassrooms(classrooms);
    return classrooms;
  }

  async getLiveClassrooms() {
    const now = new Date();
    const classrooms = await this.prisma.classroom.findMany({
      where: {
        startDateTime: { lte: now },
        endDateTime: { gte: now },
      },
      include: { orators: true, attendees: true, enrollments: true },
    });
    this.setIsLiveOnClassrooms(classrooms);
    return classrooms;
  }

  async addOrator(classroomId: string, instructorId: string) {
    const classroom = await this.prisma.classroom.findUnique({ where: { id: classroomId } });
    if (!classroom) throw new NotFoundException('Classroom no encontrado');
    const instructor = await this.prisma.instructor.findUnique({ where: { id: instructorId } });
    if (!instructor) throw new NotFoundException('Instructor no encontrado');

    return this.prisma.classroom.update({
      where: { id: classroomId },
      data: {
        orators: {
          connect: { id: instructorId },
        },
      },
      include: {
        orators: true,
      },
    });
  }

  async removeOrator(classroomId: string, instructorId: string) {
    const classroom = await this.prisma.classroom.findUnique({ where: { id: classroomId } });
    if (!classroom) throw new NotFoundException('Classroom no encontrado');
    const instructor = await this.prisma.instructor.findUnique({ where: { id: instructorId } });
    if (!instructor) throw new NotFoundException('Instructor no encontrado');

    return this.prisma.classroom.update({
      where: { id: classroomId },
      data: {
        orators: {
          disconnect: { id: instructorId },
        },
      },
      include: {
        orators: true,
      },
    });
  }
}
