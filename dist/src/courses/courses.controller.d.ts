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
        description: string;
        title: string;
        categoryId: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        rating: number;
        price: number;
        target: import(".prisma/client").$Enums.Target;
        whatYouWillLearn: import("@prisma/client/runtime/library").JsonValue | null;
        bannerUrl: string;
        courseImageUrl: string;
        aboutDescription: string | null;
        totalHours: number;
        level: string;
        discountPercentage: number | null;
        instructorId: string | null;
        requirements: import("@prisma/client/runtime/library").JsonValue | null;
        isFeatured: boolean | null;
        participantsCount: number;
        commentsCount: number;
        averageRating: number;
        introductoryVideoUrl: string | null;
    }>;
    getActiveCourses(req: any): Promise<ActiveCoursesDto>;
    createModule(createModuleDto: CreateModuleDto): Promise<{
        description: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        courseId: string | null;
    }>;
    createClass(createClassDto: CreateClassDto): Promise<{
        description: string;
        title: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        imageUrl: string | null;
        moduleId: string | null;
        videoUrl: string | null;
    }>;
    createComment(createCommentDto: CreateCommentDto): Promise<{
        userId: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        content: string;
        classId: string;
        parentCommentId: string | null;
    }>;
    createCategory(createCategoryDto: CreateCategoryDto): Promise<{
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
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
            title: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            classId: string;
            fileUrl: string;
        }[];
    }[]>;
    markClassAsCompleted(classId: string, userId: string, req: any): Promise<{
        userId: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        classId: string;
        completed: boolean;
    }>;
}
