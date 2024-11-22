import { PrismaService } from 'src/prisma/prisma.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { CreateModuleDto } from './dto/create-module.dto';
import { CreateClassDto } from './dto/create-class.dto';
import { CreateCommentDto } from './dto/create-comment.dto';
import { CreateCategoryDto } from './dto/create-category.dto';
import { CoursesFetchDto } from './dto/courses-fetch.dto';
export declare class CoursesService {
    private prisma;
    constructor(prisma: PrismaService);
    createCourse(data: CreateCourseDto): Promise<{
        id: string;
        name: string;
        description: string | null;
        cost: number;
        discount: number | null;
        publicationDate: Date;
        level: import(".prisma/client").$Enums.CourseLevel;
        featured: boolean;
        averageRating: number | null;
        participants: number;
        instructorId: string | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    createModule(data: CreateModuleDto): Promise<{
        id: string;
        description: string;
        courseId: string;
    }>;
    createClass(data: CreateClassDto): Promise<{
        id: string;
        description: string;
        moduleId: string;
    }>;
    createComment(data: CreateCommentDto): Promise<{
        id: string;
        createdAt: Date;
        userId: string;
        classId: string;
        type: import(".prisma/client").$Enums.CommentType;
        rating: number;
        content: string;
    }>;
    createCategory(data: CreateCategoryDto): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
    getAllCourses(): Promise<({
        modules: ({
            classes: {
                id: string;
                description: string;
                moduleId: string;
            }[];
        } & {
            id: string;
            description: string;
            courseId: string;
        })[];
        categories: ({
            category: {
                id: string;
                name: string;
                createdAt: Date;
                updatedAt: Date;
            };
        } & {
            id: string;
            courseId: string;
            categoryId: string;
        })[];
    } & {
        id: string;
        name: string;
        description: string | null;
        cost: number;
        discount: number | null;
        publicationDate: Date;
        level: import(".prisma/client").$Enums.CourseLevel;
        featured: boolean;
        averageRating: number | null;
        participants: number;
        instructorId: string | null;
        createdAt: Date;
        updatedAt: Date;
    })[]>;
    getFeaturedCourses(): Promise<({
        instructor: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            userId: string;
            profession: import(".prisma/client").$Enums.Profession;
        };
        categories: ({
            category: {
                id: string;
                name: string;
                createdAt: Date;
                updatedAt: Date;
            };
        } & {
            id: string;
            courseId: string;
            categoryId: string;
        })[];
    } & {
        id: string;
        name: string;
        description: string | null;
        cost: number;
        discount: number | null;
        publicationDate: Date;
        level: import(".prisma/client").$Enums.CourseLevel;
        featured: boolean;
        averageRating: number | null;
        participants: number;
        instructorId: string | null;
        createdAt: Date;
        updatedAt: Date;
    })[]>;
    getModulesByCourseId(courseId: string): Promise<({
        classes: {
            id: string;
            description: string;
            moduleId: string;
        }[];
    } & {
        id: string;
        description: string;
        courseId: string;
    })[]>;
    getClassesByModuleId(moduleId: string): Promise<({
        comments: {
            id: string;
            createdAt: Date;
            userId: string;
            classId: string;
            type: import(".prisma/client").$Enums.CommentType;
            rating: number;
            content: string;
        }[];
    } & {
        id: string;
        description: string;
        moduleId: string;
    })[]>;
    getFeaturedCoursesFetch(): Promise<CoursesFetchDto[]>;
}
