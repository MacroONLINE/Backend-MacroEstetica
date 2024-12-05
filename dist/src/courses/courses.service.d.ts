import { PrismaService } from '../prisma/prisma.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { CreateModuleDto } from './dto/create-module.dto';
import { CreateClassDto } from './dto/create-class.dto';
import { CreateCommentDto } from './dto/create-comment.dto';
import { CreateCategoryDto } from './dto/create-category.dto';
import { CourseResponseDto } from './response-dto/course-response.dto';
export declare class CoursesService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    createCourse(data: CreateCourseDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string;
        rating: number;
        isFeatured: boolean | null;
        title: string;
        bannerUrl: string;
        courseImageUrl: string;
        commentsCount: number;
        averageRating: number;
        level: string;
        price: number;
        discountPercentage: number | null;
        participantsCount: number;
        target: import(".prisma/client").$Enums.Target;
        categoryId: string;
        instructorId: string | null;
    }>;
    getCourseById(courseId: string): Promise<CourseResponseDto>;
    getAllCourses(): Promise<({
        instructor: {
            id: string;
            status: string;
            createdAt: Date;
            updatedAt: Date;
            userId: string;
            profession: import(".prisma/client").$Enums.Profession;
            type: import(".prisma/client").$Enums.ProfessionType;
            description: string;
            experienceYears: number;
            certificationsUrl: string;
            companyId: string | null;
        };
        category: {
            name: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            urlIcon: string;
            colorHex: string;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string;
        rating: number;
        isFeatured: boolean | null;
        title: string;
        bannerUrl: string;
        courseImageUrl: string;
        commentsCount: number;
        averageRating: number;
        level: string;
        price: number;
        discountPercentage: number | null;
        participantsCount: number;
        target: import(".prisma/client").$Enums.Target;
        categoryId: string;
        instructorId: string | null;
    })[]>;
    getFeaturedCourses(): Promise<({
        instructor: {
            id: string;
            status: string;
            createdAt: Date;
            updatedAt: Date;
            userId: string;
            profession: import(".prisma/client").$Enums.Profession;
            type: import(".prisma/client").$Enums.ProfessionType;
            description: string;
            experienceYears: number;
            certificationsUrl: string;
            companyId: string | null;
        };
        category: {
            name: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            urlIcon: string;
            colorHex: string;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string;
        rating: number;
        isFeatured: boolean | null;
        title: string;
        bannerUrl: string;
        courseImageUrl: string;
        commentsCount: number;
        averageRating: number;
        level: string;
        price: number;
        discountPercentage: number | null;
        participantsCount: number;
        target: import(".prisma/client").$Enums.Target;
        categoryId: string;
        instructorId: string | null;
    })[]>;
    getCoursesByCategory(categoryId: string): Promise<({
        instructor: {
            id: string;
            status: string;
            createdAt: Date;
            updatedAt: Date;
            userId: string;
            profession: import(".prisma/client").$Enums.Profession;
            type: import(".prisma/client").$Enums.ProfessionType;
            description: string;
            experienceYears: number;
            certificationsUrl: string;
            companyId: string | null;
        };
        category: {
            name: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            urlIcon: string;
            colorHex: string;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string;
        rating: number;
        isFeatured: boolean | null;
        title: string;
        bannerUrl: string;
        courseImageUrl: string;
        commentsCount: number;
        averageRating: number;
        level: string;
        price: number;
        discountPercentage: number | null;
        participantsCount: number;
        target: import(".prisma/client").$Enums.Target;
        categoryId: string;
        instructorId: string | null;
    })[]>;
    getCoursesByInstructor(instructorId: string): Promise<({
        instructor: {
            id: string;
            status: string;
            createdAt: Date;
            updatedAt: Date;
            userId: string;
            profession: import(".prisma/client").$Enums.Profession;
            type: import(".prisma/client").$Enums.ProfessionType;
            description: string;
            experienceYears: number;
            certificationsUrl: string;
            companyId: string | null;
        };
        category: {
            name: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            urlIcon: string;
            colorHex: string;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string;
        rating: number;
        isFeatured: boolean | null;
        title: string;
        bannerUrl: string;
        courseImageUrl: string;
        commentsCount: number;
        averageRating: number;
        level: string;
        price: number;
        discountPercentage: number | null;
        participantsCount: number;
        target: import(".prisma/client").$Enums.Target;
        categoryId: string;
        instructorId: string | null;
    })[]>;
    getCoursesByTarget(target: string): Promise<({
        instructor: {
            id: string;
            status: string;
            createdAt: Date;
            updatedAt: Date;
            userId: string;
            profession: import(".prisma/client").$Enums.Profession;
            type: import(".prisma/client").$Enums.ProfessionType;
            description: string;
            experienceYears: number;
            certificationsUrl: string;
            companyId: string | null;
        };
        category: {
            name: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            urlIcon: string;
            colorHex: string;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string;
        rating: number;
        isFeatured: boolean | null;
        title: string;
        bannerUrl: string;
        courseImageUrl: string;
        commentsCount: number;
        averageRating: number;
        level: string;
        price: number;
        discountPercentage: number | null;
        participantsCount: number;
        target: import(".prisma/client").$Enums.Target;
        categoryId: string;
        instructorId: string | null;
    })[]>;
    createModule(data: CreateModuleDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string;
        courseId: string;
    }>;
    createClass(data: CreateClassDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string;
        moduleId: string;
    }>;
    createComment(data: CreateCommentDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        type: import(".prisma/client").$Enums.CommentType;
        rating: number;
        content: string;
        classId: string;
    }>;
    createCategory(data: CreateCategoryDto): Promise<{
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        urlIcon: string;
        colorHex: string;
    }>;
    getModulesByCourseId(courseId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string;
        courseId: string;
    }[]>;
    getClassesByModuleId(moduleId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string;
        moduleId: string;
    }[]>;
}
