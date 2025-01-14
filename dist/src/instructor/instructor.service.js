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
exports.InstructorService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let InstructorService = class InstructorService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async createInstructor(data) {
        return this.prisma.instructor.create({
            data: {
                profession: data.profession,
                type: data.type,
                description: data.description,
                experienceYears: data.experienceYears ?? 0,
                certificationsUrl: data.certificationsUrl,
                status: data.status,
                userId: data.userId,
                empresaId: data.empresaId,
                categoryId: data.categoryId,
            },
        });
    }
    async getInstructorById(id) {
        return this.prisma.instructor.findUnique({
            where: { id },
            include: {
                category: true,
                empresa: true,
                courses: true,
                events: true,
            },
        });
    }
    async getInstructorsByCategory(categoryId) {
        return this.prisma.instructor.findMany({
            where: { categoryId },
            include: {
                category: true,
                empresa: true,
                courses: true,
                events: true,
            },
        });
    }
    async getInstructorsByEmpresa(empresaId) {
        return this.prisma.instructor.findMany({
            where: { empresaId },
            include: {
                category: true,
                empresa: true,
                courses: true,
                events: true,
            },
        });
    }
    async getAllInstructors() {
        return this.prisma.instructor.findMany({
            include: {
                category: true,
                empresa: true,
                courses: true,
                events: true,
            },
        });
    }
    async updateInstructor(id, data) {
        return this.prisma.instructor.update({
            where: { id },
            data,
        });
    }
    async deleteInstructor(id) {
        return this.prisma.instructor.delete({
            where: { id },
        });
    }
};
exports.InstructorService = InstructorService;
exports.InstructorService = InstructorService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], InstructorService);
//# sourceMappingURL=instructor.service.js.map