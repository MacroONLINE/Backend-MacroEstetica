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
let ClassroomService = class ClassroomService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    setIsLiveOnClassrooms(classrooms) {
        const now = new Date();
        if (Array.isArray(classrooms)) {
            for (const cls of classrooms) {
                cls.isLive = now >= cls.startDateTime && now <= cls.endDateTime;
            }
        }
        else if (classrooms) {
            classrooms.isLive = now >= classrooms.startDateTime && now <= classrooms.endDateTime;
        }
    }
    async createClassroom(data) {
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
    async getClassroomById(id) {
        const classroom = await this.prisma.classroom.findUnique({
            where: { id },
            include: {
                orators: true,
                attendees: true,
                enrollments: true,
            },
        });
        if (!classroom)
            throw new common_1.NotFoundException('Classroom no encontrado');
        this.setIsLiveOnClassrooms(classroom);
        return classroom;
    }
    async updateClassroom(id, data) {
        const classroom = await this.prisma.classroom.findUnique({ where: { id } });
        if (!classroom)
            throw new common_1.NotFoundException('Classroom no encontrado');
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
    async deleteClassroom(id) {
        const classroom = await this.prisma.classroom.findUnique({ where: { id } });
        if (!classroom)
            throw new common_1.NotFoundException('Classroom no encontrado');
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
    async addOrator(classroomId, instructorId) {
        const classroom = await this.prisma.classroom.findUnique({ where: { id: classroomId } });
        if (!classroom)
            throw new common_1.NotFoundException('Classroom no encontrado');
        const instructor = await this.prisma.instructor.findUnique({ where: { id: instructorId } });
        if (!instructor)
            throw new common_1.NotFoundException('Instructor no encontrado');
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
    async removeOrator(classroomId, instructorId) {
        const classroom = await this.prisma.classroom.findUnique({ where: { id: classroomId } });
        if (!classroom)
            throw new common_1.NotFoundException('Classroom no encontrado');
        const instructor = await this.prisma.instructor.findUnique({ where: { id: instructorId } });
        if (!instructor)
            throw new common_1.NotFoundException('Instructor no encontrado');
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
};
exports.ClassroomService = ClassroomService;
exports.ClassroomService = ClassroomService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ClassroomService);
//# sourceMappingURL=classroom.service.js.map