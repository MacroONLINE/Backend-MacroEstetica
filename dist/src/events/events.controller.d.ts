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
            id: string;
            status: string;
            createdAt: Date;
            updatedAt: Date;
            type: import(".prisma/client").$Enums.ProfessionType;
            userId: string;
            profession: import(".prisma/client").$Enums.Profession;
            description: string;
            experienceDescription: string;
            experienceYears: number;
            certificationsUrl: string;
            bannerImage: string | null;
            followers: number | null;
            title: string | null;
            empresaId: string | null;
            categoryId: string | null;
        }[];
    }>;
}
