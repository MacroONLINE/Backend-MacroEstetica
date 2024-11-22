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
exports.CoursesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let CoursesService = class CoursesService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async createCourse(data) {
        return this.prisma.course.create({ data });
    }
    async createModule(data) {
        return this.prisma.module.create({ data });
    }
    async createClass(data) {
        return this.prisma.class.create({ data });
    }
    async createComment(data) {
        const { userId, classId, type, rating, content } = data;
        return this.prisma.comment.create({
            data: {
                user: {
                    connect: { id: userId },
                },
                class: {
                    connect: { id: classId },
                },
                type,
                rating,
                content,
            },
        });
    }
    async createCategory(data) {
        return this.prisma.category.create({ data });
    }
    async getAllCourses() {
        return this.prisma.course.findMany({
            include: {
                modules: {
                    include: { classes: true },
                },
                categories: {
                    include: { category: true },
                },
            },
        });
    }
    async getFeaturedCourses() {
        return this.prisma.course.findMany({
            where: { featured: true },
            include: {
                instructor: true,
                categories: {
                    include: { category: true },
                },
            },
        });
    }
    async getModulesByCourseId(courseId) {
        return this.prisma.module.findMany({
            where: { courseId },
            include: { classes: true },
        });
    }
    async getClassesByModuleId(moduleId) {
        return this.prisma.class.findMany({
            where: { moduleId },
            include: {
                comments: true,
            },
        });
    }
    async getFeaturedCoursesFetch() {
        return this.prisma.coursesFetch.findMany({
            where: { featured: true },
        });
    }
};
exports.CoursesService = CoursesService;
exports.CoursesService = CoursesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], CoursesService);
//# sourceMappingURL=courses.service.js.map