import { EmpresaService } from './empresa.service';
export declare class EmpresaController {
    private readonly empresaService;
    constructor(empresaService: EmpresaService);
    getAllByCategory(category: string): Promise<{
        subscription: import(".prisma/client").$Enums.SubscriptionType | null;
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        dni: string | null;
        giro: import(".prisma/client").$Enums.Giro;
        categoria: import(".prisma/client").$Enums.EmpresaCategory;
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
        subscription: import(".prisma/client").$Enums.SubscriptionType | null;
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        dni: string | null;
        giro: import(".prisma/client").$Enums.Giro;
        categoria: import(".prisma/client").$Enums.EmpresaCategory;
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
