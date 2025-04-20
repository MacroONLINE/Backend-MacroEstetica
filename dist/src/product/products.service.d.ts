import { PrismaService } from '../prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
export declare class ProductService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(createProductDto: CreateProductDto): Promise<{
        description: string;
        categoryId: number;
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        benefits: string[];
        isFeatured: boolean | null;
        activeIngredients: string[];
        features: string[];
        imageGallery: string[];
        imageMain: string | null;
        isBestSeller: boolean | null;
        isOnSale: boolean | null;
        lab: string | null;
        problemAddressed: string | null;
        companyId: string;
    }>;
    findAll(companyId: string): Promise<({
        presentations: {
            description: string | null;
            id: number;
            createdAt: Date;
            updatedAt: Date;
            price: number | null;
            productId: string;
            size: import("@prisma/client/runtime/library").Decimal;
            unit: import(".prisma/client").$Enums.Unit;
        }[];
    } & {
        description: string;
        categoryId: number;
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        benefits: string[];
        isFeatured: boolean | null;
        activeIngredients: string[];
        features: string[];
        imageGallery: string[];
        imageMain: string | null;
        isBestSeller: boolean | null;
        isOnSale: boolean | null;
        lab: string | null;
        problemAddressed: string | null;
        companyId: string;
    })[]>;
    findByCategory(companyId: string, categoryId: number): Promise<({
        presentations: {
            description: string | null;
            id: number;
            createdAt: Date;
            updatedAt: Date;
            price: number | null;
            productId: string;
            size: import("@prisma/client/runtime/library").Decimal;
            unit: import(".prisma/client").$Enums.Unit;
        }[];
    } & {
        description: string;
        categoryId: number;
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        benefits: string[];
        isFeatured: boolean | null;
        activeIngredients: string[];
        features: string[];
        imageGallery: string[];
        imageMain: string | null;
        isBestSeller: boolean | null;
        isOnSale: boolean | null;
        lab: string | null;
        problemAddressed: string | null;
        companyId: string;
    })[]>;
    findFeaturedByCompany(companyId: string): Promise<({
        presentations: {
            description: string | null;
            id: number;
            createdAt: Date;
            updatedAt: Date;
            price: number | null;
            productId: string;
            size: import("@prisma/client/runtime/library").Decimal;
            unit: import(".prisma/client").$Enums.Unit;
        }[];
    } & {
        description: string;
        categoryId: number;
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        benefits: string[];
        isFeatured: boolean | null;
        activeIngredients: string[];
        features: string[];
        imageGallery: string[];
        imageMain: string | null;
        isBestSeller: boolean | null;
        isOnSale: boolean | null;
        lab: string | null;
        problemAddressed: string | null;
        companyId: string;
    })[]>;
    findById(id: string): Promise<{
        presentations: {
            description: string | null;
            id: number;
            createdAt: Date;
            updatedAt: Date;
            price: number | null;
            productId: string;
            size: import("@prisma/client/runtime/library").Decimal;
            unit: import(".prisma/client").$Enums.Unit;
        }[];
    } & {
        description: string;
        categoryId: number;
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        benefits: string[];
        isFeatured: boolean | null;
        activeIngredients: string[];
        features: string[];
        imageGallery: string[];
        imageMain: string | null;
        isBestSeller: boolean | null;
        isOnSale: boolean | null;
        lab: string | null;
        problemAddressed: string | null;
        companyId: string;
    }>;
    update(id: string, updateProductDto: UpdateProductDto): Promise<{
        presentations: {
            description: string | null;
            id: number;
            createdAt: Date;
            updatedAt: Date;
            price: number | null;
            productId: string;
            size: import("@prisma/client/runtime/library").Decimal;
            unit: import(".prisma/client").$Enums.Unit;
        }[];
    } & {
        description: string;
        categoryId: number;
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        benefits: string[];
        isFeatured: boolean | null;
        activeIngredients: string[];
        features: string[];
        imageGallery: string[];
        imageMain: string | null;
        isBestSeller: boolean | null;
        isOnSale: boolean | null;
        lab: string | null;
        problemAddressed: string | null;
        companyId: string;
    }>;
    remove(id: string): Promise<{
        message: string;
    }>;
}
