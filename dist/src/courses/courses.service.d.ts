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
        rating: number;
        description: string;
        title: string;
        categoryId: string;
        target: import(".prisma/client").$Enums.Target;
        price: number;
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
        courseId: string | null;
        description: string;
    }>;
    createClass(data: CreateClassDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string;
        moduleId: string | null;
        videoUrl: string | null;
    }>;
    createComment(data: CreateCommentDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        type: import(".prisma/client").$Enums.CommentType;
        rating: number;
        content: string;
        classId: string | null;
        courseId: string | null;
        userId: string;
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
        isCompleted: boolean;
    }>;
    getClassById(classId: string): Promise<{
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
        moduleId: string | null;
        videoUrl: string | null;
    }>;
    isUserEnrolled(courseId: string, userId: string): Promise<{
        enrolled: boolean;
    }>;
    getModulesByCourse(courseId: string): Promise<({
        classes: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            description: string;
            moduleId: string | null;
            videoUrl: string | null;
        }[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        courseId: string | null;
        description: string;
    })[]>;
    getModuleById(moduleId: string): Promise<{
        course: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            rating: number;
            description: string;
            title: string;
            categoryId: string;
            target: import(".prisma/client").$Enums.Target;
            price: number;
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
        };
        classes: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            description: string;
            moduleId: string | null;
            videoUrl: string | null;
        }[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        courseId: string | null;
        description: string;
    }>;
    getUserModuleProgress(moduleId: string, userId: string): Promise<{
        classId: string;
        description: string;
        completed: boolean;
    }[]>;
}
