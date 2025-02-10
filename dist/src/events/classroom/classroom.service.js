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
    async createClassroom(data) {
        return this.prisma.classroom.create({
            data: {
                title: data.title,
                description: data.description,
            },
        });
    }
    async getClassroomById(id) {
        return this.prisma.classroom.findUnique({
            where: { id },
            include: {
                workshops: true,
            },
        });
    }
    async updateClassroom(id, data) {
        const classroom = await this.prisma.classroom.findUnique({ where: { id } });
        if (!classroom)
            throw new common_1.NotFoundException('Classroom no encontrado');
        return this.prisma.classroom.update({
            where: { id },
            data: {
                title: data.title,
                description: data.description,
            },
        });
    }
    async deleteClassroom(id) {
        const classroom = await this.prisma.classroom.findUnique({ where: { id } });
        if (!classroom)
            throw new common_1.NotFoundException('Classroom no encontrado');
        await this.prisma.classroom.delete({ where: { id } });
        return { message: 'Classroom eliminado correctamente' };
    }
    async getUpcomingWorkshopsForClassroom(classroomId) {
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
};
exports.ClassroomService = ClassroomService;
exports.ClassroomService = ClassroomService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ClassroomService);
//# sourceMappingURL=classroom.service.js.map