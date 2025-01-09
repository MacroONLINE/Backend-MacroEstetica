import { EventsService } from './events.service';
export declare class EventsController {
    private readonly eventsService;
    constructor(eventsService: EventsService);
    getEventsByEmpresa(empresaId: string): Promise<({
        instructor: {
            id: string;
            description: string;
            userId: string;
            empresaId: string | null;
            type: import(".prisma/client").$Enums.ProfessionType;
            createdAt: Date;
            updatedAt: Date;
            status: string;
            profession: import(".prisma/client").$Enums.Profession;
            experienceYears: number;
            certificationsUrl: string;
        };
        categories: {
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            urlIcon: string;
            colorHex: string;
        }[];
        attendees: {
            id: string;
            phone: string | null;
            email: string;
            createdAt: Date;
            updatedAt: Date;
            firstName: string | null;
            lastName: string | null;
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
            newsletter: boolean;
            userSubscription: string | null;
        }[];
    } & {
        id: string;
        description: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        location: string;
        date: Date;
        time: string;
        bannerUrl: string | null;
        companyId: string | null;
        ctaUrl: string | null;
        ctaButtonText: string;
        logoUrl: string | null;
        instructorId: string;
    })[]>;
}
