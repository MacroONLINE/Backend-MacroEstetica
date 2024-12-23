import { PrismaService } from '../prisma/prisma.service';
import { EmpresaCategory, Target } from '@prisma/client';
export declare class EmpresaService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    getAllByCategory(category: EmpresaCategory): Promise<{
        id: string;
        dni: string | null;
        name: string;
        giro: import(".prisma/client").$Enums.Giro;
        categoria: import(".prisma/client").$Enums.EmpresaCategory;
        userId: string;
        createdAt: Date;
        updatedAt: Date;
        subscription: import(".prisma/client").$Enums.SubscriptionType | null;
        bannerImage: string | null;
        logo: string | null;
        title: string | null;
        profileImage: string | null;
        ceo: string | null;
        ceoRole: string | null;
        location: string | null;
        followers: number;
    }[]>;
    getAllByTarget(target: Target): Promise<{
        id: string;
        dni: string | null;
        name: string;
        giro: import(".prisma/client").$Enums.Giro;
        categoria: import(".prisma/client").$Enums.EmpresaCategory;
        userId: string;
        createdAt: Date;
        updatedAt: Date;
        subscription: import(".prisma/client").$Enums.SubscriptionType | null;
        bannerImage: string | null;
        logo: string | null;
        title: string | null;
        profileImage: string | null;
        ceo: string | null;
        ceoRole: string | null;
        location: string | null;
        followers: number;
    }[]>;
}
