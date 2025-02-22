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
    isUserEnrolled(eventId: string, userId: string): Promise<boolean>;
    getEventStreamsAndWorkshops(eventId: string): Promise<any>;
}
