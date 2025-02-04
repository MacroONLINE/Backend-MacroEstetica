import { PrismaService } from 'src/prisma/prisma.service';
export declare class EventStreamsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    createStream(data: any): Promise<{
        id: string;
        startDateTime: Date;
        endDateTime: Date;
        createdAt: Date;
        updatedAt: Date;
        eventId: string;
        channelName: string;
    }>;
    getStreamByChannelName(channelName: string): Promise<{
        event: {
            instructor: {
                userId: string;
            };
            attendees: {
                id: string;
            }[];
        } & {
            id: string;
            title: string;
            description: string;
            date: Date;
            time: string;
            startDateTime: Date;
            endDateTime: Date;
            location: string;
            bannerUrl: string | null;
            companyId: string | null;
            instructorId: string;
            ctaUrl: string | null;
            ctaButtonText: string;
            logoUrl: string | null;
            createdAt: Date;
            updatedAt: Date;
        };
    } & {
        id: string;
        startDateTime: Date;
        endDateTime: Date;
        createdAt: Date;
        updatedAt: Date;
        eventId: string;
        channelName: string;
    }>;
}
