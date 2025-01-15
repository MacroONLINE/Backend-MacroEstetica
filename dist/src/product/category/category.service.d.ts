import { PrismaService } from 'src/prisma/prisma.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { Prisma } from '@prisma/client';
export declare class CategoryService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(data: CreateCategoryDto): Promise<{
        id: number;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        companyId: string;
        bannerImageUrl: string | null;
        miniSiteImageUrl: string | null;
    }>;
    findAll(): Promise<{
        id: number;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        companyId: string;
        bannerImageUrl: string | null;
        miniSiteImageUrl: string | null;
    }[]>;
    findOne(id: number): Promise<{
        id: number;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        companyId: string;
        bannerImageUrl: string | null;
        miniSiteImageUrl: string | null;
    }>;
    update(id: number, data: Prisma.ProductCompanyCategoryUpdateInput): Promise<{
        id: number;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        companyId: string;
        bannerImageUrl: string | null;
        miniSiteImageUrl: string | null;
    }>;
    remove(id: number): Promise<{
        id: number;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        companyId: string;
        bannerImageUrl: string | null;
        miniSiteImageUrl: string | null;
    }>;
    findAllByEmpresa(empresaId: string): Promise<({
        products: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
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
        id: number;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        companyId: string;
        bannerImageUrl: string | null;
        miniSiteImageUrl: string | null;
    })[]>;
}
