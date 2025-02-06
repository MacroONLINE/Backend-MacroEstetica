import { EventStreamsService } from './event-streams.service';
export declare class EventStreamsController {
    private readonly eventStreamsService;
    constructor(eventStreamsService: EventStreamsService);
    createStream(body: any): Promise<{
        id: string;
        eventId: string;
        channelName: string | null;
        startDateTime: Date;
        endDateTime: Date;
        createdAt: Date;
        updatedAt: Date;
    }>;
    getStreamById(id: string): Promise<{
        event: {
            leadingCompany: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                name: string;
                title: string | null;
                dni: string | null;
                legalName: string | null;
                giro: import(".prisma/client").$Enums.Giro;
                categoria: import(".prisma/client").$Enums.EmpresaCategory;
                userId: string;
                subscription: import(".prisma/client").$Enums.SubscriptionType | null;
                bannerImage: string | null;
                logo: string | null;
                profileImage: string | null;
                ceo: string | null;
                ceoRole: string | null;
                location: string | null;
                followers: number;
                webUrl: string | null;
            };
            workshops: {
                id: string;
                eventId: string | null;
                channelName: string | null;
                startDateTime: Date;
                endDateTime: Date;
                createdAt: Date;
                updatedAt: Date;
                title: string;
                classroomId: string | null;
                description: string;
                whatYouWillLearn: string | null;
                price: number | null;
            }[];
            organizers: {
                id: string;
                eventId: string;
                createdAt: Date;
                updatedAt: Date;
                name: string;
                career: string | null;
                photoUrl: string | null;
            }[];
            attendees: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
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
                newsletter: boolean;
                userSubscription: string | null;
            }[];
        } & {
            id: string;
            startDateTime: Date;
            endDateTime: Date;
            createdAt: Date;
            updatedAt: Date;
            title: string;
            longDescription: string | null;
            mainBannerUrl: string | null;
            mainImageUrl: string | null;
            physicalLocation: string | null;
            mapUrl: string | null;
            leadingCompanyId: string | null;
            instructorId: string | null;
            target: import(".prisma/client").$Enums.Target | null;
        };
        orators: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            title: string | null;
            userId: string;
            bannerImage: string | null;
            followers: number | null;
            description: string;
            status: string;
            profession: import(".prisma/client").$Enums.Profession;
            type: import(".prisma/client").$Enums.ProfessionType;
            experienceYears: number;
            certificationsUrl: string;
            empresaId: string | null;
            categoryId: string | null;
        }[];
    } & {
        id: string;
        eventId: string;
        channelName: string | null;
        startDateTime: Date;
        endDateTime: Date;
        createdAt: Date;
        updatedAt: Date;
    }>;
}
