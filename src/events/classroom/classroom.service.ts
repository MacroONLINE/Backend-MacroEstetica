// src/classroom/classroom.service.ts
import { Injectable, NotFoundException } from '@nestjs/common'
import { Prisma, $Enums } from '@prisma/client'
import { PrismaService } from 'src/prisma/prisma.service'
import { Express } from 'express'

type Ids = string[]

export interface CreateClassroomDto {
  title: string
  description: string
  price: number
  startDateTime: Date
  endDateTime: Date
  channelName?: string
  categories?: $Enums.Profession[]
  attendeeIds?: Ids
  oratorNames?: string
  image?: Express.Multer.File
}

export interface UpdateClassroomDto extends Partial<CreateClassroomDto> {}

const selectBase: Prisma.ClassroomSelect = {
  id: true,
  title: true,
  description: true,
  price: true,
  startDateTime: true,
  endDateTime: true,
  imageUrl: true,
  channelName: true,
  categories: true,
  oratorNames: true,
  attendees: { select: { id: true } },
  enrollments: { select: { id: true, userId: true, status: true } },
}

type Payload = Prisma.ClassroomGetPayload<{ select: typeof selectBase }>

@Injectable()
export class ClassroomService {
  constructor(private readonly prisma: PrismaService) {}

  private async uploadImage(file?: Express.Multer.File): Promise<string | undefined> {
    if (!file) return undefined
    return `https://cdn.example.com/uploads/${file.originalname}`
  }

  private connect(ids?: Ids) {
    return ids?.length ? { connect: ids.map((id) => ({ id })) } : undefined
  }

  private set(ids?: Ids) {
    return ids ? { set: ids.map((id) => ({ id })) } : undefined
  }

  private markLive(data: Payload | Payload[]) {
    const now = new Date()
    const flag = (c: Payload & { isLive?: boolean }) =>
      (c.isLive = now >= c.startDateTime && now <= c.endDateTime)
    Array.isArray(data) ? data.forEach(flag) : flag(data)
  }

  async createClassroom(dto: CreateClassroomDto) {
    const imageUrl = await this.uploadImage(dto.image)
    const created = await this.prisma.classroom.create({
      data: {
        title: dto.title,
        description: dto.description,
        price: dto.price,
        startDateTime: dto.startDateTime,
        endDateTime: dto.endDateTime,
        channelName: dto.channelName,
        imageUrl,
        categories: dto.categories,
        oratorNames: dto.oratorNames,
        attendees: this.connect(dto.attendeeIds),
      },
      select: selectBase,
    })
    this.markLive(created)
    return created
  }

  async getClassroomById(id: string) {
    const classroom = await this.prisma.classroom.findUnique({
      where: { id },
      select: selectBase,
    })
    if (!classroom) throw new NotFoundException('Classroom not found')
    this.markLive(classroom)
    return classroom
  }

  async updateClassroom(id: string, dto: UpdateClassroomDto) {
    await this.prisma.classroom.findUniqueOrThrow({ where: { id } })
    const imageUrl = dto.image ? await this.uploadImage(dto.image) : undefined
    const updated = await this.prisma.classroom.update({
      where: { id },
      data: {
        title: dto.title,
        description: dto.description,
        price: dto.price,
        startDateTime: dto.startDateTime,
        endDateTime: dto.endDateTime,
        channelName: dto.channelName,
        imageUrl,
        categories: dto.categories ? { set: dto.categories } : undefined,
        oratorNames: dto.oratorNames,
        attendees: this.set(dto.attendeeIds),
      },
      select: selectBase,
    })
    this.markLive(updated)
    return updated
  }

  async deleteClassroom(id: string) {
    await this.prisma.classroom.findUniqueOrThrow({ where: { id } })
    await this.prisma.classroom.delete({ where: { id } })
    return { message: 'Classroom eliminado correctamente' }
  }

  async getUpcomingClassrooms() {
    const now = new Date()
    const list = await this.prisma.classroom.findMany({
      where: { startDateTime: { gte: now } },
      select: selectBase,
    })
    this.markLive(list)
    return list
  }

  async getLiveClassrooms() {
    const now = new Date()
    const list = await this.prisma.classroom.findMany({
      where: { startDateTime: { lte: now }, endDateTime: { gte: now } },
      select: selectBase,
    })
    this.markLive(list)
    return list
  }
}
