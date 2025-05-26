import { FeatureCode } from '@prisma/client';
import { MinisiteService } from './minisite.service';
export declare class MinisiteController {
    private readonly minisite;
    constructor(minisite: MinisiteService);
    getQuotas(empresaId: string): Promise<import("./minisite.service").UsageResponse<any>[]>;
    getQuota(empresaId: string, code: FeatureCode): Promise<import("./minisite.service").UsageResponse<any>>;
    getObjects(empresaId: string): Promise<Record<import(".prisma/client").$Enums.FeatureCode, any[]>>;
    getObjectsByCode(empresaId: string, code: FeatureCode): Promise<any[]>;
    upsertProduct(empresaId: string, body: any): Promise<{
        description: string;
        name: string;
        categoryId: number;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        isFeatured: boolean | null;
        lab: string | null;
        activeIngredients: string[];
        features: string[];
        benefits: string[];
        problemAddressed: string | null;
        imageMain: string | null;
        imageGallery: string[];
        isBestSeller: boolean | null;
        isOnSale: boolean | null;
        companyId: string;
    }>;
    upsertBanner(empresaId: string, body: any): Promise<{
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
    }>;
    upsertFeatured(empresaId: string, body: any): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        productId: string;
        minisiteId: string;
        order: number | null;
        tagline: string | null;
    }>;
    upsertHighlight(empresaId: string, body: any): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        productId: string;
        minisiteId: string;
        highlightFeatures: string[];
        highlightDescription: string | null;
        hoghlightImageUrl: string | null;
    }>;
    upsertSlide(empresaId: string, body: any): Promise<{
        description: string;
        title: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        minisiteId: string;
        order: number | null;
        cta: string | null;
        imageSrc: string | null;
    }>;
}
