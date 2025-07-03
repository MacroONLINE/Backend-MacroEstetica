import { ClassroomService } from './classroom.service';
declare class CreateClassroomDto {
    title: string;
    description: string;
    price: number;
    startDateTime: string;
    endDateTime: string;
    imageUrl?: string;
    channelName?: string;
    categoriesIds?: string[];
    oratorIds?: string[];
    attendeeIds?: string[];
}
declare class UpdateClassroomDto extends CreateClassroomDto {
}
declare class OratorDto {
    instructorId: string;
}
export declare class ClassroomController {
    private readonly classroomService;
    constructor(classroomService: ClassroomService);
    create(dto: CreateClassroomDto): Promise<{
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
        categories: import(".prisma/client").$Enums.Profession[];
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
            role: import(".prisma/client").$Enums.Role;
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
            profession: import(".prisma/client").$Enums.Profession;
            type: import(".prisma/client").$Enums.ProfessionType;
            experienceYears: number;
            certificationsUrl: string;
            status: string;
            empresaId: string | null;
            categoryId: string | null;
            bannerImage: string | null;
            followers: number | null;
            experienceDescription: string;
            genero: import(".prisma/client").$Enums.Gender | null;
            validated: boolean | null;
        }[];
        _count: {
            enrollments: number;
            attendees: number;
            orators: number;
        };
    }>;
    update(id: string, dto: UpdateClassroomDto): Promise<{
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
        categories: import(".prisma/client").$Enums.Profession[];
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
            role: import(".prisma/client").$Enums.Role;
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
            profession: import(".prisma/client").$Enums.Profession;
            type: import(".prisma/client").$Enums.ProfessionType;
            experienceYears: number;
            certificationsUrl: string;
            status: string;
            empresaId: string | null;
            categoryId: string | null;
            bannerImage: string | null;
            followers: number | null;
            experienceDescription: string;
            genero: import(".prisma/client").$Enums.Gender | null;
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
        categories: import(".prisma/client").$Enums.Profession[];
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
            role: import(".prisma/client").$Enums.Role;
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
            profession: import(".prisma/client").$Enums.Profession;
            type: import(".prisma/client").$Enums.ProfessionType;
            experienceYears: number;
            certificationsUrl: string;
            status: string;
            empresaId: string | null;
            categoryId: string | null;
            bannerImage: string | null;
            followers: number | null;
            experienceDescription: string;
            genero: import(".prisma/client").$Enums.Gender | null;
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
        categories: import(".prisma/client").$Enums.Profession[];
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
            role: import(".prisma/client").$Enums.Role;
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
            profession: import(".prisma/client").$Enums.Profession;
            type: import(".prisma/client").$Enums.ProfessionType;
            experienceYears: number;
            certificationsUrl: string;
            status: string;
            empresaId: string | null;
            categoryId: string | null;
            bannerImage: string | null;
            followers: number | null;
            experienceDescription: string;
            genero: import(".prisma/client").$Enums.Gender | null;
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
        categories: import(".prisma/client").$Enums.Profession[];
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
            role: import(".prisma/client").$Enums.Role;
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
            profession: import(".prisma/client").$Enums.Profession;
            type: import(".prisma/client").$Enums.ProfessionType;
            experienceYears: number;
            certificationsUrl: string;
            status: string;
            empresaId: string | null;
            categoryId: string | null;
            bannerImage: string | null;
            followers: number | null;
            experienceDescription: string;
            genero: import(".prisma/client").$Enums.Gender | null;
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
