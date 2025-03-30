import { PrismaService } from 'src/prisma/prisma.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { CreateModuleDto } from './dto/create-module.dto';
import { CreateClassDto } from './dto/create-class.dto';
import { CreateCommentDto } from './dto/create-comment.dto';
import { CreateCategoryDto } from './dto/create-category.dto';
import { CourseResponseDto } from './response-dto/course-response.dto';
import { Target } from '@prisma/client';
export declare class CoursesService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    private mapToCourseResponseDto;
    createCourse(data: CreateCourseDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string;
        rating: number;
        title: string;
        categoryId: string;
        price: number;
        target: import(".prisma/client").$Enums.Target;
        whatYouWillLearn: import("@prisma/client/runtime/library").JsonValue | null;
        bannerUrl: string;
        level: string;
        commentsCount: number;
        averageRating: number;
        discountPercentage: number | null;
        participantsCount: number;
        isFeatured: boolean | null;
        courseImageUrl: string;
        aboutDescription: string | null;
        requirements: import("@prisma/client/runtime/library").JsonValue | null;
        totalHours: number;
        introductoryVideoUrl: string | null;
        instructorId: string | null;
    }>;
    createModule(data: CreateModuleDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string;
        courseId: string | null;
    }>;
    createClass(data: CreateClassDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string;
        title: string;
        imageUrl: string | null;
        moduleId: string | null;
        videoUrl: string | null;
    }>;
    createCategory(data: CreateCategoryDto): Promise<{
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        urlIcon: string;
        colorHex: string;
    }>;
    getAllCourses(): Promise<CourseResponseDto[]>;
    getCourseById(courseId: string): Promise<CourseResponseDto>;
    getFeaturedCourses(): Promise<CourseResponseDto[]>;
    getCoursesByCategory(categoryId: string): Promise<CourseResponseDto[]>;
    getCoursesByInstructor(instructorId: string): Promise<CourseResponseDto[]>;
    getCoursesByTarget(target: Target): Promise<CourseResponseDto[]>;
    getUserCourses(userId: string): Promise<any[]>;
    getUserCourseProgress(userId: string, courseId: string): Promise<{
        courseId: string;
        totalClasses: number;
        completedClasses: number;
        completedClassIds: string[];
        isCompleted: boolean;
    }>;
    getClassById(classId: string): Promise<{
        classComments: ({
            user: {
                firstName: string;
                lastName: string;
                profileImageUrl: string;
            };
            replies: ({
                user: {
                    firstName: string;
                    lastName: string;
                    profileImageUrl: string;
                };
            } & {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                userId: string;
                content: string;
                classId: string;
                parentCommentId: string | null;
            })[];
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            userId: string;
            content: string;
            classId: string;
            parentCommentId: string | null;
        })[];
        classResources: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            classId: string;
            title: string;
            fileUrl: string;
        }[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string;
        title: string;
        imageUrl: string | null;
        moduleId: string | null;
        videoUrl: string | null;
    }>;
    isUserEnrolled(courseId: string, userId: string): Promise<{
        enrolled: boolean;
    }>;
    getModulesByCourse(courseId: string): Promise<({
        classes: ({
            classComments: ({
                user: {
                    firstName: string;
                    lastName: string;
                    profileImageUrl: string;
                };
                replies: ({
                    user: {
                        firstName: string;
                        lastName: string;
                        profileImageUrl: string;
                    };
                } & {
                    id: string;
                    createdAt: Date;
                    updatedAt: Date;
                    userId: string;
                    content: string;
                    classId: string;
                    parentCommentId: string | null;
                })[];
            } & {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                userId: string;
                content: string;
                classId: string;
                parentCommentId: string | null;
            })[];
            classResources: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                classId: string;
                title: string;
                fileUrl: string;
            }[];
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            description: string;
            title: string;
            imageUrl: string | null;
            moduleId: string | null;
            videoUrl: string | null;
        })[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string;
        courseId: string | null;
    })[]>;
    getModuleById(moduleId: string): Promise<{
        classes: ({
            classComments: ({
                user: {
                    firstName: string;
                    lastName: string;
                    profileImageUrl: string;
                };
                replies: ({
                    user: {
                        firstName: string;
                        lastName: string;
                        profileImageUrl: string;
                    };
                } & {
                    id: string;
                    createdAt: Date;
                    updatedAt: Date;
                    userId: string;
                    content: string;
                    classId: string;
                    parentCommentId: string | null;
                })[];
            } & {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                userId: string;
                content: string;
                classId: string;
                parentCommentId: string | null;
            })[];
            classResources: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                classId: string;
                title: string;
                fileUrl: string;
            }[];
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            description: string;
            title: string;
            imageUrl: string | null;
            moduleId: string | null;
            videoUrl: string | null;
        })[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string;
        courseId: string | null;
    }>;
    getUserModuleProgress(moduleId: string, userId: string): Promise<{
        classId: string;
        description: string;
        completed: boolean;
        classResources: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            classId: string;
            title: string;
            fileUrl: string;
        }[];
    }[]>;
    markClassAsCompleted(userId: string, classId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        classId: string;
        completed: boolean;
    }>;
    createClassComment(dto: CreateCommentDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        content: string;
        classId: string;
        parentCommentId: string | null;
    }>;
}
