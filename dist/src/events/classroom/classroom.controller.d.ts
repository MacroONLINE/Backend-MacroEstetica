import { ClassroomService } from './classroom.service';
export declare class ClassroomController {
    private readonly classroomService;
    constructor(classroomService: ClassroomService);
    createClassroom(body: any): Promise<{
        id: string;
        title: string;
        description: string | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    updateClassroom(id: string, body: any): Promise<{
        id: string;
        title: string;
        description: string | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    deleteClassroom(id: string): Promise<{
        message: string;
    }>;
    getUpcomingWorkshopsForClassroom(classroomId: string): Promise<{
        id: string;
        title: string;
        description: string;
        createdAt: Date;
        updatedAt: Date;
        eventId: string | null;
        classroomId: string | null;
        whatYouWillLearn: string | null;
        price: number | null;
        startDateTime: Date;
        endDateTime: Date;
        channelName: string | null;
    }[]>;
    getUpcomingClassrooms(): Promise<({
        workshops: {
            id: string;
            title: string;
            description: string;
            createdAt: Date;
            updatedAt: Date;
            eventId: string | null;
            classroomId: string | null;
            whatYouWillLearn: string | null;
            price: number | null;
            startDateTime: Date;
            endDateTime: Date;
            channelName: string | null;
        }[];
    } & {
        id: string;
        title: string;
        description: string | null;
        createdAt: Date;
        updatedAt: Date;
    })[]>;
    getClassroomById(id: string): Promise<{
        workshops: {
            id: string;
            title: string;
            description: string;
            createdAt: Date;
            updatedAt: Date;
            eventId: string | null;
            classroomId: string | null;
            whatYouWillLearn: string | null;
            price: number | null;
            startDateTime: Date;
            endDateTime: Date;
            channelName: string | null;
        }[];
    } & {
        id: string;
        title: string;
        description: string | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
}
