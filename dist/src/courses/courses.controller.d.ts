import { CoursesService } from './courses.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { CreateModuleDto } from './dto/create-module.dto';
import { CreateClassDto } from './dto/create-class.dto';
import { CreateCommentDto } from './dto/create-comment.dto';
import { CreateCategoryDto } from './dto/create-category.dto';
import { CoursesFetchDto } from './dto/courses-fetch.dto';
export declare class CoursesController {
    private readonly coursesService;
    constructor(coursesService: CoursesService);
    createCourse(createCourseDto: CreateCourseDto): Promise<{
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
    createModule(createModuleDto: CreateModuleDto): Promise<{
        id: string;
        description: string;
        courseId: string;
    }>;
    createClass(createClassDto: CreateClassDto): Promise<{
        id: string;
        description: string;
        moduleId: string;
    }>;
    createComment(createCommentDto: CreateCommentDto): Promise<{
        id: string;
        createdAt: Date;
        userId: string;
        content: string;
        type: import(".prisma/client").$Enums.CommentType;
        classId: string;
        rating: number;
    }>;
    createCategory(createCategoryDto: CreateCategoryDto): Promise<{
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
            description: string;
            courseId: string;
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
        description: string;
        courseId: string;
    })[]>;
    getClassesByModuleId(moduleId: string): Promise<({
        comments: {
            id: string;
            createdAt: Date;
            userId: string;
            content: string;
            type: import(".prisma/client").$Enums.CommentType;
            classId: string;
            rating: number;
        }[];
    } & {
        id: string;
        description: string;
        moduleId: string;
    })[]>;
    getFeaturedCoursesFetch(): Promise<CoursesFetchDto[]>;
}
