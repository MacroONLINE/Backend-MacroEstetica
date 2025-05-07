import { PrismaService } from 'src/prisma/prisma.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { CreateModuleDto } from './dto/create-module.dto';
import { CreateClassDto } from './dto/create-class.dto';
import { CreateCommentDto } from './dto/create-comment.dto';
import { CreateCategoryDto } from './dto/create-category.dto';
import { CourseResponseDto } from './response-dto/course-response.dto';
import { Target, ReactionType } from '@prisma/client';
import { ActiveCoursesDto } from './dto/course-card.dto/active-courses.dto';
export declare class CoursesService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    private mapToCourseResponseDto;
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
    createCategory(dto: CreateCategoryDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        urlIcon: string;
        colorHex: string;
    }>;
    getAllCourses(): Promise<CourseResponseDto[]>;
    getCourseById(courseId: string): Promise<CourseResponseDto>;
    getFeaturedCourses(): Promise<CourseResponseDto[]>;
    getCoursesByCategory(categoryId: string): Promise<CourseResponseDto[]>;
    getCoursesByInstructor(instructorId: string): Promise<CourseResponseDto[]>;
    getCoursesByTarget(target: Target): Promise<CourseResponseDto[]>;
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
                classId: string;
                parentCommentId: string | null;
                content: string;
            })[];
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            userId: string;
            classId: string;
            parentCommentId: string | null;
            content: string;
        })[];
        classResources: {
            id: string;
            title: string;
            createdAt: Date;
            updatedAt: Date;
            classId: string;
            fileUrl: string;
        }[];
    } & {
        id: string;
        title: string;
        description: string;
        createdAt: Date;
        updatedAt: Date;
        moduleId: string | null;
        videoUrl: string | null;
        imageUrl: string | null;
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
                    classId: string;
                    parentCommentId: string | null;
                    content: string;
                })[];
            } & {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                userId: string;
                classId: string;
                parentCommentId: string | null;
                content: string;
            })[];
            classResources: {
                id: string;
                title: string;
                createdAt: Date;
                updatedAt: Date;
                classId: string;
                fileUrl: string;
            }[];
        } & {
            id: string;
            title: string;
            description: string;
            createdAt: Date;
            updatedAt: Date;
            moduleId: string | null;
            videoUrl: string | null;
            imageUrl: string | null;
        })[];
    } & {
        id: string;
        description: string;
        createdAt: Date;
        updatedAt: Date;
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
                    classId: string;
                    parentCommentId: string | null;
                    content: string;
                })[];
            } & {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                userId: string;
                classId: string;
                parentCommentId: string | null;
                content: string;
            })[];
            classResources: {
                id: string;
                title: string;
                createdAt: Date;
                updatedAt: Date;
                classId: string;
                fileUrl: string;
            }[];
        } & {
            id: string;
            title: string;
            description: string;
            createdAt: Date;
            updatedAt: Date;
            moduleId: string | null;
            videoUrl: string | null;
            imageUrl: string | null;
        })[];
    } & {
        id: string;
        description: string;
        createdAt: Date;
        updatedAt: Date;
        courseId: string | null;
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
    markClassAsCompleted(userId: string, classId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        classId: string;
        completed: boolean;
    }>;
    createClassComment(dto: CreateCommentDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        classId: string;
        parentCommentId: string | null;
        content: string;
    }>;
    getActiveCoursesCardInfo(userId: string): Promise<ActiveCoursesDto>;
    toggleCourseReaction(userId: string, courseId: string, type?: ReactionType): Promise<{
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
}
