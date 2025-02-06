import { PrismaService } from 'src/prisma/prisma.service';
export declare class EventsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    createEvent(data: any): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        longDescription: string | null;
        mainBannerUrl: string | null;
        mainImageUrl: string | null;
        physicalLocation: string | null;
        startDateTime: Date;
        endDateTime: Date;
        mapUrl: string | null;
        target: import(".prisma/client").$Enums.Target | null;
        leadingCompanyId: string | null;
        instructorId: string | null;
    }>;
    registerAttendee(eventId: string, userId: string): Promise<boolean>;
    getEventsByLeadingCompany(empresaId: string): Promise<({
        streams: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            startDateTime: Date;
            endDateTime: Date;
            eventId: string;
            channelName: string | null;
        }[];
        workshops: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            title: string;
            description: string;
            startDateTime: Date;
            endDateTime: Date;
            eventId: string | null;
            price: number | null;
            whatYouWillLearn: string | null;
            channelName: string | null;
            classroomId: string | null;
        }[];
        leadingCompany: {
            subscription: import(".prisma/client").$Enums.SubscriptionType | null;
            name: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            userId: string;
            dni: string | null;
            legalName: string | null;
            giro: import(".prisma/client").$Enums.Giro;
            categoria: import(".prisma/client").$Enums.EmpresaCategory;
            bannerImage: string | null;
            logo: string | null;
            title: string | null;
            profileImage: string | null;
            ceo: string | null;
            ceoRole: string | null;
            location: string | null;
            followers: number;
            webUrl: string | null;
        };
        organizers: {
            name: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            eventId: string;
            career: string | null;
            photoUrl: string | null;
        }[];
        offers: ({
            products: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                title: string;
                description: string;
                offerId: string;
            }[];
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            eventId: string;
            sectionTitle: string | null;
        })[];
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
        id: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        longDescription: string | null;
        mainBannerUrl: string | null;
        mainImageUrl: string | null;
        physicalLocation: string | null;
        startDateTime: Date;
        endDateTime: Date;
        mapUrl: string | null;
        target: import(".prisma/client").$Enums.Target | null;
        leadingCompanyId: string | null;
        instructorId: string | null;
    })[]>;
    getEventById(eventId: string): Promise<{
        streams: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            startDateTime: Date;
            endDateTime: Date;
            eventId: string;
            channelName: string | null;
        }[];
        workshops: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            title: string;
            description: string;
            startDateTime: Date;
            endDateTime: Date;
            eventId: string | null;
            price: number | null;
            whatYouWillLearn: string | null;
            channelName: string | null;
            classroomId: string | null;
        }[];
        leadingCompany: {
            subscription: import(".prisma/client").$Enums.SubscriptionType | null;
            name: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            userId: string;
            dni: string | null;
            legalName: string | null;
            giro: import(".prisma/client").$Enums.Giro;
            categoria: import(".prisma/client").$Enums.EmpresaCategory;
            bannerImage: string | null;
            logo: string | null;
            title: string | null;
            profileImage: string | null;
            ceo: string | null;
            ceoRole: string | null;
            location: string | null;
            followers: number;
            webUrl: string | null;
        };
        organizers: {
            name: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            eventId: string;
            career: string | null;
            photoUrl: string | null;
        }[];
        offers: ({
            products: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                title: string;
                description: string;
                offerId: string;
            }[];
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            eventId: string;
            sectionTitle: string | null;
        })[];
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
        id: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        longDescription: string | null;
        mainBannerUrl: string | null;
        mainImageUrl: string | null;
        physicalLocation: string | null;
        startDateTime: Date;
        endDateTime: Date;
        mapUrl: string | null;
        target: import(".prisma/client").$Enums.Target | null;
        leadingCompanyId: string | null;
        instructorId: string | null;
    }>;
}
