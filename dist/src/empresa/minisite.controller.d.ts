import { FeatureCode } from '@prisma/client';
import { MinisiteService } from './minisite.service';
export declare class MinisiteController {
    private readonly minisite;
    private readonly logger;
    constructor(minisite: MinisiteService);
    getQuotas(empresaId: string): Promise<import("./minisite.service").UsageResponse<any>[]>;
    getQuota(empresaId: string, code: FeatureCode): Promise<import("./minisite.service").UsageResponse<any>>;
    getObjects(empresaId: string): Promise<Record<import(".prisma/client").$Enums.FeatureCode, any[]>>;
    getObjectsByCode(empresaId: string, code: FeatureCode): Promise<{
        name: string;
        id: string;
    }[] | {
        name: string;
        id: number;
    }[] | {
        title: string;
        id: string;
    }[] | {
        id: string;
        productId: string;
    }[]>;
    getSetup(empresaId: string): Promise<{
        company: {
            minisite: {
                minisiteColor: string;
                slogan: string;
            };
            title: string;
            name: string;
            giro: import(".prisma/client").$Enums.Giro;
            profileImage: string;
            location: string;
        };
        minisiteColor: string;
        slides: {
            description: string;
            title: string;
            id: string;
            order: number;
            cta: string;
            imageSrc: string;
        }[];
        slideUsage: {
            used: number;
            limit: number;
        };
        banners: {
            banner: string;
            description: string;
            title: string;
            logo: string;
            empresaId: string | null;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            date: Date | null;
            cta_url: string | null;
            cta_button_text: string;
        }[];
    }>;
    setup(empresaId: string, body: any, files: Express.Multer.File[]): Promise<{
        ok: boolean;
    }>;
    bulkProducts(empresaId: string, productsRaw: string, rawFiles: Express.Multer.File[]): Promise<{
        alias: number;
        created: boolean;
        type: string;
        productId?: string;
        message: string;
    }[]>;
    uploadVideo(empresaId: string, video: Express.Multer.File): Promise<{
        videoUrl: string;
    }>;
    getVideo(empresaId: string): Promise<{
        videoUrl: string;
    }>;
}
