import { ClassroomService } from './classroom.service';
export declare class ClassroomController {
    private readonly classroomService;
    constructor(classroomService: ClassroomService);
    createClassroom(body: any): Promise<{
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
    updateClassroom(id: string, body: any): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        description: string | null;
    }>;
    deleteClassroom(id: string): Promise<{
        message: string;
    }>;
}
