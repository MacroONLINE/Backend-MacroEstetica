import { PrismaService } from 'src/prisma/prisma.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { Prisma } from '@prisma/client';
export declare class CategoryService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(data: CreateCategoryDto): Promise<{
        company: {
            logo: string;
        };
    } & {
        id: number;
        name: string;
        companyId: string;
        createdAt: Date;
        updatedAt: Date;
        bannerImageUrl: string | null;
        miniSiteImageUrl: string | null;
        footerBanner: string | null;
        iconUrl: string | null;
    }>;
    findAll(): Promise<({
        company: {
            logo: string;
        };
    } & {
        id: number;
        name: string;
        companyId: string;
        createdAt: Date;
        updatedAt: Date;
        bannerImageUrl: string | null;
        miniSiteImageUrl: string | null;
        footerBanner: string | null;
        iconUrl: string | null;
    })[]>;
    findOne(id: number): Promise<{
        company: {
            logo: string;
        };
    } & {
        id: number;
        name: string;
        companyId: string;
        createdAt: Date;
        updatedAt: Date;
        bannerImageUrl: string | null;
        miniSiteImageUrl: string | null;
        footerBanner: string | null;
        iconUrl: string | null;
    }>;
    update(id: number, data: Prisma.ProductCompanyCategoryUpdateInput): Promise<{
        company: {
            logo: string;
        };
    } & {
        id: number;
        name: string;
        companyId: string;
        createdAt: Date;
        updatedAt: Date;
        bannerImageUrl: string | null;
        miniSiteImageUrl: string | null;
        footerBanner: string | null;
        iconUrl: string | null;
    }>;
    remove(id: number): Promise<{
        company: {
            logo: string;
        };
    } & {
        id: number;
        name: string;
        companyId: string;
        createdAt: Date;
        updatedAt: Date;
        bannerImageUrl: string | null;
        miniSiteImageUrl: string | null;
        footerBanner: string | null;
        iconUrl: string | null;
    }>;
    findAllByEmpresa(empresaId: string): Promise<({
        products: {
            id: string;
            name: string;
        }[];
        company: {
            logo: string;
        };
    } & {
        id: number;
        name: string;
        companyId: string;
        createdAt: Date;
        updatedAt: Date;
        bannerImageUrl: string | null;
        miniSiteImageUrl: string | null;
        footerBanner: string | null;
        iconUrl: string | null;
    })[]>;
    findCategoriesByEmpresa(empresaId: string): Promise<{
        id: number;
        name: string;
        bannerImageUrl: string;
        miniSiteImageUrl: string;
    }[]>;
    private plan;
    private checkQuota;
}
