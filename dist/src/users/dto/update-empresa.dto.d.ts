import { Giro, SubscriptionType } from '@prisma/client';
export declare class CreateEmpresaDto {
    dni?: string;
    name: string;
    giro: Giro;
    subscription?: SubscriptionType;
    userId: string;
    bannerImage?: string;
    logo?: string;
    title?: string;
    profileImage?: string;
    ceo?: string;
    ceoRole?: string;
    location?: string;
    followers?: number;
    webUrl: string;
}
