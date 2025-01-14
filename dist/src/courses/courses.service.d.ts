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
    getCourseById(courseId: string): Promise<CourseResponseDto>;
    getAllCourses(): Promise<CourseResponseDto[]>;
    getFeaturedCourses(): Promise<CourseResponseDto[]>;
    getCoursesByCategory(categoryId: string): Promise<CourseResponseDto[]>;
    getCoursesByInstructor(instructorId: string): Promise<CourseResponseDto[]>;
    getCoursesByTarget(target: string): Promise<CourseResponseDto[]>;
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
    }>;
    createComment(data: CreateCommentDto): Promise<{
        id: string;
        rating: number;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        type: import(".prisma/client").$Enums.CommentType;
        courseId: string | null;
        classId: string | null;
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
}
