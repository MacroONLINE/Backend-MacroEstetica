import { Giro, SubscriptionType, EmpresaCategory } from '@prisma/client';
export declare class UpdateEmpresaDto {
    userId: string;
    name: string;
    giro?: Giro;
    categoria?: EmpresaCategory;
    subscription?: SubscriptionType;
    webUrl?: string;
    bannerImage?: string;
    logo?: string;
    title?: string;
    profileImage?: string;
    ceo?: string;
    ceoRole?: string;
    location?: string;
    dni?: string;
}
