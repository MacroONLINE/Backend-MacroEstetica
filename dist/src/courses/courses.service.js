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
    mapToCourseResponseDto(course) {
        return {
            id: course.id,
            instructorId: course.instructorId || null,
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
            totalHours: course.totalHours || 1,
            aboutDescription: course.aboutDescription || '',
            whatYouWillLearn: course.whatYouWillLearn || [],
            requirements: course.requirements || [],
            categoryName: course.category?.name || 'N/A',
            categoryColor: course.category?.colorHex || 'N/A',
            categoryIcon: course.category?.urlIcon || 'N/A',
            instructorName: `${course.instructor?.user?.firstName || ''} ${course.instructor?.user?.lastName || ''}`.trim() ||
                'N/A',
            instructorExperience: course.instructor?.experienceYears || 0,
            instructorCertificationsUrl: course.instructor?.certificationsUrl || 'N/A',
            instructorStatus: course.instructor?.status || 'N/A',
            modules: course.modules?.map((module) => ({
                id: module.id,
                description: module.description,
                classes: module.classes?.map((cls) => ({
                    id: cls.id,
                    description: cls.description,
                    classResources: cls.classResources || [],
                })) || [],
            })) || [],
            totalModules: course.modules?.length || 0,
            resources: course.resources || [],
            totalResources: course.resources?.length || 0,
            comments: [],
        };
    }
    async createCourse(data) {
        const { instructorId, categoryId, ...rest } = data;
        return this.prisma.course.create({
            data: {
                ...rest,
                instructorId,
                categoryId,
            },
        });
    }
    async createModule(data) {
        const { courseId, description } = data;
        const courseExists = await this.prisma.course.findUnique({ where: { id: courseId } });
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
        const moduleExists = await this.prisma.module.findUnique({ where: { id: moduleId } });
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
    async createCategory(data) {
        return this.prisma.category.create({ data });
    }
    async getAllCourses() {
        const courses = await this.prisma.course.findMany({
            include: {
                category: true,
                instructor: {
                    include: {
                        user: { select: { firstName: true, lastName: true, profileImageUrl: true } },
                    },
                },
                modules: {
                    include: {
                        classes: {
                            include: { classResources: true },
                        },
                    },
                },
                resources: true,
            },
        });
        return courses.map((course) => this.mapToCourseResponseDto(course));
    }
    async getCourseById(courseId) {
        const course = await this.prisma.course.findUnique({
            where: { id: courseId },
            include: {
                category: true,
                instructor: {
                    include: {
                        user: { select: { firstName: true, lastName: true, profileImageUrl: true } },
                    },
                },
                modules: {
                    include: {
                        classes: {
                            include: { classResources: true },
                        },
                    },
                },
                resources: true,
            },
        });
        if (!course) {
            throw new common_1.NotFoundException(`Course with ID ${courseId} not found.`);
        }
        return this.mapToCourseResponseDto(course);
    }
    async getFeaturedCourses() {
        const courses = await this.prisma.course.findMany({
            where: { isFeatured: true },
            include: {
                category: true,
                instructor: {
                    include: {
                        user: { select: { firstName: true, lastName: true, profileImageUrl: true } },
                    },
                },
                modules: {
                    include: {
                        classes: { include: { classResources: true } },
                    },
                },
                resources: true,
            },
        });
        return courses.map((course) => this.mapToCourseResponseDto(course));
    }
    async getCoursesByCategory(categoryId) {
        const courses = await this.prisma.course.findMany({
            where: { categoryId },
            include: {
                category: true,
                instructor: {
                    include: {
                        user: { select: { firstName: true, lastName: true, profileImageUrl: true } },
                    },
                },
                modules: {
                    include: {
                        classes: { include: { classResources: true } },
                    },
                },
                resources: true,
            },
        });
        return courses.map((course) => this.mapToCourseResponseDto(course));
    }
    async getCoursesByInstructor(instructorId) {
        const courses = await this.prisma.course.findMany({
            where: { instructorId },
            include: {
                category: true,
                instructor: {
                    include: {
                        user: { select: { firstName: true, lastName: true, profileImageUrl: true } },
                    },
                },
                modules: {
                    include: {
                        classes: { include: { classResources: true } },
                    },
                },
                resources: true,
            },
        });
        return courses.map((course) => this.mapToCourseResponseDto(course));
    }
    async getCoursesByTarget(target) {
        const validatedTarget = Object.values(client_1.Target).includes(target) ? target : client_1.Target.COSMETOLOGO;
        const courses = await this.prisma.course.findMany({
            where: { target: validatedTarget },
            include: {
                category: true,
                instructor: {
                    include: {
                        user: { select: { firstName: true, lastName: true, profileImageUrl: true } },
                    },
                },
                modules: {
                    include: {
                        classes: { include: { classResources: true } },
                    },
                },
                resources: true,
            },
        });
        return courses.map((course) => this.mapToCourseResponseDto(course));
    }
    async getUserCourses(userId) {
        const enrollments = await this.prisma.courseEnrollment.findMany({
            where: { userId },
            include: {
                course: {
                    include: {
                        modules: {
                            include: { classes: true },
                        },
                    },
                },
            },
        });
        const result = [];
        for (const e of enrollments) {
            const course = e.course;
            const totalClasses = course.modules.reduce((acc, m) => acc + m.classes.length, 0);
            const userProgress = await this.prisma.classProgress.findMany({
                where: {
                    userId,
                    classId: {
                        in: course.modules.flatMap((m) => m.classes.map((c) => c.id)),
                    },
                },
            });
            const completedClasses = userProgress.filter((p) => p.completed).length;
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
                    isCompleted,
                },
            });
        }
        return result;
    }
    async getUserCourseProgress(userId, courseId) {
        const enrollment = await this.prisma.courseEnrollment.findFirst({
            where: { userId, courseId },
        });
        if (!enrollment) {
            throw new common_1.NotFoundException('User not enrolled in this course');
        }
        const course = await this.prisma.course.findUnique({
            where: { id: courseId },
            include: {
                modules: {
                    include: { classes: true },
                },
            },
        });
        if (!course) {
            throw new common_1.NotFoundException(`Course with ID ${courseId} not found.`);
        }
        const totalClasses = course.modules.reduce((acc, m) => acc + m.classes.length, 0);
        const userProgress = await this.prisma.classProgress.findMany({
            where: {
                userId,
                classId: {
                    in: course.modules.flatMap((m) => m.classes.map((c) => c.id)),
                },
            },
        });
        const completedClassIds = userProgress
            .filter((p) => p.completed)
            .map((p) => p.classId);
        const completedClasses = completedClassIds.length;
        const isCompleted = completedClasses === totalClasses && totalClasses > 0;
        return {
            courseId,
            totalClasses,
            completedClasses,
            completedClassIds,
            isCompleted,
        };
    }
    async getClassById(classId) {
        const cls = await this.prisma.class.findUnique({
            where: { id: classId },
            include: {
                classResources: true,
                classComments: {
                    where: { parentCommentId: null },
                    include: {
                        user: {
                            select: {
                                firstName: true,
                                lastName: true,
                                profileImageUrl: true,
                            },
                        },
                        replies: {
                            include: {
                                user: {
                                    select: {
                                        firstName: true,
                                        lastName: true,
                                        profileImageUrl: true,
                                    },
                                },
                            },
                        },
                    },
                },
            },
        });
        if (!cls) {
            throw new common_1.NotFoundException('Class not found');
        }
        return cls;
    }
    async isUserEnrolled(courseId, userId) {
        const enrollment = await this.prisma.courseEnrollment.findFirst({
            where: { courseId, userId },
        });
        return { enrolled: !!enrollment };
    }
    async getModulesByCourse(courseId) {
        return this.prisma.module.findMany({
            where: { courseId },
            include: {
                classes: {
                    include: {
                        classResources: true,
                        classComments: {
                            where: { parentCommentId: null },
                            include: {
                                user: {
                                    select: {
                                        firstName: true,
                                        lastName: true,
                                        profileImageUrl: true,
                                    },
                                },
                                replies: {
                                    include: {
                                        user: {
                                            select: {
                                                firstName: true,
                                                lastName: true,
                                                profileImageUrl: true,
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            },
        });
    }
    async getModuleById(moduleId) {
        const mod = await this.prisma.module.findUnique({
            where: { id: moduleId },
            include: {
                classes: {
                    include: {
                        classResources: true,
                        classComments: {
                            where: { parentCommentId: null },
                            include: {
                                user: {
                                    select: {
                                        firstName: true,
                                        lastName: true,
                                        profileImageUrl: true,
                                    },
                                },
                                replies: {
                                    include: {
                                        user: {
                                            select: {
                                                firstName: true,
                                                lastName: true,
                                                profileImageUrl: true,
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            },
        });
        if (!mod) {
            throw new common_1.NotFoundException(`Module with ID ${moduleId} not found.`);
        }
        return mod;
    }
    async getUserModuleProgress(moduleId, userId) {
        const classes = await this.prisma.class.findMany({
            where: { moduleId },
            include: {
                progress: {
                    where: {
                        userId,
                        completed: true,
                    },
                },
                classResources: true,
            },
        });
        return classes.map((cls) => ({
            classId: cls.id,
            description: cls.description,
            completed: cls.progress.length > 0,
            classResources: cls.classResources,
        }));
    }
    async markClassAsCompleted(userId, classId) {
        const cls = await this.prisma.class.findUnique({ where: { id: classId } });
        if (!cls) {
            throw new common_1.NotFoundException('Class not found');
        }
        const existingProgress = await this.prisma.classProgress.findFirst({
            where: { userId, classId },
        });
        if (!existingProgress) {
            return this.prisma.classProgress.create({
                data: {
                    userId,
                    classId,
                    completed: true,
                },
            });
        }
        else {
            return this.prisma.classProgress.update({
                where: { id: existingProgress.id },
                data: {
                    completed: true,
                    updatedAt: new Date(),
                },
            });
        }
    }
    async createClassComment(dto) {
        const { userId, classId, content, parentCommentId } = dto;
        const cls = await this.prisma.class.findUnique({ where: { id: classId } });
        if (!cls) {
            throw new common_1.NotFoundException(`Class with ID ${classId} not found.`);
        }
        if (parentCommentId) {
            const parent = await this.prisma.classComment.findUnique({
                where: { id: parentCommentId },
            });
            if (!parent) {
                throw new common_1.NotFoundException(`Parent comment with ID ${parentCommentId} not found.`);
            }
        }
        return this.prisma.classComment.create({
            data: {
                userId,
                classId,
                content,
                parentCommentId: parentCommentId || null,
            },
        });
    }
};
exports.CoursesService = CoursesService;
exports.CoursesService = CoursesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], CoursesService);
//# sourceMappingURL=courses.service.js.map