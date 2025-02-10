import { PrismaService } from 'src/prisma/prisma.service';
export declare class ClassroomService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    createClassroom(data: any): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        description: string | null;
    }>;
    getClassroomById(id: string): Promise<{
        workshops: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            title: string;
            description: string;
            startDateTime: Date;
            endDateTime: Date;
            eventId: string | null;
            price: number | null;
            whatYouWillLearn: string | null;
            channelName: string | null;
            classroomId: string | null;
        }[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        description: string | null;
    }>;
    updateClassroom(id: string, data: any): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        description: string | null;
    }>;
    deleteClassroom(id: string): Promise<{
        message: string;
    }>;
    getUpcomingWorkshopsForClassroom(classroomId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        description: string;
        startDateTime: Date;
        endDateTime: Date;
        eventId: string | null;
        price: number | null;
        whatYouWillLearn: string | null;
        channelName: string | null;
        classroomId: string | null;
    }[]>;
    getUpcomingClassrooms(): Promise<({
        workshops: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            title: string;
            description: string;
            startDateTime: Date;
            endDateTime: Date;
            eventId: string | null;
            price: number | null;
            whatYouWillLearn: string | null;
            channelName: string | null;
            classroomId: string | null;
        }[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        description: string | null;
    })[]>;
}
