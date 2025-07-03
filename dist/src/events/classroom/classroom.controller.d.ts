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
    oratorIds?: string[];
    attendeeIds?: string[];
}
declare const UpdateClassroomDto_base: import("@nestjs/mapped-types").MappedType<Partial<CreateClassroomDto>>;
declare class UpdateClassroomDto extends UpdateClassroomDto_base {
}
declare class OratorDto {
    instructorId: string;
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
        enrollments: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            userId: string;
            status: string;
            classroomId: string;
        }[];
        attendees: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            status: boolean;
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
            newsletter: boolean;
            userSubscription: string | null;
            profileImageUrl: string | null;
        }[];
        orators: {
            id: string;
            title: string | null;
            description: string;
            createdAt: Date;
            updatedAt: Date;
            userId: string;
            profession: $Enums.Profession;
            type: $Enums.ProfessionType;
            experienceYears: number;
            certificationsUrl: string;
            status: string;
            empresaId: string | null;
            categoryId: string | null;
            bannerImage: string | null;
            followers: number | null;
            experienceDescription: string;
            genero: $Enums.Gender | null;
            validated: boolean | null;
        }[];
        _count: {
            enrollments: number;
            attendees: number;
            orators: number;
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
        enrollments: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            userId: string;
            status: string;
            classroomId: string;
        }[];
        attendees: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            status: boolean;
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
            newsletter: boolean;
            userSubscription: string | null;
            profileImageUrl: string | null;
        }[];
        orators: {
            id: string;
            title: string | null;
            description: string;
            createdAt: Date;
            updatedAt: Date;
            userId: string;
            profession: $Enums.Profession;
            type: $Enums.ProfessionType;
            experienceYears: number;
            certificationsUrl: string;
            status: string;
            empresaId: string | null;
            categoryId: string | null;
            bannerImage: string | null;
            followers: number | null;
            experienceDescription: string;
            genero: $Enums.Gender | null;
            validated: boolean | null;
        }[];
        _count: {
            enrollments: number;
            attendees: number;
            orators: number;
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
        enrollments: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            userId: string;
            status: string;
            classroomId: string;
        }[];
        attendees: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            status: boolean;
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
            newsletter: boolean;
            userSubscription: string | null;
            profileImageUrl: string | null;
        }[];
        orators: {
            id: string;
            title: string | null;
            description: string;
            createdAt: Date;
            updatedAt: Date;
            userId: string;
            profession: $Enums.Profession;
            type: $Enums.ProfessionType;
            experienceYears: number;
            certificationsUrl: string;
            status: string;
            empresaId: string | null;
            categoryId: string | null;
            bannerImage: string | null;
            followers: number | null;
            experienceDescription: string;
            genero: $Enums.Gender | null;
            validated: boolean | null;
        }[];
        _count: {
            enrollments: number;
            attendees: number;
            orators: number;
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
        enrollments: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            userId: string;
            status: string;
            classroomId: string;
        }[];
        attendees: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            status: boolean;
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
            newsletter: boolean;
            userSubscription: string | null;
            profileImageUrl: string | null;
        }[];
        orators: {
            id: string;
            title: string | null;
            description: string;
            createdAt: Date;
            updatedAt: Date;
            userId: string;
            profession: $Enums.Profession;
            type: $Enums.ProfessionType;
            experienceYears: number;
            certificationsUrl: string;
            status: string;
            empresaId: string | null;
            categoryId: string | null;
            bannerImage: string | null;
            followers: number | null;
            experienceDescription: string;
            genero: $Enums.Gender | null;
            validated: boolean | null;
        }[];
        _count: {
            enrollments: number;
            attendees: number;
            orators: number;
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
        enrollments: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            userId: string;
            status: string;
            classroomId: string;
        }[];
        attendees: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            status: boolean;
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
            newsletter: boolean;
            userSubscription: string | null;
            profileImageUrl: string | null;
        }[];
        orators: {
            id: string;
            title: string | null;
            description: string;
            createdAt: Date;
            updatedAt: Date;
            userId: string;
            profession: $Enums.Profession;
            type: $Enums.ProfessionType;
            experienceYears: number;
            certificationsUrl: string;
            status: string;
            empresaId: string | null;
            categoryId: string | null;
            bannerImage: string | null;
            followers: number | null;
            experienceDescription: string;
            genero: $Enums.Gender | null;
            validated: boolean | null;
        }[];
        _count: {
            enrollments: number;
            attendees: number;
            orators: number;
        };
    }>;
    addOrator(id: string, dto: OratorDto): Promise<{
        id: string;
        orators: {
            id: string;
        }[];
    }>;
    removeOrator(id: string, dto: OratorDto): Promise<{
        id: string;
        orators: {
            id: string;
        }[];
    }>;
}
export {};
