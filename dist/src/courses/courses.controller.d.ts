import { CoursesService } from './courses.service';
export declare class CoursesController {
    private readonly coursesService;
    constructor(coursesService: CoursesService);
    getAllCourses(): Promise<({
        instructor: {
            user: {
                firstName: string;
                lastName: string;
                profileImageUrl: string;
            };
        } & {
            id: string;
            title: string | null;
            description: string;
            createdAt: Date;
            updatedAt: Date;
            categoryId: string | null;
            status: string;
            profession: import(".prisma/client").$Enums.Profession;
            type: import(".prisma/client").$Enums.ProfessionType;
            experienceDescription: string;
            experienceYears: number;
            certificationsUrl: string;
            userId: string;
            empresaId: string | null;
            bannerImage: string | null;
            followers: number | null;
        };
        modules: ({
            classes: ({
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
                description: string;
                createdAt: Date;
                updatedAt: Date;
                moduleId: string | null;
                videoUrl: string | null;
            })[];
        } & {
            id: string;
            description: string;
            createdAt: Date;
            updatedAt: Date;
            courseId: string | null;
        })[];
    } & {
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
    })[]>;
    getCourseById(courseId: string): Promise<{
        instructor: {
            user: {
                firstName: string;
                lastName: string;
                profileImageUrl: string;
            };
        } & {
            id: string;
            title: string | null;
            description: string;
            createdAt: Date;
            updatedAt: Date;
            categoryId: string | null;
            status: string;
            profession: import(".prisma/client").$Enums.Profession;
            type: import(".prisma/client").$Enums.ProfessionType;
            experienceDescription: string;
            experienceYears: number;
            certificationsUrl: string;
            userId: string;
            empresaId: string | null;
            bannerImage: string | null;
            followers: number | null;
        };
        modules: ({
            classes: ({
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
                description: string;
                createdAt: Date;
                updatedAt: Date;
                moduleId: string | null;
                videoUrl: string | null;
            })[];
        } & {
            id: string;
            description: string;
            createdAt: Date;
            updatedAt: Date;
            courseId: string | null;
        })[];
    } & {
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
    getUserCourses(userId: string): Promise<any[]>;
    getUserCourseProgress(userId: string, courseId: string): Promise<{
        courseId: string;
        totalClasses: number;
        completedClasses: number;
        isCompleted: boolean;
    }>;
    getClassById(classId: string): Promise<{
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
        description: string;
        createdAt: Date;
        updatedAt: Date;
        moduleId: string | null;
        videoUrl: string | null;
    }>;
}
