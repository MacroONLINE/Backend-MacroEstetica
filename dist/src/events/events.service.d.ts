import { PrismaService } from 'src/prisma/prisma.service';
export declare class EventsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    getEventsByEmpresaId(empresaId: string): Promise<({
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
    } & {
        id: string;
        title: string;
        description: string;
        date: Date;
        time: string;
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
}
