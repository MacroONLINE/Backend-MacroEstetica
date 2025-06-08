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
        id: string;
        name: string;
    }[] | {
        id: number;
        name: string;
    }[] | {
        id: string;
        title: string;
    }[] | {
        id: string;
        productId: string;
    }[]>;
    getSetup(empresaId: string): Promise<{
        company: {
            name: string;
            title: string;
            minisite: {
                minisiteColor: string;
                slogan: string;
            };
            giro: import(".prisma/client").$Enums.Giro;
            location: string;
            profileImage: string;
        };
        minisiteColor: string;
        slides: {
            id: string;
            description: string;
            title: string;
            cta: string;
            imageSrc: string;
            order: number;
        }[];
        slideUsage: {
            used: number;
            limit: number;
        };
        banners: {
            id: string;
            description: string;
            createdAt: Date;
            updatedAt: Date;
            title: string;
            empresaId: string | null;
            logo: string;
            banner: string;
            date: Date | null;
            cta_url: string | null;
            cta_button_text: string;
        }[];
    }>;
    setup(empresaId: string, body: any, files: Express.Multer.File[]): Promise<{
        ok: boolean;
    }>;
    bulkProducts(empresaId: string, productsRaw: string, rawFiles: Express.Multer.File[]): Promise<{
        productId: string;
        type: string;
    }[]>;
    uploadVideo(empresaId: string, video: Express.Multer.File): Promise<{
        videoUrl: string;
    }>;
}
