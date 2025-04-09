import { CoursesService } from './courses.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { CreateModuleDto } from './dto/create-module.dto';
import { CreateClassDto } from './dto/create-class.dto';
import { CreateCommentDto } from './dto/create-comment.dto';
import { CreateCategoryDto } from './dto/create-category.dto';
import { Target } from '@prisma/client';
export declare class CoursesController {
    private readonly coursesService;
    constructor(coursesService: CoursesService);
    createCourse(createCourseDto: CreateCourseDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string;
        rating: number;
        title: string;
        categoryId: string;
        price: number;
        target: import(".prisma/client").$Enums.Target;
        whatYouWillLearn: import("@prisma/client/runtime/library").JsonValue | null;
        bannerUrl: string;
        level: string;
        commentsCount: number;
        averageRating: number;
        discountPercentage: number | null;
        participantsCount: number;
        isFeatured: boolean | null;
        courseImageUrl: string;
        aboutDescription: string | null;
        requirements: import("@prisma/client/runtime/library").JsonValue | null;
        totalHours: number;
        introductoryVideoUrl: string | null;
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
        title: string;
        imageUrl: string | null;
        moduleId: string | null;
        videoUrl: string | null;
    }>;
    createComment(createCommentDto: CreateCommentDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
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
    getUserCourses(userId: string): Promise<any[]>;
    getUserCourseProgress(userId: string, courseId: string): Promise<{
        courseId: string;
        totalClasses: number;
        completedClasses: number;
        completedClassIds: string[];
        isCompleted: boolean;
    }>;
    getClassById(classId: string): Promise<{
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
                id: string;
                createdAt: Date;
                updatedAt: Date;
                userId: string;
                content: string;
                classId: string;
                parentCommentId: string | null;
            })[];
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            userId: string;
            content: string;
            classId: string;
            parentCommentId: string | null;
        })[];
        classResources: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            classId: string;
            title: string;
            fileUrl: string;
        }[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string;
        title: string;
        imageUrl: string | null;
        moduleId: string | null;
        videoUrl: string | null;
    }>;
    isUserEnrolled(courseId: string, userId: string): Promise<{
        enrolled: boolean;
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
                    id: string;
                    createdAt: Date;
                    updatedAt: Date;
                    userId: string;
                    content: string;
                    classId: string;
                    parentCommentId: string | null;
                })[];
            } & {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                userId: string;
                content: string;
                classId: string;
                parentCommentId: string | null;
            })[];
            classResources: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                classId: string;
                title: string;
                fileUrl: string;
            }[];
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            description: string;
            title: string;
            imageUrl: string | null;
            moduleId: string | null;
            videoUrl: string | null;
        })[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string;
        courseId: string | null;
    })[]>;
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
                    id: string;
                    createdAt: Date;
                    updatedAt: Date;
                    userId: string;
                    content: string;
                    classId: string;
                    parentCommentId: string | null;
                })[];
            } & {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                userId: string;
                content: string;
                classId: string;
                parentCommentId: string | null;
            })[];
            classResources: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                classId: string;
                title: string;
                fileUrl: string;
            }[];
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            description: string;
            title: string;
            imageUrl: string | null;
            moduleId: string | null;
            videoUrl: string | null;
        })[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string;
        courseId: string | null;
    }>;
    getUserModuleProgress(moduleId: string, userId: string): Promise<{
        classId: string;
        description: string;
        completed: boolean;
        classResources: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            classId: string;
            title: string;
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
}
