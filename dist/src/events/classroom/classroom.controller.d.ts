import { ClassroomService } from './classroom.service';
export declare class ClassroomController {
    private readonly classroomService;
    constructor(classroomService: ClassroomService);
    createClassroom(body: any): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        description: string;
        startDateTime: Date;
        endDateTime: Date;
        price: number | null;
        categories: import(".prisma/client").$Enums.Profession[];
        imageUrl: string | null;
        channelName: string | null;
    }>;
    updateClassroom(id: string, body: any): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        description: string;
        startDateTime: Date;
        endDateTime: Date;
        price: number | null;
        categories: import(".prisma/client").$Enums.Profession[];
        imageUrl: string | null;
        channelName: string | null;
    }>;
    deleteClassroom(id: string): Promise<{
        message: string;
    }>;
    getUpcomingClassrooms(): Promise<({
        enrollments: {
            id: string;
            status: string;
            createdAt: Date;
            updatedAt: Date;
            userId: string;
            classroomId: string;
        }[];
        attendees: {
            id: string;
            firstName: string | null;
            lastName: string | null;
            phone: string | null;
            email: string;
            emailVerified: Date | null;
            address: string | null;
            province: string | null;
            city: string | null;
            country: string | null;
            countryCode: string | null;
            zipCode: string | null;
            role: import(".prisma/client").$Enums.Role;
            password: string;
            status: boolean;
            createdAt: Date;
            updatedAt: Date;
            newsletter: boolean;
            userSubscription: string | null;
        }[];
        orators: {
            id: string;
            status: string;
            createdAt: Date;
            updatedAt: Date;
            type: import(".prisma/client").$Enums.ProfessionType;
            userId: string;
            bannerImage: string | null;
            title: string | null;
            followers: number | null;
            profession: import(".prisma/client").$Enums.Profession;
            description: string;
            experienceDescription: string;
            experienceYears: number;
            certificationsUrl: string;
            empresaId: string | null;
            categoryId: string | null;
        }[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        description: string;
        startDateTime: Date;
        endDateTime: Date;
        price: number | null;
        categories: import(".prisma/client").$Enums.Profession[];
        imageUrl: string | null;
        channelName: string | null;
    })[]>;
    getClassroomById(id: string): Promise<{
        enrollments: {
            id: string;
            status: string;
            createdAt: Date;
            updatedAt: Date;
            userId: string;
            classroomId: string;
        }[];
        attendees: {
            id: string;
            firstName: string | null;
            lastName: string | null;
            phone: string | null;
            email: string;
            emailVerified: Date | null;
            address: string | null;
            province: string | null;
            city: string | null;
            country: string | null;
            countryCode: string | null;
            zipCode: string | null;
            role: import(".prisma/client").$Enums.Role;
            password: string;
            status: boolean;
            createdAt: Date;
            updatedAt: Date;
            newsletter: boolean;
            userSubscription: string | null;
        }[];
        orators: {
            id: string;
            status: string;
            createdAt: Date;
            updatedAt: Date;
            type: import(".prisma/client").$Enums.ProfessionType;
            userId: string;
            bannerImage: string | null;
            title: string | null;
            followers: number | null;
            profession: import(".prisma/client").$Enums.Profession;
            description: string;
            experienceDescription: string;
            experienceYears: number;
            certificationsUrl: string;
            empresaId: string | null;
            categoryId: string | null;
        }[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        description: string;
        startDateTime: Date;
        endDateTime: Date;
        price: number | null;
        categories: import(".prisma/client").$Enums.Profession[];
        imageUrl: string | null;
        channelName: string | null;
    }>;
}
