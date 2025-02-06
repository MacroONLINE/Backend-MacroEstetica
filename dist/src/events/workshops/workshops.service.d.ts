import { PrismaService } from 'src/prisma/prisma.service';
export declare class WorkshopsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    createWorkshop(data: any): Promise<{
        id: string;
        eventId: string | null;
        classroomId: string | null;
        title: string;
        description: string;
        whatYouWillLearn: string | null;
        price: number | null;
        startDateTime: Date;
        endDateTime: Date;
        channelName: string | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    getWorkshopById(id: string): Promise<{
        event: {
            id: string;
            title: string;
            startDateTime: Date;
            endDateTime: Date;
            createdAt: Date;
            updatedAt: Date;
            longDescription: string | null;
            mainBannerUrl: string | null;
            mainImageUrl: string | null;
            physicalLocation: string | null;
            mapUrl: string | null;
            leadingCompanyId: string | null;
            instructorId: string | null;
            target: import(".prisma/client").$Enums.Target | null;
        };
        classroom: {
            id: string;
            title: string;
            description: string | null;
            createdAt: Date;
            updatedAt: Date;
        };
        orators: {
            id: string;
            title: string | null;
            description: string;
            createdAt: Date;
            updatedAt: Date;
            profession: import(".prisma/client").$Enums.Profession;
            type: import(".prisma/client").$Enums.ProfessionType;
            experienceYears: number;
            certificationsUrl: string;
            status: string;
            userId: string;
            empresaId: string | null;
            categoryId: string | null;
            bannerImage: string | null;
            followers: number | null;
        }[];
        enrollments: ({
            user: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                status: boolean;
                firstName: string | null;
                lastName: string | null;
                phone: string | null;
                email: string;
                emailVerified: Date | null;
                address: string | null;
                province: string | null;
                city: string | null;
                country: string | null;
                countryCode: string | null;
                zipCode: string | null;
                role: import(".prisma/client").$Enums.Role;
                password: string;
                newsletter: boolean;
                userSubscription: string | null;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            status: string;
            userId: string;
            workshopId: string;
        })[];
    } & {
        id: string;
        eventId: string | null;
        classroomId: string | null;
        title: string;
        description: string;
        whatYouWillLearn: string | null;
        price: number | null;
        startDateTime: Date;
        endDateTime: Date;
        channelName: string | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    updateWorkshop(id: string, data: any): Promise<{
        id: string;
        eventId: string | null;
        classroomId: string | null;
        title: string;
        description: string;
        whatYouWillLearn: string | null;
        price: number | null;
        startDateTime: Date;
        endDateTime: Date;
        channelName: string | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    deleteWorkshop(id: string): Promise<{
        message: string;
    }>;
    getWorkshopByChannel(channelName: string): Promise<{
        event: {
            id: string;
            title: string;
            startDateTime: Date;
            endDateTime: Date;
            createdAt: Date;
            updatedAt: Date;
            longDescription: string | null;
            mainBannerUrl: string | null;
            mainImageUrl: string | null;
            physicalLocation: string | null;
            mapUrl: string | null;
            leadingCompanyId: string | null;
            instructorId: string | null;
            target: import(".prisma/client").$Enums.Target | null;
        };
        classroom: {
            id: string;
            title: string;
            description: string | null;
            createdAt: Date;
            updatedAt: Date;
        };
        orators: {
            id: string;
            title: string | null;
            description: string;
            createdAt: Date;
            updatedAt: Date;
            profession: import(".prisma/client").$Enums.Profession;
            type: import(".prisma/client").$Enums.ProfessionType;
            experienceYears: number;
            certificationsUrl: string;
            status: string;
            userId: string;
            empresaId: string | null;
            categoryId: string | null;
            bannerImage: string | null;
            followers: number | null;
        }[];
        enrollments: ({
            user: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                status: boolean;
                firstName: string | null;
                lastName: string | null;
                phone: string | null;
                email: string;
                emailVerified: Date | null;
                address: string | null;
                province: string | null;
                city: string | null;
                country: string | null;
                countryCode: string | null;
                zipCode: string | null;
                role: import(".prisma/client").$Enums.Role;
                password: string;
                newsletter: boolean;
                userSubscription: string | null;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            status: string;
            userId: string;
            workshopId: string;
        })[];
    } & {
        id: string;
        eventId: string | null;
        classroomId: string | null;
        title: string;
        description: string;
        whatYouWillLearn: string | null;
        price: number | null;
        startDateTime: Date;
        endDateTime: Date;
        channelName: string | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
}
