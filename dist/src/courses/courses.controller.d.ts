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
        description: string;
        title: string;
        categoryId: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        rating: number;
        target: import(".prisma/client").$Enums.Target;
        price: number;
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
        commentsCount: number;
        averageRating: number;
        participantsCount: number;
        introductoryVideoUrl: string | null;
    }>;
    getActiveCourses(userId: string): Promise<ActiveCoursesDto>;
    createModule(dto: CreateModuleDto): Promise<{
        description: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        courseId: string | null;
    }>;
    createClass(dto: CreateClassDto): Promise<{
        description: string;
        title: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        imageUrl: string | null;
        moduleId: string | null;
        videoUrl: string | null;
    }>;
    createComment(dto: CreateCommentDto): Promise<{
        userId: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        content: string;
        classId: string;
        parentCommentId: string | null;
    }>;
    createCategory(dto: CreateCategoryDto): Promise<{
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        urlIcon: string;
        colorHex: string;
    }>;
    getAllCourses(userId?: string): Promise<(import("./response-dto/course-response.dto").CourseResponseDto & {
        liked: boolean;
    })[]>;
    getFeaturedCourses(userId?: string): Promise<(import("./response-dto/course-response.dto").CourseResponseDto & {
        liked: boolean;
    })[]>;
    getCoursesByCategory(categoryId: string, userId?: string): Promise<(import("./response-dto/course-response.dto").CourseResponseDto & {
        liked: boolean;
    })[]>;
    getCoursesByInstructor(instructorId: string, userId?: string): Promise<(import("./response-dto/course-response.dto").CourseResponseDto & {
        liked: boolean;
    })[]>;
    getCoursesByTarget(target: Target, userId?: string): Promise<(import("./response-dto/course-response.dto").CourseResponseDto & {
        liked: boolean;
    })[]>;
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
            title: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            classId: string;
            fileUrl: string;
        }[];
    }[]>;
    markClassAsCompleted(classId: string, userId: string): Promise<{
        userId: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        classId: string;
        completed: boolean;
    }>;
    getCourseWishlist(userId: string): Promise<(import("./response-dto/course-response.dto").CourseResponseDto & {
        liked: boolean;
    })[]>;
    getCourseById(courseId: string, userId?: string): Promise<import("./response-dto/course-response.dto").CourseResponseDto & {
        liked: boolean;
    }>;
    getModuleById(moduleId: string): Promise<{
        classes: ({
            classComments: ({
                user: {
                    firstName: string;
                    lastName: string;
                    profileImageUrl: string;
                };
                replies: ({
                    user: {
                        firstName: string;
                        lastName: string;
                        profileImageUrl: string;
                    };
                } & {
                    userId: string;
                    id: string;
                    createdAt: Date;
                    updatedAt: Date;
                    content: string;
                    classId: string;
                    parentCommentId: string | null;
                })[];
            } & {
                userId: string;
                id: string;
                createdAt: Date;
                updatedAt: Date;
                content: string;
                classId: string;
                parentCommentId: string | null;
            })[];
            classResources: {
                title: string;
                id: string;
                createdAt: Date;
                updatedAt: Date;
                classId: string;
                fileUrl: string;
            }[];
        } & {
            description: string;
            title: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            imageUrl: string | null;
            moduleId: string | null;
            videoUrl: string | null;
        })[];
    } & {
        description: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        courseId: string | null;
    }>;
    getModulesByCourse(courseId: string): Promise<({
        classes: ({
            classComments: ({
                user: {
                    firstName: string;
                    lastName: string;
                    profileImageUrl: string;
                };
                replies: ({
                    user: {
                        firstName: string;
                        lastName: string;
                        profileImageUrl: string;
                    };
                } & {
                    userId: string;
                    id: string;
                    createdAt: Date;
                    updatedAt: Date;
                    content: string;
                    classId: string;
                    parentCommentId: string | null;
                })[];
            } & {
                userId: string;
                id: string;
                createdAt: Date;
                updatedAt: Date;
                content: string;
                classId: string;
                parentCommentId: string | null;
            })[];
            classResources: {
                title: string;
                id: string;
                createdAt: Date;
                updatedAt: Date;
                classId: string;
                fileUrl: string;
            }[];
        } & {
            description: string;
            title: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            imageUrl: string | null;
            moduleId: string | null;
            videoUrl: string | null;
        })[];
    } & {
        description: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        courseId: string | null;
    })[]>;
}
