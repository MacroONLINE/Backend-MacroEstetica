import { Giro, SubscriptionType } from '@prisma/client';
export declare class UpdateEmpresaDto {
    userId: string;
    name: string;
    giro?: Giro;
    subscription?: SubscriptionType;
    webUrl?: string;
    bannerImage?: string;
    logo?: string;
    title?: string;
    profileImage?: string;
    ceo?: string;
    ceoRole?: string;
    location?: string;
    followers?: number;
    dni?: string;
}
