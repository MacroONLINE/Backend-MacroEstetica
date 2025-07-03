"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClassroomService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const baseSelect = {
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
};
const markLive = (data) => {
    const now = new Date();
    const flag = (c) => {
        ;
        c.isLive = now >= c.startDateTime && now <= c.endDateTime;
    };
    Array.isArray(data) ? data.forEach(flag) : flag(data);
};
let ClassroomService = class ClassroomService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    connect(ids) {
        return ids?.length ? { connect: ids.map((id) => ({ id })) } : undefined;
    }
    set(ids) {
        return ids ? { set: ids.map((id) => ({ id })) } : undefined;
    }
    async createClassroom(dto) {
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
        });
        markLive(created);
        return created;
    }
    async getClassroomById(id) {
        const classroom = await this.prisma.classroom.findUnique({
            where: { id },
            select: baseSelect,
        });
        if (!classroom)
            throw new common_1.NotFoundException('Classroom no encontrado');
        markLive(classroom);
        return classroom;
    }
    async updateClassroom(id, dto) {
        await this.prisma.classroom.findUniqueOrThrow({ where: { id } });
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
        });
        markLive(updated);
        return updated;
    }
    async deleteClassroom(id) {
        await this.prisma.classroom.findUniqueOrThrow({ where: { id } });
        await this.prisma.classroom.delete({ where: { id } });
        return { message: 'Classroom eliminado correctamente' };
    }
    async getUpcomingClassrooms() {
        const now = new Date();
        const list = await this.prisma.classroom.findMany({
            where: { startDateTime: { gte: now } },
            select: baseSelect,
        });
        markLive(list);
        return list;
    }
    async getLiveClassrooms() {
        const now = new Date();
        const list = await this.prisma.classroom.findMany({
            where: { startDateTime: { lte: now }, endDateTime: { gte: now } },
            select: baseSelect,
        });
        markLive(list);
        return list;
    }
    async addOrator(classroomId, instructorId) {
        await this.prisma.classroom.findUniqueOrThrow({ where: { id: classroomId } });
        await this.prisma.instructor.findUniqueOrThrow({ where: { id: instructorId } });
        return this.prisma.classroom.update({
            where: { id: classroomId },
            data: { orators: { connect: { id: instructorId } } },
            select: { id: true, orators: { select: { id: true } } },
        });
    }
    async removeOrator(classroomId, instructorId) {
        await this.prisma.classroom.findUniqueOrThrow({ where: { id: classroomId } });
        await this.prisma.instructor.findUniqueOrThrow({ where: { id: instructorId } });
        return this.prisma.classroom.update({
            where: { id: classroomId },
            data: { orators: { disconnect: { id: instructorId } } },
            select: { id: true, orators: { select: { id: true } } },
        });
    }
};
exports.ClassroomService = ClassroomService;
exports.ClassroomService = ClassroomService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ClassroomService);
//# sourceMappingURL=classroom.service.js.map