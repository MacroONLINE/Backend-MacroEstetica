import { $Enums } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
type Ids = string[];
export interface CreateClassroomDto {
    title: string;
    description: string;
    price: number;
    startDateTime: Date;
    endDateTime: Date;
    channelName?: string;
    categories?: $Enums.Profession[];
    attendeeIds?: Ids;
    oratorNames?: string;
    image?: Express.Multer.File;
}
export interface UpdateClassroomDto extends Partial<CreateClassroomDto> {
}
export declare class ClassroomService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    private uploadImage;
    private connect;
    private set;
    private markLive;
    createClassroom(dto: CreateClassroomDto): Promise<{
        id: string;
        title: string;
        description: string;
        createdAt: Date;
        updatedAt: Date;
        channelName: string;
        endDateTime: Date;
        imageUrl: string;
        price: number;
        startDateTime: Date;
        categories: $Enums.Profession[];
        isFree: boolean;
        oratorNames: string;
        enrollments: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            status: string;
            classroomId: string;
            userId: string;
        }[];
        attendees: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            email: string;
            firstName: string | null;
            lastName: string | null;
            phone: string | null;
            emailVerified: Date | null;
            address: string | null;
            province: string | null;
            city: string | null;
            country: string | null;
            countryCode: string | null;
            zipCode: string | null;
            role: $Enums.Role;
            password: string;
            status: boolean;
            newsletter: boolean;
            userSubscription: string | null;
            profileImageUrl: string | null;
        }[];
        _count: {
            enrollments: number;
            attendees: number;
        };
    }>;
    getClassroomById(id: string): Promise<{
        id: string;
        title: string;
        description: string;
        createdAt: Date;
        updatedAt: Date;
        channelName: string;
        endDateTime: Date;
        imageUrl: string;
        price: number;
        startDateTime: Date;
        categories: $Enums.Profession[];
        isFree: boolean;
        oratorNames: string;
        enrollments: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            status: string;
            classroomId: string;
            userId: string;
        }[];
        attendees: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            email: string;
            firstName: string | null;
            lastName: string | null;
            phone: string | null;
            emailVerified: Date | null;
            address: string | null;
            province: string | null;
            city: string | null;
            country: string | null;
            countryCode: string | null;
            zipCode: string | null;
            role: $Enums.Role;
            password: string;
            status: boolean;
            newsletter: boolean;
            userSubscription: string | null;
            profileImageUrl: string | null;
        }[];
        _count: {
            enrollments: number;
            attendees: number;
        };
    }>;
    updateClassroom(id: string, dto: UpdateClassroomDto): Promise<{
        id: string;
        title: string;
        description: string;
        createdAt: Date;
        updatedAt: Date;
        channelName: string;
        endDateTime: Date;
        imageUrl: string;
        price: number;
        startDateTime: Date;
        categories: $Enums.Profession[];
        isFree: boolean;
        oratorNames: string;
        enrollments: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            status: string;
            classroomId: string;
            userId: string;
        }[];
        attendees: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            email: string;
            firstName: string | null;
            lastName: string | null;
            phone: string | null;
            emailVerified: Date | null;
            address: string | null;
            province: string | null;
            city: string | null;
            country: string | null;
            countryCode: string | null;
            zipCode: string | null;
            role: $Enums.Role;
            password: string;
            status: boolean;
            newsletter: boolean;
            userSubscription: string | null;
            profileImageUrl: string | null;
        }[];
        _count: {
            enrollments: number;
            attendees: number;
        };
    }>;
    deleteClassroom(id: string): Promise<{
        message: string;
    }>;
    getUpcomingClassrooms(): Promise<{
        id: string;
        title: string;
        description: string;
        createdAt: Date;
        updatedAt: Date;
        channelName: string;
        endDateTime: Date;
        imageUrl: string;
        price: number;
        startDateTime: Date;
        categories: $Enums.Profession[];
        isFree: boolean;
        oratorNames: string;
        enrollments: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            status: string;
            classroomId: string;
            userId: string;
        }[];
        attendees: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            email: string;
            firstName: string | null;
            lastName: string | null;
            phone: string | null;
            emailVerified: Date | null;
            address: string | null;
            province: string | null;
            city: string | null;
            country: string | null;
            countryCode: string | null;
            zipCode: string | null;
            role: $Enums.Role;
            password: string;
            status: boolean;
            newsletter: boolean;
            userSubscription: string | null;
            profileImageUrl: string | null;
        }[];
        _count: {
            enrollments: number;
            attendees: number;
        };
    }[]>;
    getLiveClassrooms(): Promise<{
        id: string;
        title: string;
        description: string;
        createdAt: Date;
        updatedAt: Date;
        channelName: string;
        endDateTime: Date;
        imageUrl: string;
        price: number;
        startDateTime: Date;
        categories: $Enums.Profession[];
        isFree: boolean;
        oratorNames: string;
        enrollments: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            status: string;
            classroomId: string;
            userId: string;
        }[];
        attendees: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            email: string;
            firstName: string | null;
            lastName: string | null;
            phone: string | null;
            emailVerified: Date | null;
            address: string | null;
            province: string | null;
            city: string | null;
            country: string | null;
            countryCode: string | null;
            zipCode: string | null;
            role: $Enums.Role;
            password: string;
            status: boolean;
            newsletter: boolean;
            userSubscription: string | null;
            profileImageUrl: string | null;
        }[];
        _count: {
            enrollments: number;
            attendees: number;
        };
    }[]>;
}
export {};
