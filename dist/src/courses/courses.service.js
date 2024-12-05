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
const client_1 = require("@prisma/client");
let CoursesService = class CoursesService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async createCourse(data) {
        const { instructorId, categoryId, ...rest } = data;
        return this.prisma.course.create({
            data: {
                ...rest,
                instructor: instructorId ? { connect: { id: instructorId } } : undefined,
                category: categoryId ? { connect: { id: categoryId } } : undefined,
            },
        });
    }
    async getCourseById(courseId) {
        const course = await this.prisma.course.findUnique({
            where: { id: courseId },
            include: {
                category: true,
                instructor: {
                    include: { user: true },
                },
            },
        });
        if (!course) {
            throw new common_1.NotFoundException(`Course with ID ${courseId} not found.`);
        }
        const response = {
            id: course.id,
            title: course.title,
            description: course.description,
            price: course.price,
            discountPercentage: course.discountPercentage || 0,
            level: course.level,
            target: course.target,
            participantsCount: course.participantsCount,
            rating: course.rating,
            isFeatured: course.isFeatured || false,
            bannerUrl: course.bannerUrl || '',
            courseImageUrl: course.courseImageUrl || '',
            categoryName: course.category?.name || 'N/A',
            categoryColor: course.category?.colorHex || 'N/A',
            categoryIcon: course.category?.urlIcon || 'N/A',
            instructorName: `${course.instructor?.user?.firstName || ''} ${course.instructor?.user?.lastName || ''}`.trim() || 'N/A',
            instructorExperience: course.instructor?.experienceYears || 0,
            instructorCertificationsUrl: course.instructor?.certificationsUrl || 'N/A',
            instructorStatus: course.instructor?.status || 'N/A',
        };
        return response;
    }
    async getAllCourses() {
        return this.prisma.course.findMany({
            include: {
                instructor: true,
                category: true,
            },
        });
    }
    async getFeaturedCourses() {
        return this.prisma.course.findMany({
            where: { isFeatured: true },
            include: {
                instructor: true,
                category: true,
            },
        });
    }
    async getCoursesByCategory(categoryId) {
        return this.prisma.course.findMany({
            where: { categoryId },
            include: {
                instructor: true,
                category: true,
            },
        });
    }
    async getCoursesByInstructor(instructorId) {
        return this.prisma.course.findMany({
            where: { instructorId },
            include: {
                instructor: true,
                category: true,
            },
        });
    }
    async getCoursesByTarget(target) {
        const validatedTarget = Object.values(client_1.Target).includes(target)
            ? target
            : client_1.Target.ESTETICISTA;
        return this.prisma.course.findMany({
            where: {
                target: validatedTarget,
            },
            include: {
                instructor: true,
                category: true,
            },
        });
    }
    async createModule(data) {
        const { courseId, description } = data;
        const courseExists = await this.prisma.course.findUnique({
            where: { id: courseId },
        });
        if (!courseExists) {
            throw new common_1.NotFoundException(`Course with ID ${courseId} not found.`);
        }
        return this.prisma.module.create({
            data: {
                courseId,
                description,
            },
        });
    }
    async createClass(data) {
        const { moduleId, description } = data;
        const moduleExists = await this.prisma.module.findUnique({
            where: { id: moduleId },
        });
        if (!moduleExists) {
            throw new common_1.NotFoundException(`Module with ID ${moduleId} not found.`);
        }
        return this.prisma.class.create({
            data: {
                moduleId,
                description,
            },
        });
    }
    async createComment(data) {
        const { userId, classId, type, rating, content } = data;
        const classExists = await this.prisma.class.findUnique({
            where: { id: classId },
        });
        if (!classExists) {
            throw new common_1.NotFoundException(`Class with ID ${classId} not found.`);
        }
        return this.prisma.comment.create({
            data: {
                userId,
                classId,
                type,
                rating,
                content,
            },
        });
    }
    async createCategory(data) {
        const { name, urlIcon, colorHex } = data;
        return this.prisma.category.create({
            data: {
                name,
                urlIcon,
                colorHex,
            },
        });
    }
    async getModulesByCourseId(courseId) {
        const courseExists = await this.prisma.course.findUnique({
            where: { id: courseId },
        });
        if (!courseExists) {
            throw new common_1.NotFoundException(`Course with ID ${courseId} not found.`);
        }
        return this.prisma.module.findMany({
            where: { courseId },
        });
    }
    async getClassesByModuleId(moduleId) {
        const moduleExists = await this.prisma.module.findUnique({
            where: { id: moduleId },
        });
        if (!moduleExists) {
            throw new common_1.NotFoundException(`Module with ID ${moduleId} not found.`);
        }
        return this.prisma.class.findMany({
            where: { moduleId },
        });
    }
};
exports.CoursesService = CoursesService;
exports.CoursesService = CoursesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], CoursesService);
//# sourceMappingURL=courses.service.js.map