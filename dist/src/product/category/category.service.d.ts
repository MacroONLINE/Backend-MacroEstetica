import { PrismaService } from 'src/prisma/prisma.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { Prisma } from '@prisma/client';
export declare class CategoryService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(data: CreateCategoryDto): Promise<{
        name: string;
        id: number;
        createdAt: Date;
        updatedAt: Date;
        companyId: string;
        bannerImageUrl: string | null;
        miniSiteImageUrl: string | null;
        footerBanner: string | null;
        iconUrl: string | null;
    }>;
    findAll(): Promise<{
        name: string;
        id: number;
        createdAt: Date;
        updatedAt: Date;
        companyId: string;
        bannerImageUrl: string | null;
        miniSiteImageUrl: string | null;
        footerBanner: string | null;
        iconUrl: string | null;
    }[]>;
    findOne(id: number): Promise<{
        name: string;
        id: number;
        createdAt: Date;
        updatedAt: Date;
        companyId: string;
        bannerImageUrl: string | null;
        miniSiteImageUrl: string | null;
        footerBanner: string | null;
        iconUrl: string | null;
    }>;
    update(id: number, data: Prisma.ProductCompanyCategoryUpdateInput): Promise<{
        name: string;
        id: number;
        createdAt: Date;
        updatedAt: Date;
        companyId: string;
        bannerImageUrl: string | null;
        miniSiteImageUrl: string | null;
        footerBanner: string | null;
        iconUrl: string | null;
    }>;
    remove(id: number): Promise<{
        name: string;
        id: number;
        createdAt: Date;
        updatedAt: Date;
        companyId: string;
        bannerImageUrl: string | null;
        miniSiteImageUrl: string | null;
        footerBanner: string | null;
        iconUrl: string | null;
    }>;
    findAllByEmpresa(empresaId: string): Promise<({
        products: {
            name: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            description: string;
            categoryId: number;
            companyId: string;
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
        }[];
    } & {
        name: string;
        id: number;
        createdAt: Date;
        updatedAt: Date;
        companyId: string;
        bannerImageUrl: string | null;
        miniSiteImageUrl: string | null;
        footerBanner: string | null;
        iconUrl: string | null;
    })[]>;
}
