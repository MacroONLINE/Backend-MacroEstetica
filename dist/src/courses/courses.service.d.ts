import { PrismaService } from 'src/prisma/prisma.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { CreateModuleDto } from './dto/create-module.dto';
import { CreateClassDto } from './dto/create-class.dto';
import { CreateCommentDto } from './dto/create-comment.dto';
import { CreateCategoryDto } from './dto/create-category.dto';
export declare class CoursesService {
    private prisma;
    constructor(prisma: PrismaService);
    createCourse(data: CreateCourseDto): Promise<{
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        cost: number;
        discount: number | null;
        publicationDate: Date;
        level: import(".prisma/client").$Enums.CourseLevel;
        featured: boolean;
        averageRating: number | null;
        participants: number;
        instructorId: string | null;
    }>;
    createModule(data: CreateModuleDto): Promise<{
        id: string;
        courseId: string;
        description: string;
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
            courseId: string;
            description: string;
        })[];
        categories: ({
            category: {
                name: string;
                id: string;
                createdAt: Date;
                updatedAt: Date;
            };
        } & {
            id: string;
            categoryId: string;
            courseId: string;
        })[];
    } & {
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        cost: number;
        discount: number | null;
        publicationDate: Date;
        level: import(".prisma/client").$Enums.CourseLevel;
        featured: boolean;
        averageRating: number | null;
        participants: number;
        instructorId: string | null;
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
                name: string;
                id: string;
                createdAt: Date;
                updatedAt: Date;
            };
        } & {
            id: string;
            categoryId: string;
            courseId: string;
        })[];
    } & {
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        cost: number;
        discount: number | null;
        publicationDate: Date;
        level: import(".prisma/client").$Enums.CourseLevel;
        featured: boolean;
        averageRating: number | null;
        participants: number;
        instructorId: string | null;
    })[]>;
    getModulesByCourseId(courseId: string): Promise<({
        classes: {
            id: string;
            description: string;
            moduleId: string;
        }[];
    } & {
        id: string;
        courseId: string;
        description: string;
    })[]>;
    getClassesByModuleId(moduleId: string): Promise<({
        comments: {
            id: string;
            createdAt: Date;
            userId: string;
            type: import(".prisma/client").$Enums.CommentType;
            rating: number;
            content: string;
            classId: string;
        }[];
    } & {
        id: string;
        description: string;
        moduleId: string;
    })[]>;
}
