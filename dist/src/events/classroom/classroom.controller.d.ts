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
        description: string;
        title: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        enrollments: {
            userId: string;
            status: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            classroomId: string;
        }[];
        _count: {
            enrollments: number;
            attendees: number;
            orators: number;
        };
        channelName: string;
        endDateTime: Date;
        imageUrl: string;
        price: number;
        startDateTime: Date;
        categories: $Enums.Profession[];
        isFree: boolean;
        orators: {
            userId: string;
            type: $Enums.ProfessionType;
            description: string;
            title: string | null;
            profession: $Enums.Profession;
            bannerImage: string | null;
            experienceYears: number;
            certificationsUrl: string;
            status: string;
            empresaId: string | null;
            categoryId: string | null;
            validated: boolean | null;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            followers: number | null;
            experienceDescription: string;
            genero: $Enums.Gender | null;
        }[];
        attendees: {
            status: boolean;
            firstName: string | null;
            lastName: string | null;
            phone: string | null;
            address: string | null;
            province: string | null;
            city: string | null;
            country: string | null;
            countryCode: string | null;
            zipCode: string | null;
            password: string;
            id: string;
            email: string;
            emailVerified: Date | null;
            role: $Enums.Role;
            createdAt: Date;
            updatedAt: Date;
            newsletter: boolean;
            userSubscription: string | null;
            profileImageUrl: string | null;
        }[];
    }>;
    update(id: string, dto: UpdateClassroomDto, image?: Express.Multer.File): Promise<{
        description: string;
        title: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        enrollments: {
            userId: string;
            status: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            classroomId: string;
        }[];
        _count: {
            enrollments: number;
            attendees: number;
            orators: number;
        };
        channelName: string;
        endDateTime: Date;
        imageUrl: string;
        price: number;
        startDateTime: Date;
        categories: $Enums.Profession[];
        isFree: boolean;
        orators: {
            userId: string;
            type: $Enums.ProfessionType;
            description: string;
            title: string | null;
            profession: $Enums.Profession;
            bannerImage: string | null;
            experienceYears: number;
            certificationsUrl: string;
            status: string;
            empresaId: string | null;
            categoryId: string | null;
            validated: boolean | null;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            followers: number | null;
            experienceDescription: string;
            genero: $Enums.Gender | null;
        }[];
        attendees: {
            status: boolean;
            firstName: string | null;
            lastName: string | null;
            phone: string | null;
            address: string | null;
            province: string | null;
            city: string | null;
            country: string | null;
            countryCode: string | null;
            zipCode: string | null;
            password: string;
            id: string;
            email: string;
            emailVerified: Date | null;
            role: $Enums.Role;
            createdAt: Date;
            updatedAt: Date;
            newsletter: boolean;
            userSubscription: string | null;
            profileImageUrl: string | null;
        }[];
    }>;
    remove(id: string): Promise<{
        message: string;
    }>;
    upcoming(): Promise<{
        description: string;
        title: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        enrollments: {
            userId: string;
            status: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            classroomId: string;
        }[];
        _count: {
            enrollments: number;
            attendees: number;
            orators: number;
        };
        channelName: string;
        endDateTime: Date;
        imageUrl: string;
        price: number;
        startDateTime: Date;
        categories: $Enums.Profession[];
        isFree: boolean;
        orators: {
            userId: string;
            type: $Enums.ProfessionType;
            description: string;
            title: string | null;
            profession: $Enums.Profession;
            bannerImage: string | null;
            experienceYears: number;
            certificationsUrl: string;
            status: string;
            empresaId: string | null;
            categoryId: string | null;
            validated: boolean | null;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            followers: number | null;
            experienceDescription: string;
            genero: $Enums.Gender | null;
        }[];
        attendees: {
            status: boolean;
            firstName: string | null;
            lastName: string | null;
            phone: string | null;
            address: string | null;
            province: string | null;
            city: string | null;
            country: string | null;
            countryCode: string | null;
            zipCode: string | null;
            password: string;
            id: string;
            email: string;
            emailVerified: Date | null;
            role: $Enums.Role;
            createdAt: Date;
            updatedAt: Date;
            newsletter: boolean;
            userSubscription: string | null;
            profileImageUrl: string | null;
        }[];
    }[]>;
    live(): Promise<{
        description: string;
        title: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        enrollments: {
            userId: string;
            status: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            classroomId: string;
        }[];
        _count: {
            enrollments: number;
            attendees: number;
            orators: number;
        };
        channelName: string;
        endDateTime: Date;
        imageUrl: string;
        price: number;
        startDateTime: Date;
        categories: $Enums.Profession[];
        isFree: boolean;
        orators: {
            userId: string;
            type: $Enums.ProfessionType;
            description: string;
            title: string | null;
            profession: $Enums.Profession;
            bannerImage: string | null;
            experienceYears: number;
            certificationsUrl: string;
            status: string;
            empresaId: string | null;
            categoryId: string | null;
            validated: boolean | null;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            followers: number | null;
            experienceDescription: string;
            genero: $Enums.Gender | null;
        }[];
        attendees: {
            status: boolean;
            firstName: string | null;
            lastName: string | null;
            phone: string | null;
            address: string | null;
            province: string | null;
            city: string | null;
            country: string | null;
            countryCode: string | null;
            zipCode: string | null;
            password: string;
            id: string;
            email: string;
            emailVerified: Date | null;
            role: $Enums.Role;
            createdAt: Date;
            updatedAt: Date;
            newsletter: boolean;
            userSubscription: string | null;
            profileImageUrl: string | null;
        }[];
    }[]>;
    findOne(id: string): Promise<{
        description: string;
        title: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        enrollments: {
            userId: string;
            status: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            classroomId: string;
        }[];
        _count: {
            enrollments: number;
            attendees: number;
            orators: number;
        };
        channelName: string;
        endDateTime: Date;
        imageUrl: string;
        price: number;
        startDateTime: Date;
        categories: $Enums.Profession[];
        isFree: boolean;
        orators: {
            userId: string;
            type: $Enums.ProfessionType;
            description: string;
            title: string | null;
            profession: $Enums.Profession;
            bannerImage: string | null;
            experienceYears: number;
            certificationsUrl: string;
            status: string;
            empresaId: string | null;
            categoryId: string | null;
            validated: boolean | null;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            followers: number | null;
            experienceDescription: string;
            genero: $Enums.Gender | null;
        }[];
        attendees: {
            status: boolean;
            firstName: string | null;
            lastName: string | null;
            phone: string | null;
            address: string | null;
            province: string | null;
            city: string | null;
            country: string | null;
            countryCode: string | null;
            zipCode: string | null;
            password: string;
            id: string;
            email: string;
            emailVerified: Date | null;
            role: $Enums.Role;
            createdAt: Date;
            updatedAt: Date;
            newsletter: boolean;
            userSubscription: string | null;
            profileImageUrl: string | null;
        }[];
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
