import { EventsService } from './events.service';
export declare class EventsController {
    private readonly eventsService;
    constructor(eventsService: EventsService);
    createEvent(body: any): Promise<{
        id: string;
        title: string;
        description: string;
        date: Date;
        time: string;
        startDateTime: Date;
        endDateTime: Date;
        location: string;
        bannerUrl: string | null;
        companyId: string | null;
        instructorId: string;
        ctaUrl: string | null;
        ctaButtonText: string;
        logoUrl: string | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    registerAttendee(eventId: string, body: {
        userId: string;
    }): Promise<{
        message: string;
    }>;
    getEventsByEmpresa(empresaId: string): Promise<({
        categories: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            urlIcon: string;
            colorHex: string;
        }[];
        instructor: {
            id: string;
            title: string | null;
            description: string;
            createdAt: Date;
            updatedAt: Date;
            profession: import(".prisma/client").$Enums.Profession;
            type: import(".prisma/client").$Enums.ProfessionType;
            experienceYears: number;
            certificationsUrl: string;
            status: string;
            userId: string;
            empresaId: string | null;
            categoryId: string | null;
            bannerImage: string | null;
            followers: number | null;
        };
        attendees: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            status: boolean;
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
            newsletter: boolean;
            userSubscription: string | null;
        }[];
        streams: {
            id: string;
            startDateTime: Date;
            endDateTime: Date;
            createdAt: Date;
            updatedAt: Date;
            eventId: string;
            channelName: string;
        }[];
    } & {
        id: string;
        title: string;
        description: string;
        date: Date;
        time: string;
        startDateTime: Date;
        endDateTime: Date;
        location: string;
        bannerUrl: string | null;
        companyId: string | null;
        instructorId: string;
        ctaUrl: string | null;
        ctaButtonText: string;
        logoUrl: string | null;
        createdAt: Date;
        updatedAt: Date;
    })[]>;
    getEventById(eventId: string): Promise<{
        categories: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            urlIcon: string;
            colorHex: string;
        }[];
        instructor: {
            id: string;
            title: string | null;
            description: string;
            createdAt: Date;
            updatedAt: Date;
            profession: import(".prisma/client").$Enums.Profession;
            type: import(".prisma/client").$Enums.ProfessionType;
            experienceYears: number;
            certificationsUrl: string;
            status: string;
            userId: string;
            empresaId: string | null;
            categoryId: string | null;
            bannerImage: string | null;
            followers: number | null;
        };
        attendees: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            status: boolean;
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
            newsletter: boolean;
            userSubscription: string | null;
        }[];
        streams: {
            id: string;
            startDateTime: Date;
            endDateTime: Date;
            createdAt: Date;
            updatedAt: Date;
            eventId: string;
            channelName: string;
        }[];
    } & {
        id: string;
        title: string;
        description: string;
        date: Date;
        time: string;
        startDateTime: Date;
        endDateTime: Date;
        location: string;
        bannerUrl: string | null;
        companyId: string | null;
        instructorId: string;
        ctaUrl: string | null;
        ctaButtonText: string;
        logoUrl: string | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
}
