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
            description: string;
            experienceYears: number;
            certificationsUrl: string;
            userId: string;
            bannerImage: string | null;
            followers: number | null;
            title: string | null;
            profession: import(".prisma/client").$Enums.Profession;
            type: import(".prisma/client").$Enums.ProfessionType;
            experienceDescription: string;
            empresaId: string | null;
            categoryId: string | null;
        }[];
    }>;
}
