import { EmpresaService } from './empresa.service';
export declare class EmpresaController {
    private readonly empresaService;
    constructor(empresaService: EmpresaService);
    getAllByCategory(category: string): Promise<{
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
    getAllByTarget(target: string): Promise<{
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
