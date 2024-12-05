import { CoursesService } from './courses.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { CreateModuleDto } from './dto/create-module.dto';
import { CreateClassDto } from './dto/create-class.dto';
import { CreateCommentDto } from './dto/create-comment.dto';
import { CreateCategoryDto } from './dto/create-category.dto';
import { Target } from '@prisma/client';
import { CourseResponseDto } from './response-dto/course-response.dto';
export declare class CoursesController {
    private readonly coursesService;
    constructor(coursesService: CoursesService);
    createCourse(createCourseDto: CreateCourseDto): Promise<{
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
    createModule(createModuleDto: CreateModuleDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string;
        courseId: string;
    }>;
    createClass(createClassDto: CreateClassDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string;
        moduleId: string;
    }>;
    createComment(createCommentDto: CreateCommentDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        type: import(".prisma/client").$Enums.CommentType;
        rating: number;
        content: string;
        classId: string;
    }>;
    createCategory(createCategoryDto: CreateCategoryDto): Promise<{
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        urlIcon: string;
        colorHex: string;
    }>;
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
    getCoursesByTarget(target: Target): Promise<({
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
    getCourseById(courseId: string): Promise<CourseResponseDto>;
}
