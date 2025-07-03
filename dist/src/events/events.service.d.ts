import { PrismaService } from 'src/prisma/prisma.service';
export declare class EventsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    private formatDate;
    private fullyFormatDates;
    private setIsLiveOnEvents;
    createEvent(data: any): Promise<any>;
    registerAttendee(eventId: string, userId: string): Promise<boolean>;
    enrollEventStream(eventStreamId: string, userId: string): Promise<boolean>;
    enrollWorkshop(workshopId: string, userId: string): Promise<boolean>;
    enrollClassroom(classroomId: string, userId: string): Promise<boolean>;
    isUserEnrolled(id: string, userId: string, type: 'event' | 'classroom' | 'stream' | 'workshop'): Promise<boolean>;
    getEventById(eventId: string): Promise<any>;
    getStreamsAndWorkshopsByEvent(eventId: string): Promise<any>;
    getUpcomingEvents(): Promise<any[]>;
    getUpcomingEventsByYear(year: number): Promise<any[]>;
    getPhysicalEvents(): Promise<any[]>;
    getPhysicalEventsByEmpresa(empresaId: string): Promise<any[]>;
    getLiveEvents(): Promise<any[]>;
    getEventsByLeadingCompany(empresaId: string): Promise<any[]>;
    getOratorsByChannelName(channelName: string): Promise<{
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
