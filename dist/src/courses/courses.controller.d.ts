import { CoursesService } from './courses.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { CreateModuleDto } from './dto/create-module.dto';
import { CreateClassDto } from './dto/create-class.dto';
import { CreateCommentDto } from './dto/create-comment.dto';
import { CreateCategoryDto } from './dto/create-category.dto';
import { Target } from '@prisma/client';
import { ActiveCoursesDto } from './dto/course-card.dto/active-courses.dto';
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
    getActiveCourses(req: any): Promise<ActiveCoursesDto>;
    createModule(createModuleDto: CreateModuleDto): Promise<{
        id: string;
        description: string;
        createdAt: Date;
        updatedAt: Date;
        courseId: string | null;
    }>;
    createClass(createClassDto: CreateClassDto): Promise<{
        id: string;
        title: string;
        description: string;
        createdAt: Date;
        updatedAt: Date;
        moduleId: string | null;
        imageUrl: string | null;
        videoUrl: string | null;
    }>;
    createComment(createCommentDto: CreateCommentDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        classId: string;
        parentCommentId: string | null;
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
    getAllCourses(): Promise<import("./response-dto/course-response.dto").CourseResponseDto[]>;
    getFeaturedCourses(): Promise<import("./response-dto/course-response.dto").CourseResponseDto[]>;
    getCoursesByCategory(categoryId: string): Promise<import("./response-dto/course-response.dto").CourseResponseDto[]>;
    getCoursesByInstructor(instructorId: string): Promise<import("./response-dto/course-response.dto").CourseResponseDto[]>;
    getCoursesByTarget(target: Target): Promise<import("./response-dto/course-response.dto").CourseResponseDto[]>;
    getCourseById(courseId: string): Promise<import("./response-dto/course-response.dto").CourseResponseDto>;
    getUserCourses(userId: string, req: any): Promise<any[]>;
    getUserCourseProgress(userId: string, courseId: string, req: any): Promise<{
        courseId: string;
        totalClasses: number;
        completedClasses: number;
        completedClassIds: string[];
        isCompleted: boolean;
    }>;
    isUserEnrolled(courseId: string, userId: string, req: any): Promise<{
        enrolled: boolean;
    }>;
    getUserModuleProgress(moduleId: string, userId: string, req: any): Promise<{
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
    markClassAsCompleted(classId: string, userId: string, req: any): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        classId: string;
        completed: boolean;
    }>;
}
