import { EventsService } from './events.service';
export declare class EventsController {
    private readonly eventsService;
    constructor(eventsService: EventsService);
    createEvent(body: any): Promise<any>;
    registerAttendee(eventId: string, body: {
        userId: string;
    }): Promise<{
        message: string;
    }>;
    getPhysicalEvents(): Promise<any[]>;
    getPhysicalEventsByEmpresa(empresaId: string): Promise<any[]>;
    getEventsByEmpresa(empresaId: string): Promise<any[]>;
    getUpcomingEvents(): Promise<any[]>;
    getUpcomingEventsByYear(year: number): Promise<any[]>;
    getLiveEvents(): Promise<any[]>;
    getEventById(eventId: string): Promise<any>;
    isUserEnrolled(id: string, userId: string, type: 'event' | 'classroom' | 'stream' | 'workshop'): Promise<boolean>;
    getEventStreamsAndWorkshops(eventId: string): Promise<any>;
    enrollEventStream(eventStreamId: string, body: {
        userId: string;
    }): Promise<{
        message: string;
    }>;
    enrollWorkshop(workshopId: string, body: {
        userId: string;
    }): Promise<{
        message: string;
    }>;
    enrollClassroom(classroomId: string, body: {
        userId: string;
    }): Promise<{
        message: string;
    }>;
    getOratorsByChannel(channelName: string): Promise<{
        type: string;
        entityId: string;
        orators: {
            userId: string;
            type: import(".prisma/client").$Enums.ProfessionType;
            description: string;
            title: string | null;
            profession: import(".prisma/client").$Enums.Profession;
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
            genero: import(".prisma/client").$Enums.Gender | null;
        }[];
    }>;
}
