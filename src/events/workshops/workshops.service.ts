import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { randomUUID } from 'crypto';

@Injectable()
export class WorkshopsService {
  constructor(private readonly prisma: PrismaService) {}

  async createWorkshop(data: any) {

    const channelName = data.channelName || randomUUID();

    return this.prisma.workshop.create({
      data: {
        eventId: data.eventId,
        title: data.title,
        description: data.description,
        whatYouWillLearn: data.whatYouWillLearn,
        price: data.price,
        startDateTime: data.startDateTime,
        endDateTime: data.endDateTime,
        channelName,
      },
    });
  }

  async getWorkshopById(id: string) {
    return this.prisma.workshop.findUnique({
      where: { id },
      include: {
        event: true,
        orators: true,
        enrollments: {
          include: {
            user: true,
          },
        },
      },
    });
  }

  async updateWorkshop(id: string, data: any) {
    const workshop = await this.prisma.workshop.findUnique({ where: { id } });
    if (!workshop) throw new NotFoundException('Workshop no encontrado');
    return this.prisma.workshop.update({
      where: { id },
      data: {
        title: data.title,
        description: data.description,
        whatYouWillLearn: data.whatYouWillLearn,
        price: data.price,
        startDateTime: data.startDateTime,
        endDateTime: data.endDateTime,
        channelName: data.channelName,
      },
    });
  }

  async deleteWorkshop(id: string) {
    const workshop = await this.prisma.workshop.findUnique({ where: { id } });
    if (!workshop) throw new NotFoundException('Workshop no encontrado');
    await this.prisma.workshop.delete({ where: { id } });
    return { message: 'Workshop eliminado correctamente' };
  }

  async getWorkshopByChannel(channelName: string) {
    return this.prisma.workshop.findUnique({
      where: { channelName },
      include: {
        event: true,
        orators: true,
        enrollments: {
          include: {
            user: true,
          },
        },
      },
    });
  }
}
