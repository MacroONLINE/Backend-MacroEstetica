import { PrismaService } from 'src/prisma/prisma.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { CreateModuleDto } from './dto/create-module.dto';
import { CreateClassDto } from './dto/create-class.dto';
import { CreateCommentDto } from './dto/create-comment.dto';
import { CreateCategoryDto } from './dto/create-category.dto';
import { CourseResponseDto } from './response-dto/course-response.dto';
import { Target } from '@prisma/client';
import { ActiveCoursesDto } from './dto/course-card.dto/active-courses.dto';
export declare class CoursesService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    private mapToCourseResponseDto;
    createCourse(dto: CreateCourseDto): Promise<{
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
    createCategory(dto: CreateCategoryDto): Promise<{
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
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
    markClassAsCompleted(userId: string, classId: string): Promise<{
        userId: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        classId: string;
        completed: boolean;
    }>;
    createClassComment(dto: CreateCommentDto): Promise<{
        userId: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        content: string;
        classId: string;
        parentCommentId: string | null;
    }>;
    getActiveCoursesCardInfo(userId: string): Promise<ActiveCoursesDto>;
}
