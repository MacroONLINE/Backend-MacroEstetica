// src/classroom/classroom.service.ts

import { Injectable, NotFoundException } from '@nestjs/common'
import { Prisma, $Enums } from '@prisma/client'
import { PrismaService } from 'src/prisma/prisma.service'

type Ids = string[]

export interface CreateClassroomDto {
  title: string
  description: string
  price: number
  startDateTime: string
  endDateTime: string
  imageUrl?: string
  channelName?: string
  categories?: $Enums.Profession[]
  oratorIds?: Ids
  attendeeIds?: Ids
}

export interface UpdateClassroomDto extends Partial<CreateClassroomDto> {}

/* -------------------------------------------------------------------------- */
/* helpers OUTSIDE the class so TS accepts them                               */
/* -------------------------------------------------------------------------- */

const baseSelect: Prisma.ClassroomSelect = {
  id: true,
  title: true,
  description: true,
  price: true,
  startDateTime: true,
  endDateTime: true,
  imageUrl: true,
  channelName: true,
  categories: true,
  orators: { select: { id: true } },
  attendees: { select: { id: true } },
}

type ClassroomPayload = Prisma.ClassroomGetPayload<{ select: typeof baseSelect }>

const markLive = (data: ClassroomPayload | ClassroomPayload[]) => {
  const now = new Date()
  const flag = (c: ClassroomPayload & { isLive?: boolean }) => {
    ;(c as any).isLive = now >= c.startDateTime && now <= c.endDateTime
  }
  Array.isArray(data) ? data.forEach(flag) : flag(data)
}

@Injectable()
export class ClassroomService {
  constructor(private readonly prisma: PrismaService) {}

  /* relation helpers */
  private connect(ids?: Ids) {
    return ids?.length ? { connect: ids.map((id) => ({ id })) } : undefined
  }

  private set(ids?: Ids) {
    return ids ? { set: ids.map((id) => ({ id })) } : undefined
  }

  /* ---------------------------------------------------------------------- */
  /* CREATE                                                                  */
  /* ---------------------------------------------------------------------- */
  async createClassroom(dto: CreateClassroomDto) {
    const created = await this.prisma.classroom.create({
      data: {
        title: dto.title,
        description: dto.description,
        price: dto.price,
        startDateTime: dto.startDateTime,
        endDateTime: dto.endDateTime,
        imageUrl: dto.imageUrl,
        channelName: dto.channelName,
        categories: dto.categories,
        orators: this.connect(dto.oratorIds),
        attendees: this.connect(dto.attendeeIds),
      },
      select: baseSelect,
    })
    markLive(created)
    return created
  }

  /* ---------------------------------------------------------------------- */
  /* READ                                                                    */
  /* ---------------------------------------------------------------------- */
  async getClassroomById(id: string) {
    const classroom = await this.prisma.classroom.findUnique({
      where: { id },
      select: baseSelect,
    })
    if (!classroom) throw new NotFoundException('Classroom no encontrado')
    markLive(classroom)
    return classroom
  }

  /* ---------------------------------------------------------------------- */
  /* UPDATE                                                                  */
  /* ---------------------------------------------------------------------- */
  async updateClassroom(id: string, dto: UpdateClassroomDto) {
    await this.prisma.classroom.findUniqueOrThrow({ where: { id } })
    const updated = await this.prisma.classroom.update({
      where: { id },
      data: {
        title: dto.title,
        description: dto.description,
        price: dto.price,
        startDateTime: dto.startDateTime,
        endDateTime: dto.endDateTime,
        imageUrl: dto.imageUrl,
        channelName: dto.channelName,
        categories: dto.categories ? { set: dto.categories } : undefined,
        orators: this.set(dto.oratorIds),
        attendees: this.set(dto.attendeeIds),
      },
      select: baseSelect,
    })
    markLive(updated)
    return updated
  }

  /* ---------------------------------------------------------------------- */
  /* DELETE                                                                  */
  /* ---------------------------------------------------------------------- */
  async deleteClassroom(id: string) {
    await this.prisma.classroom.findUniqueOrThrow({ where: { id } })
    await this.prisma.classroom.delete({ where: { id } })
    return { message: 'Classroom eliminado correctamente' }
  }

  /* ---------------------------------------------------------------------- */
  /* LISTS                                                                   */
  /* ---------------------------------------------------------------------- */
  async getUpcomingClassrooms() {
    const now = new Date()
    const list = await this.prisma.classroom.findMany({
      where: { startDateTime: { gte: now } },
      select: baseSelect,
    })
    markLive(list)
    return list
  }

  async getLiveClassrooms() {
    const now = new Date()
    const list = await this.prisma.classroom.findMany({
      where: { startDateTime: { lte: now }, endDateTime: { gte: now } },
      select: baseSelect,
    })
    markLive(list)
    return list
  }

  /* ---------------------------------------------------------------------- */
  /* ORATORS                                                                 */
  /* ---------------------------------------------------------------------- */
  async addOrator(classroomId: string, instructorId: string) {
    await this.prisma.classroom.findUniqueOrThrow({ where: { id: classroomId } })
    await this.prisma.instructor.findUniqueOrThrow({ where: { id: instructorId } })
    return this.prisma.classroom.update({
      where: { id: classroomId },
      data: { orators: { connect: { id: instructorId } } },
      select: { id: true, orators: { select: { id: true } } },
    })
  }

  async removeOrator(classroomId: string, instructorId: string) {
    await this.prisma.classroom.findUniqueOrThrow({ where: { id: classroomId } })
    await this.prisma.instructor.findUniqueOrThrow({ where: { id: instructorId } })
    return this.prisma.classroom.update({
      where: { id: classroomId },
      data: { orators: { disconnect: { id: instructorId } } },
      select: { id: true, orators: { select: { id: true } } },
    })
  }
}
