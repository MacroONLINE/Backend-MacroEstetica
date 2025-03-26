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
        title: string;
        bannerUrl: string;
        description: string;
        level: string;
        rating: number;
        commentsCount: number;
        averageRating: number;
        instructorId: string | null;
        price: number;
        discountPercentage: number | null;
        participantsCount: number;
        target: import(".prisma/client").$Enums.Target;
        createdAt: Date;
        updatedAt: Date;
        categoryId: string;
        isFeatured: boolean | null;
        courseImageUrl: string;
        aboutDescription: string | null;
        requirements: import("@prisma/client/runtime/library").JsonValue | null;
        totalHours: number;
        whatYouWillLearn: import("@prisma/client/runtime/library").JsonValue | null;
        introductoryVideoUrl: string | null;
    }>;
    createModule(data: CreateModuleDto): Promise<{
        id: string;
        description: string;
        createdAt: Date;
        updatedAt: Date;
        courseId: string | null;
    }>;
    createClass(data: CreateClassDto): Promise<{
        id: string;
        description: string;
        createdAt: Date;
        updatedAt: Date;
        moduleId: string | null;
        videoUrl: string | null;
    }>;
    createComment(data: CreateCommentDto): Promise<{
        id: string;
        rating: number;
        createdAt: Date;
        updatedAt: Date;
        courseId: string | null;
        userId: string;
        classId: string | null;
        type: import(".prisma/client").$Enums.CommentType;
        content: string;
    }>;
    createCategory(data: CreateCategoryDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
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
        isCompleted: boolean;
    }>;
    getClassById(classId: string): Promise<{
        classResources: {
            id: string;
            title: string;
            createdAt: Date;
            updatedAt: Date;
            classId: string;
            fileUrl: string;
        }[];
    } & {
        id: string;
        description: string;
        createdAt: Date;
        updatedAt: Date;
        moduleId: string | null;
        videoUrl: string | null;
    }>;
    isUserEnrolled(courseId: string, userId: string): Promise<{
        enrolled: boolean;
    }>;
    getModulesByCourse(courseId: string): Promise<({
        classes: ({
            classResources: {
                id: string;
                title: string;
                createdAt: Date;
                updatedAt: Date;
                classId: string;
                fileUrl: string;
            }[];
        } & {
            id: string;
            description: string;
            createdAt: Date;
            updatedAt: Date;
            moduleId: string | null;
            videoUrl: string | null;
        })[];
    } & {
        id: string;
        description: string;
        createdAt: Date;
        updatedAt: Date;
        courseId: string | null;
    })[]>;
    getModuleById(moduleId: string): Promise<{
        classes: ({
            classResources: {
                id: string;
                title: string;
                createdAt: Date;
                updatedAt: Date;
                classId: string;
                fileUrl: string;
            }[];
        } & {
            id: string;
            description: string;
            createdAt: Date;
            updatedAt: Date;
            moduleId: string | null;
            videoUrl: string | null;
        })[];
    } & {
        id: string;
        description: string;
        createdAt: Date;
        updatedAt: Date;
        courseId: string | null;
    }>;
    getUserModuleProgress(moduleId: string, userId: string): Promise<{
        classId: string;
        description: string;
        completed: boolean;
        classResources: {
            id: string;
            title: string;
            createdAt: Date;
            updatedAt: Date;
            classId: string;
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
}
