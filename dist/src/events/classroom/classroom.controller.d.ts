import { ClassroomService } from './classroom.service';
import { $Enums } from '@prisma/client';
declare class CreateClassroomDto {
    title: string;
    description: string;
    price: number;
    startDateTime: Date;
    endDateTime: Date;
    channelName?: string;
    categories?: $Enums.Profession[];
    oratorNames?: string;
    attendeeIds?: string[];
}
declare const UpdateClassroomDto_base: import("@nestjs/mapped-types").MappedType<Partial<CreateClassroomDto>>;
declare class UpdateClassroomDto extends UpdateClassroomDto_base {
}
export declare class ClassroomController {
    private readonly service;
    constructor(service: ClassroomService);
    create(dto: CreateClassroomDto, image?: Express.Multer.File): Promise<{
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
    update(id: string, dto: UpdateClassroomDto, image?: Express.Multer.File): Promise<{
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
    remove(id: string): Promise<{
        message: string;
    }>;
    upcoming(): Promise<{
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
    live(): Promise<{
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
    findOne(id: string): Promise<{
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
}
export {};
