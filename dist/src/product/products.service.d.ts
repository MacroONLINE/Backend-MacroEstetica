import { PrismaService } from '../prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
export declare class ProductService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(createProductDto: CreateProductDto): Promise<{
        presentations: {
            id: number;
            description: string | null;
            createdAt: Date;
            updatedAt: Date;
            productId: string;
            size: import("@prisma/client/runtime/library").Decimal;
            unit: import(".prisma/client").$Enums.Unit;
            price: number | null;
        }[];
    } & {
        id: string;
        name: string;
        description: string;
        lab: string | null;
        activeIngredients: string[];
        features: string[];
        benefits: string[];
        problemAddressed: string | null;
        imageMain: string | null;
        imageGallery: string[];
        isFeatured: boolean | null;
        isBestSeller: boolean | null;
        isOnSale: boolean | null;
        companyId: string;
        categoryId: number;
        createdAt: Date;
        updatedAt: Date;
    }>;
    findAll(): Promise<({
        presentations: {
            id: number;
            description: string | null;
            createdAt: Date;
            updatedAt: Date;
            productId: string;
            size: import("@prisma/client/runtime/library").Decimal;
            unit: import(".prisma/client").$Enums.Unit;
            price: number | null;
        }[];
    } & {
        id: string;
        name: string;
        description: string;
        lab: string | null;
        activeIngredients: string[];
        features: string[];
        benefits: string[];
        problemAddressed: string | null;
        imageMain: string | null;
        imageGallery: string[];
        isFeatured: boolean | null;
        isBestSeller: boolean | null;
        isOnSale: boolean | null;
        companyId: string;
        categoryId: number;
        createdAt: Date;
        updatedAt: Date;
    })[]>;
    findById(id: string): Promise<{
        presentations: {
            id: number;
            description: string | null;
            createdAt: Date;
            updatedAt: Date;
            productId: string;
            size: import("@prisma/client/runtime/library").Decimal;
            unit: import(".prisma/client").$Enums.Unit;
            price: number | null;
        }[];
    } & {
        id: string;
        name: string;
        description: string;
        lab: string | null;
        activeIngredients: string[];
        features: string[];
        benefits: string[];
        problemAddressed: string | null;
        imageMain: string | null;
        imageGallery: string[];
        isFeatured: boolean | null;
        isBestSeller: boolean | null;
        isOnSale: boolean | null;
        companyId: string;
        categoryId: number;
        createdAt: Date;
        updatedAt: Date;
    }>;
    findByCategory(categoryId: number): Promise<({
        presentations: {
            id: number;
            description: string | null;
            createdAt: Date;
            updatedAt: Date;
            productId: string;
            size: import("@prisma/client/runtime/library").Decimal;
            unit: import(".prisma/client").$Enums.Unit;
            price: number | null;
        }[];
    } & {
        id: string;
        name: string;
        description: string;
        lab: string | null;
        activeIngredients: string[];
        features: string[];
        benefits: string[];
        problemAddressed: string | null;
        imageMain: string | null;
        imageGallery: string[];
        isFeatured: boolean | null;
        isBestSeller: boolean | null;
        isOnSale: boolean | null;
        companyId: string;
        categoryId: number;
        createdAt: Date;
        updatedAt: Date;
    })[]>;
    findByCompany(companyId: string): Promise<({
        presentations: {
            id: number;
            description: string | null;
            createdAt: Date;
            updatedAt: Date;
            productId: string;
            size: import("@prisma/client/runtime/library").Decimal;
            unit: import(".prisma/client").$Enums.Unit;
            price: number | null;
        }[];
    } & {
        id: string;
        name: string;
        description: string;
        lab: string | null;
        activeIngredients: string[];
        features: string[];
        benefits: string[];
        problemAddressed: string | null;
        imageMain: string | null;
        imageGallery: string[];
        isFeatured: boolean | null;
        isBestSeller: boolean | null;
        isOnSale: boolean | null;
        companyId: string;
        categoryId: number;
        createdAt: Date;
        updatedAt: Date;
    })[]>;
    findFeaturedByCompany(companyId: string): Promise<({
        presentations: {
            id: number;
            description: string | null;
            createdAt: Date;
            updatedAt: Date;
            productId: string;
            size: import("@prisma/client/runtime/library").Decimal;
            unit: import(".prisma/client").$Enums.Unit;
            price: number | null;
        }[];
    } & {
        id: string;
        name: string;
        description: string;
        lab: string | null;
        activeIngredients: string[];
        features: string[];
        benefits: string[];
        problemAddressed: string | null;
        imageMain: string | null;
        imageGallery: string[];
        isFeatured: boolean | null;
        isBestSeller: boolean | null;
        isOnSale: boolean | null;
        companyId: string;
        categoryId: number;
        createdAt: Date;
        updatedAt: Date;
    })[]>;
    update(id: string, updateProductDto: UpdateProductDto): Promise<{
        presentations: {
            id: number;
            description: string | null;
            createdAt: Date;
            updatedAt: Date;
            productId: string;
            size: import("@prisma/client/runtime/library").Decimal;
            unit: import(".prisma/client").$Enums.Unit;
            price: number | null;
        }[];
    } & {
        id: string;
        name: string;
        description: string;
        lab: string | null;
        activeIngredients: string[];
        features: string[];
        benefits: string[];
        problemAddressed: string | null;
        imageMain: string | null;
        imageGallery: string[];
        isFeatured: boolean | null;
        isBestSeller: boolean | null;
        isOnSale: boolean | null;
        companyId: string;
        categoryId: number;
        createdAt: Date;
        updatedAt: Date;
    }>;
    remove(id: string): Promise<{
        presentations: {
            id: number;
            description: string | null;
            createdAt: Date;
            updatedAt: Date;
            productId: string;
            size: import("@prisma/client/runtime/library").Decimal;
            unit: import(".prisma/client").$Enums.Unit;
            price: number | null;
        }[];
    } & {
        id: string;
        name: string;
        description: string;
        lab: string | null;
        activeIngredients: string[];
        features: string[];
        benefits: string[];
        problemAddressed: string | null;
        imageMain: string | null;
        imageGallery: string[];
        isFeatured: boolean | null;
        isBestSeller: boolean | null;
        isOnSale: boolean | null;
        companyId: string;
        categoryId: number;
        createdAt: Date;
        updatedAt: Date;
    }>;
}
