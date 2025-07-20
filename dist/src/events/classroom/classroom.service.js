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
const selectBase = {
    id: true,
    title: true,
    description: true,
    startDateTime: true,
    endDateTime: true,
    price: true,
    channelName: true,
    imageUrl: true,
    categories: true,
    empresaId: true,
    orators: { select: { id: true } },
    attendees: { select: { id: true } },
    enrollments: { select: { id: true, userId: true, status: true } },
    invites: {
        select: {
            id: true,
            email: true,
            status: true,
            sentAt: true,
            acceptedAt: true,
            userId: true,
        },
    },
};
let ClassroomService = class ClassroomService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async uploadImage(file) {
        if (!file)
            return undefined;
        return `https://cdn.example.com/uploads/${file.originalname}`;
    }
    connect(ids) {
        return ids?.length ? { connect: ids.map(id => ({ id })) } : undefined;
    }
    set(ids) {
        return ids ? { set: ids.map(id => ({ id })) } : undefined;
    }
    markLive(data) {
        const now = new Date();
        const flag = (c) => {
            c.isLive = now >= c.startDateTime && now <= c.endDateTime;
        };
        Array.isArray(data) ? data.forEach(flag) : flag(data);
    }
    async createClassroom(empresaId, dto, image) {
        const empresa = await this.prisma.empresa.findUnique({ where: { id: empresaId } });
        if (!empresa)
            throw new common_1.BadRequestException('Empresa no encontrada');
        const imageUrl = await this.uploadImage(image);
        const created = await this.prisma.classroom.create({
            data: {
                title: dto.title,
                description: dto.description,
                startDateTime: dto.startDateTime,
                endDateTime: dto.endDateTime,
                price: dto.price,
                channelName: dto.channelName,
                imageUrl,
                categories: dto.categories,
                empresaId,
                orators: this.connect(dto.oratorIds),
            },
            select: selectBase,
        });
        this.markLive(created);
        return created;
    }
    async getClassroomById(id) {
        const classroom = await this.prisma.classroom.findUnique({ where: { id }, select: selectBase });
        if (!classroom)
            throw new common_1.NotFoundException('Classroom not found');
        this.markLive(classroom);
        return classroom;
    }
    async updateClassroom(id, empresaId, dto, image) {
        await this.prisma.classroom.findUniqueOrThrow({ where: { id } });
        const empresa = await this.prisma.empresa.findUnique({ where: { id: empresaId } });
        if (!empresa)
            throw new common_1.BadRequestException('Empresa no encontrada');
        const imageUrl = image ? await this.uploadImage(image) : undefined;
        const updated = await this.prisma.classroom.update({
            where: { id },
            data: {
                title: dto.title,
                description: dto.description,
                startDateTime: dto.startDateTime,
                endDateTime: dto.endDateTime,
                price: dto.price,
                channelName: dto.channelName,
                imageUrl,
                categories: dto.categories ? { set: dto.categories } : undefined,
                empresaId,
                orators: this.set(dto.oratorIds),
            },
            select: selectBase,
        });
        this.markLive(updated);
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
            select: selectBase,
        });
        this.markLive(list);
        return list;
    }
    async getLiveClassrooms() {
        const now = new Date();
        const list = await this.prisma.classroom.findMany({
            where: { startDateTime: { lte: now }, endDateTime: { gte: now } },
            select: selectBase,
        });
        this.markLive(list);
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
    async getAllByEmpresa(empresaId) {
        const list = await this.prisma.classroom.findMany({
            where: { empresaId },
            select: selectBase,
        });
        this.markLive(list);
        return list;
    }
    async getAllOrators(empresaId) {
        return this.prisma.instructor.findMany({
            where: { empresaId },
            select: {
                id: true,
                user: { select: { firstName: true, lastName: true, profileImageUrl: true } },
            },
        });
    }
};
exports.ClassroomService = ClassroomService;
exports.ClassroomService = ClassroomService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ClassroomService);
//# sourceMappingURL=classroom.service.js.map