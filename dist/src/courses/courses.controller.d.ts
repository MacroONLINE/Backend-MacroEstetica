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
    createModule(createModuleDto: CreateModuleDto): Promise<{
        id: string;
        description: string;
        createdAt: Date;
        updatedAt: Date;
        courseId: string | null;
    }>;
    createClass(createClassDto: CreateClassDto): Promise<{
        id: string;
        description: string;
        createdAt: Date;
        updatedAt: Date;
        moduleId: string | null;
    }>;
    createComment(createCommentDto: CreateCommentDto): Promise<{
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
    createCategory(createCategoryDto: CreateCategoryDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
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
