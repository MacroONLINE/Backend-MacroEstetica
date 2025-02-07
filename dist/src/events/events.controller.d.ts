import { EventsService } from './events.service';
export declare class EventsController {
    private readonly eventsService;
    constructor(eventsService: EventsService);
    createEvent(body: any): Promise<{
        id: string;
        title: string;
        longDescription: string | null;
        mainBannerUrl: string | null;
        mainImageUrl: string | null;
        physicalLocation: string | null;
        startDateTime: Date;
        endDateTime: Date;
        mapUrl: string | null;
        leadingCompanyId: string | null;
        instructorId: string | null;
        target: import(".prisma/client").$Enums.Target | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    registerAttendee(eventId: string, body: {
        userId: string;
    }): Promise<{
        message: string;
    }>;
    getEventsByEmpresa(empresaId: string): Promise<({
        leadingCompany: {
            id: string;
            title: string | null;
            createdAt: Date;
            updatedAt: Date;
            name: string;
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
        streams: {
            id: string;
            startDateTime: Date;
            endDateTime: Date;
            createdAt: Date;
            updatedAt: Date;
            eventId: string;
            channelName: string | null;
        }[];
        workshops: {
            id: string;
            title: string;
            startDateTime: Date;
            endDateTime: Date;
            createdAt: Date;
            updatedAt: Date;
            eventId: string | null;
            channelName: string | null;
            classroomId: string | null;
            description: string;
            whatYouWillLearn: string | null;
            price: number | null;
        }[];
        organizers: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            eventId: string;
            career: string | null;
            photoUrl: string | null;
        }[];
        offers: ({
            products: {
                id: string;
                title: string;
                createdAt: Date;
                updatedAt: Date;
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
        title: string;
        longDescription: string | null;
        mainBannerUrl: string | null;
        mainImageUrl: string | null;
        physicalLocation: string | null;
        startDateTime: Date;
        endDateTime: Date;
        mapUrl: string | null;
        leadingCompanyId: string | null;
        instructorId: string | null;
        target: import(".prisma/client").$Enums.Target | null;
        createdAt: Date;
        updatedAt: Date;
    })[]>;
    getEventById(eventId: string): Promise<{
        leadingCompany: {
            id: string;
            title: string | null;
            createdAt: Date;
            updatedAt: Date;
            name: string;
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
        streams: {
            id: string;
            startDateTime: Date;
            endDateTime: Date;
            createdAt: Date;
            updatedAt: Date;
            eventId: string;
            channelName: string | null;
        }[];
        workshops: {
            id: string;
            title: string;
            startDateTime: Date;
            endDateTime: Date;
            createdAt: Date;
            updatedAt: Date;
            eventId: string | null;
            channelName: string | null;
            classroomId: string | null;
            description: string;
            whatYouWillLearn: string | null;
            price: number | null;
        }[];
        organizers: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            eventId: string;
            career: string | null;
            photoUrl: string | null;
        }[];
        offers: ({
            products: {
                id: string;
                title: string;
                createdAt: Date;
                updatedAt: Date;
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
        title: string;
        longDescription: string | null;
        mainBannerUrl: string | null;
        mainImageUrl: string | null;
        physicalLocation: string | null;
        startDateTime: Date;
        endDateTime: Date;
        mapUrl: string | null;
        leadingCompanyId: string | null;
        instructorId: string | null;
        target: import(".prisma/client").$Enums.Target | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    getEventStreamsAndWorkshops(eventId: string): Promise<{
        eventId: string;
        streams: {
            id: string;
            startDateTime: Date;
            endDateTime: Date;
            createdAt: Date;
            updatedAt: Date;
            eventId: string;
            channelName: string | null;
        }[];
        workshops: {
            id: string;
            title: string;
            startDateTime: Date;
            endDateTime: Date;
            createdAt: Date;
            updatedAt: Date;
            eventId: string | null;
            channelName: string | null;
            classroomId: string | null;
            description: string;
            whatYouWillLearn: string | null;
            price: number | null;
        }[];
    }>;
}
export declare class WorkshopsController {
    private readonly eventsService;
    constructor(eventsService: EventsService);
    getWorkshopById(workshopId: string): Promise<{
        event: {
            id: string;
            title: string;
            longDescription: string | null;
            mainBannerUrl: string | null;
            mainImageUrl: string | null;
            physicalLocation: string | null;
            startDateTime: Date;
            endDateTime: Date;
            mapUrl: string | null;
            leadingCompanyId: string | null;
            instructorId: string | null;
            target: import(".prisma/client").$Enums.Target | null;
            createdAt: Date;
            updatedAt: Date;
        };
        enrollments: ({
            user: {
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
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            userId: string;
            status: string;
            workshopId: string;
        })[];
        orators: {
            id: string;
            title: string | null;
            createdAt: Date;
            updatedAt: Date;
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
        classroom: {
            id: string;
            title: string;
            createdAt: Date;
            updatedAt: Date;
            description: string | null;
        };
    } & {
        id: string;
        title: string;
        startDateTime: Date;
        endDateTime: Date;
        createdAt: Date;
        updatedAt: Date;
        eventId: string | null;
        channelName: string | null;
        classroomId: string | null;
        description: string;
        whatYouWillLearn: string | null;
        price: number | null;
    }>;
}
export declare class ClassroomController {
    private readonly eventsService;
    constructor(eventsService: EventsService);
    getWorkshopsByClassroom(classroomId: string): Promise<{
        id: string;
        title: string;
        startDateTime: Date;
        endDateTime: Date;
        createdAt: Date;
        updatedAt: Date;
        eventId: string | null;
        channelName: string | null;
        classroomId: string | null;
        description: string;
        whatYouWillLearn: string | null;
        price: number | null;
    }[]>;
}
