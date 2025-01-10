import { PrismaService } from 'src/prisma/prisma.service';
export declare class EventsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    getEventsByEmpresaId(empresaId: string): Promise<({
        instructor: {
            id: string;
            status: string;
            createdAt: Date;
            updatedAt: Date;
            type: import(".prisma/client").$Enums.ProfessionType;
            userId: string;
            profession: import(".prisma/client").$Enums.Profession;
            description: string;
            experienceYears: number;
            certificationsUrl: string;
            empresaId: string | null;
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
    } & {
        companyId: string | null;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        location: string;
        description: string;
        date: Date;
        time: string;
        bannerUrl: string | null;
        ctaUrl: string | null;
        ctaButtonText: string;
        logoUrl: string | null;
        instructorId: string;
    })[]>;
}
