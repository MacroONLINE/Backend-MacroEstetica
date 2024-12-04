import { PrismaService } from '../prisma/prisma.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { CreateModuleDto } from './dto/create-module.dto';
import { CreateClassDto } from './dto/create-class.dto';
import { CreateCommentDto } from './dto/create-comment.dto';
import { CreateCategoryDto } from './dto/create-category.dto';
export declare class CoursesService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    createCourse(data: CreateCourseDto): Promise<{
        id: string;
        title: string;
        bannerUrl: string;
        description: string;
        categoryId: string;
        instructorId: string | null;
        rating: number;
        commentsCount: number;
        averageRating: number;
        level: string;
        price: number;
        discountPercentage: number | null;
        participantsCount: number;
        target: import(".prisma/client").$Enums.Target;
        isFeatured: boolean | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    getCourseById(courseId: string): Promise<{
        category: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            urlIcon: string;
            colorHex: string;
        };
        instructor: {
            id: string;
            description: string;
            createdAt: Date;
            updatedAt: Date;
            userId: string;
            profession: import(".prisma/client").$Enums.Profession;
            type: import(".prisma/client").$Enums.ProfessionType;
            experienceYears: number;
            certificationsUrl: string;
            status: string;
            companyId: string | null;
        };
    } & {
        id: string;
        title: string;
        bannerUrl: string;
        description: string;
        categoryId: string;
        instructorId: string | null;
        rating: number;
        commentsCount: number;
        averageRating: number;
        level: string;
        price: number;
        discountPercentage: number | null;
        participantsCount: number;
        target: import(".prisma/client").$Enums.Target;
        isFeatured: boolean | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    getAllCourses(): Promise<({
        category: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            urlIcon: string;
            colorHex: string;
        };
        instructor: {
            id: string;
            description: string;
            createdAt: Date;
            updatedAt: Date;
            userId: string;
            profession: import(".prisma/client").$Enums.Profession;
            type: import(".prisma/client").$Enums.ProfessionType;
            experienceYears: number;
            certificationsUrl: string;
            status: string;
            companyId: string | null;
        };
    } & {
        id: string;
        title: string;
        bannerUrl: string;
        description: string;
        categoryId: string;
        instructorId: string | null;
        rating: number;
        commentsCount: number;
        averageRating: number;
        level: string;
        price: number;
        discountPercentage: number | null;
        participantsCount: number;
        target: import(".prisma/client").$Enums.Target;
        isFeatured: boolean | null;
        createdAt: Date;
        updatedAt: Date;
    })[]>;
    getFeaturedCourses(): Promise<({
        category: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            urlIcon: string;
            colorHex: string;
        };
        instructor: {
            id: string;
            description: string;
            createdAt: Date;
            updatedAt: Date;
            userId: string;
            profession: import(".prisma/client").$Enums.Profession;
            type: import(".prisma/client").$Enums.ProfessionType;
            experienceYears: number;
            certificationsUrl: string;
            status: string;
            companyId: string | null;
        };
    } & {
        id: string;
        title: string;
        bannerUrl: string;
        description: string;
        categoryId: string;
        instructorId: string | null;
        rating: number;
        commentsCount: number;
        averageRating: number;
        level: string;
        price: number;
        discountPercentage: number | null;
        participantsCount: number;
        target: import(".prisma/client").$Enums.Target;
        isFeatured: boolean | null;
        createdAt: Date;
        updatedAt: Date;
    })[]>;
    getCoursesByCategory(categoryId: string): Promise<({
        category: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            urlIcon: string;
            colorHex: string;
        };
        instructor: {
            id: string;
            description: string;
            createdAt: Date;
            updatedAt: Date;
            userId: string;
            profession: import(".prisma/client").$Enums.Profession;
            type: import(".prisma/client").$Enums.ProfessionType;
            experienceYears: number;
            certificationsUrl: string;
            status: string;
            companyId: string | null;
        };
    } & {
        id: string;
        title: string;
        bannerUrl: string;
        description: string;
        categoryId: string;
        instructorId: string | null;
        rating: number;
        commentsCount: number;
        averageRating: number;
        level: string;
        price: number;
        discountPercentage: number | null;
        participantsCount: number;
        target: import(".prisma/client").$Enums.Target;
        isFeatured: boolean | null;
        createdAt: Date;
        updatedAt: Date;
    })[]>;
    getCoursesByInstructor(instructorId: string): Promise<({
        category: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            urlIcon: string;
            colorHex: string;
        };
        instructor: {
            id: string;
            description: string;
            createdAt: Date;
            updatedAt: Date;
            userId: string;
            profession: import(".prisma/client").$Enums.Profession;
            type: import(".prisma/client").$Enums.ProfessionType;
            experienceYears: number;
            certificationsUrl: string;
            status: string;
            companyId: string | null;
        };
    } & {
        id: string;
        title: string;
        bannerUrl: string;
        description: string;
        categoryId: string;
        instructorId: string | null;
        rating: number;
        commentsCount: number;
        averageRating: number;
        level: string;
        price: number;
        discountPercentage: number | null;
        participantsCount: number;
        target: import(".prisma/client").$Enums.Target;
        isFeatured: boolean | null;
        createdAt: Date;
        updatedAt: Date;
    })[]>;
    getCoursesByTarget(target: string): Promise<({
        category: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            urlIcon: string;
            colorHex: string;
        };
        instructor: {
            id: string;
            description: string;
            createdAt: Date;
            updatedAt: Date;
            userId: string;
            profession: import(".prisma/client").$Enums.Profession;
            type: import(".prisma/client").$Enums.ProfessionType;
            experienceYears: number;
            certificationsUrl: string;
            status: string;
            companyId: string | null;
        };
    } & {
        id: string;
        title: string;
        bannerUrl: string;
        description: string;
        categoryId: string;
        instructorId: string | null;
        rating: number;
        commentsCount: number;
        averageRating: number;
        level: string;
        price: number;
        discountPercentage: number | null;
        participantsCount: number;
        target: import(".prisma/client").$Enums.Target;
        isFeatured: boolean | null;
        createdAt: Date;
        updatedAt: Date;
    })[]>;
    createModule(data: CreateModuleDto): Promise<{
        id: string;
        description: string;
        createdAt: Date;
        updatedAt: Date;
        courseId: string;
    }>;
    createClass(data: CreateClassDto): Promise<{
        id: string;
        description: string;
        createdAt: Date;
        updatedAt: Date;
        moduleId: string;
    }>;
    createComment(data: CreateCommentDto): Promise<{
        id: string;
        rating: number;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        type: import(".prisma/client").$Enums.CommentType;
        classId: string;
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
    getModulesByCourseId(courseId: string): Promise<{
        id: string;
        description: string;
        createdAt: Date;
        updatedAt: Date;
        courseId: string;
    }[]>;
    getClassesByModuleId(moduleId: string): Promise<{
        id: string;
        description: string;
        createdAt: Date;
        updatedAt: Date;
        moduleId: string;
    }[]>;
}
