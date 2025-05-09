import { CoursesService } from './courses.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { CreateModuleDto } from './dto/create-module.dto';
import { CreateClassDto } from './dto/create-class.dto';
import { CreateCommentDto } from './dto/create-comment.dto';
import { CreateCategoryDto } from './dto/create-category.dto';
import { ActiveCoursesDto } from './dto/course-card.dto/active-courses.dto';
import { Target, ReactionType } from '@prisma/client';
export declare class CoursesController {
    private readonly coursesService;
    constructor(coursesService: CoursesService);
    createCourse(dto: CreateCourseDto): Promise<{
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
    getActiveCourses(userId: string): Promise<ActiveCoursesDto>;
    createModule(dto: CreateModuleDto): Promise<{
        id: string;
        description: string;
        createdAt: Date;
        updatedAt: Date;
        courseId: string | null;
    }>;
    createClass(dto: CreateClassDto): Promise<{
        id: string;
        title: string;
        description: string;
        createdAt: Date;
        updatedAt: Date;
        moduleId: string | null;
        videoUrl: string | null;
        imageUrl: string | null;
    }>;
    createComment(dto: CreateCommentDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        classId: string;
        parentCommentId: string | null;
        content: string;
    }>;
    createCategory(dto: CreateCategoryDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        urlIcon: string;
        colorHex: string;
    }>;
    getAllCourses(): Promise<import("./response-dto/course-response.dto").CourseResponseDto[]>;
    getFeaturedCourses(): Promise<import("./response-dto/course-response.dto").CourseResponseDto[]>;
    getCoursesByCategory(categoryId: string): Promise<import("./response-dto/course-response.dto").CourseResponseDto[]>;
    getCoursesByInstructor(instructorId: string): Promise<import("./response-dto/course-response.dto").CourseResponseDto[]>;
    getCoursesByTarget(target: Target): Promise<import("./response-dto/course-response.dto").CourseResponseDto[]>;
    reactToCourse(courseId: string, userId: string, type: ReactionType): Promise<{
        userId: string;
        courseId: string;
        reacted: boolean;
        type?: undefined;
    } | {
        userId: string;
        courseId: string;
        reacted: boolean;
        type: import(".prisma/client").$Enums.ReactionType;
    }>;
    getUserCourses(userId: string): Promise<any[]>;
    getUserCourseProgress(userId: string, courseId: string): Promise<{
        courseId: string;
        totalClasses: number;
        completedClasses: number;
        completedClassIds: string[];
        isCompleted: boolean;
    }>;
    isUserEnrolled(courseId: string, userId: string): Promise<{
        enrolled: boolean;
    }>;
    getUserModuleProgress(moduleId: string, userId: string): Promise<{
        classId: string;
        description: string;
        completed: boolean;
        classResources: {
            id: string;
            title: string;
            createdAt: Date;
            updatedAt: Date;
            classId: string;
            fileUrl: string;
        }[];
    }[]>;
    markClassAsCompleted(classId: string, userId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        classId: string;
        completed: boolean;
    }>;
    getCourseWishlist(userId: string): Promise<import("./response-dto/course-response.dto").CourseResponseDto[]>;
    getCourseById(courseId: string): Promise<import("./response-dto/course-response.dto").CourseResponseDto>;
}
