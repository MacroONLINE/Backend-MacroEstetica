import { PrismaService } from 'src/prisma/prisma.service';
export declare class EventStreamsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    createStream(data: any): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        startDateTime: Date;
        endDateTime: Date;
        eventId: string;
        imageUrl: string | null;
        channelName: string | null;
    }>;
    getStreamById(id: string): Promise<{
        event: {
            workshops: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                title: string;
                description: string;
                startDateTime: Date;
                endDateTime: Date;
                price: number | null;
                eventId: string | null;
                whatYouWillLearn: string | null;
                imageUrl: string | null;
                channelName: string | null;
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
            price: number;
            leadingCompanyId: string | null;
        };
        orators: {
            id: string;
            status: string;
            createdAt: Date;
            updatedAt: Date;
            type: import(".prisma/client").$Enums.ProfessionType;
            userId: string;
            bannerImage: string | null;
            title: string | null;
            followers: number | null;
            profession: import(".prisma/client").$Enums.Profession;
            description: string;
            experienceDescription: string;
            experienceYears: number;
            certificationsUrl: string;
            empresaId: string | null;
            categoryId: string | null;
        }[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        startDateTime: Date;
        endDateTime: Date;
        eventId: string;
        imageUrl: string | null;
        channelName: string | null;
    }>;
}
