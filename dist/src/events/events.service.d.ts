import { PrismaService } from 'src/prisma/prisma.service';
export declare class EventsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    private formatDate;
    private fullyFormatDates;
    createEvent(data: any): Promise<any>;
    registerAttendee(eventId: string, userId: string): Promise<boolean>;
    isUserEnrolled(id: string, userId: string, type: 'event' | 'classroom' | 'stream' | 'workshop'): Promise<boolean>;
    getEventById(eventId: string): Promise<any>;
    getStreamsAndWorkshopsByEvent(eventId: string): Promise<any>;
    getFullSchedule(eventId: string): Promise<any>;
    getWorkshopById(workshopId: string): Promise<any>;
    getUpcomingEvents(): Promise<any[]>;
    getUpcomingEventsByYear(year: number): Promise<any[]>;
    getPhysicalEvents(): Promise<any[]>;
    getPhysicalEventsByEmpresa(empresaId: string): Promise<any[]>;
    getLiveEvents(): Promise<any[]>;
    getEventsByLeadingCompany(empresaId: string): Promise<any[]>;
    enrollEventStream(eventStreamId: string, userId: string): Promise<boolean>;
}
