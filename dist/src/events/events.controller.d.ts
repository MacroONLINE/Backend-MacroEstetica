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
        orators: any;
    }>;
}
