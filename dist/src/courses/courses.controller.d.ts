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
        aboutDescription: string | null;
        totalHours: number;
        whatYouWillLearn: import("@prisma/client/runtime/library").JsonValue | null;
        requirements: import("@prisma/client/runtime/library").JsonValue | null;
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
        courseId: string | null;
    }>;
    createClass(createClassDto: CreateClassDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string;
        moduleId: string | null;
    }>;
    createComment(createCommentDto: CreateCommentDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        type: import(".prisma/client").$Enums.CommentType;
        rating: number;
        content: string;
        classId: string | null;
        courseId: string | null;
    }>;
    createCategory(createCategoryDto: CreateCategoryDto): Promise<{
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        urlIcon: string;
        colorHex: string;
    }>;
    getAllCourses(): Promise<CourseResponseDto[]>;
    getFeaturedCourses(): Promise<CourseResponseDto[]>;
    getCoursesByCategory(categoryId: string): Promise<CourseResponseDto[]>;
    getCoursesByInstructor(instructorId: string): Promise<CourseResponseDto[]>;
    getCoursesByTarget(target: Target): Promise<CourseResponseDto[]>;
    getCourseById(courseId: string): Promise<CourseResponseDto>;
}
