import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
declare const UpdateCategoryDto_base: import("@nestjs/mapped-types").MappedType<Partial<CreateCategoryDto>>;
declare class UpdateCategoryDto extends UpdateCategoryDto_base {
}
export declare class CategoryController {
    private readonly categoryService;
    constructor(categoryService: CategoryService);
    create(dto: CreateCategoryDto, files: {
        bannerImage?: Express.Multer.File[];
        miniSiteImage?: Express.Multer.File[];
    }): Promise<{
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
    findOne(id: string): Promise<{
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
    update(id: string, data: UpdateCategoryDto, files: {
        bannerImage?: Express.Multer.File[];
        miniSiteImage?: Express.Multer.File[];
    }): Promise<{
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
    remove(id: string): Promise<{
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
}
export {};
