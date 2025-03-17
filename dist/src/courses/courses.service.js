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
    async getAllCourses() {
        return this.prisma.course.findMany({
            include: {
                instructor: {
                    include: {
                        user: {
                            select: { firstName: true, lastName: true, profileImageUrl: true }
                        }
                    }
                },
                modules: {
                    include: {
                        classes: {
                            include: { classResources: true }
                        }
                    }
                }
            }
        });
    }
    async getCourseById(courseId) {
        const course = await this.prisma.course.findUnique({
            where: { id: courseId },
            include: {
                instructor: {
                    include: {
                        user: { select: { firstName: true, lastName: true, profileImageUrl: true } }
                    }
                },
                modules: {
                    include: {
                        classes: {
                            include: {
                                classResources: true
                            }
                        }
                    }
                }
            }
        });
        if (!course)
            throw new common_1.NotFoundException('Course not found');
        return course;
    }
    async getUserCourses(userId) {
        const enrollments = await this.prisma.courseEnrollment.findMany({
            where: { userId },
            include: {
                course: {
                    include: {
                        modules: {
                            include: { classes: true }
                        }
                    }
                }
            }
        });
        const result = [];
        for (const e of enrollments) {
            const course = e.course;
            const totalClasses = course.modules.reduce((acc, m) => acc + m.classes.length, 0);
            const userProgress = await this.prisma.classProgress.findMany({
                where: { userId, classId: { in: course.modules.flatMap(m => m.classes.map(c => c.id)) } }
            });
            const completedClasses = userProgress.filter(p => p.completed).length;
            const isCompleted = completedClasses === totalClasses && totalClasses > 0;
            result.push({
                enrollmentId: e.id,
                enrolledAt: e.enrolledAt,
                course: {
                    id: course.id,
                    title: course.title,
                    target: course.target,
                    totalClasses,
                    completedClasses,
                    isCompleted
                }
            });
        }
        return result;
    }
    async getUserCourseProgress(userId, courseId) {
        const enrollment = await this.prisma.courseEnrollment.findFirst({
            where: { userId, courseId }
        });
        if (!enrollment) {
            throw new common_1.NotFoundException('User not enrolled in this course');
        }
        const course = await this.prisma.course.findUnique({
            where: { id: courseId },
            include: { modules: { include: { classes: true } } }
        });
        const totalClasses = course.modules.reduce((acc, m) => acc + m.classes.length, 0);
        const userProgress = await this.prisma.classProgress.findMany({
            where: { userId, classId: { in: course.modules.flatMap(m => m.classes.map(c => c.id)) } }
        });
        const completedClasses = userProgress.filter(p => p.completed).length;
        return {
            courseId: courseId,
            totalClasses,
            completedClasses,
            isCompleted: (completedClasses === totalClasses && totalClasses > 0)
        };
    }
    async getClassById(classId) {
        const cls = await this.prisma.class.findUnique({
            where: { id: classId },
            include: {
                classResources: true
            }
        });
        if (!cls)
            throw new common_1.NotFoundException('Class not found');
        return cls;
    }
};
exports.CoursesService = CoursesService;
exports.CoursesService = CoursesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], CoursesService);
//# sourceMappingURL=courses.service.js.map