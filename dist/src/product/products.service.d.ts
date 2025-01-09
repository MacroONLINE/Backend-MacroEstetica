import { PrismaService } from '../prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
export declare class ProductService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(createProductDto: CreateProductDto): Promise<{
        presentations: {
            id: number;
            createdAt: Date;
            updatedAt: Date;
            description: string | null;
            price: number | null;
            productId: string;
            size: import("@prisma/client/runtime/library").Decimal;
            unit: import(".prisma/client").$Enums.Unit;
        }[];
    } & {
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string;
        companyId: string;
        isFeatured: boolean | null;
        categoryId: number;
        lab: string | null;
        activeIngredients: string[];
        features: string[];
        benefits: string[];
        problemAddressed: string | null;
        imageMain: string | null;
        imageGallery: string[];
        isBestSeller: boolean | null;
        isOnSale: boolean | null;
    }>;
    findAll(): Promise<({
        presentations: {
            id: number;
            createdAt: Date;
            updatedAt: Date;
            description: string | null;
            price: number | null;
            productId: string;
            size: import("@prisma/client/runtime/library").Decimal;
            unit: import(".prisma/client").$Enums.Unit;
        }[];
    } & {
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string;
        companyId: string;
        isFeatured: boolean | null;
        categoryId: number;
        lab: string | null;
        activeIngredients: string[];
        features: string[];
        benefits: string[];
        problemAddressed: string | null;
        imageMain: string | null;
        imageGallery: string[];
        isBestSeller: boolean | null;
        isOnSale: boolean | null;
    })[]>;
    findById(id: string): Promise<{
        presentations: {
            id: number;
            createdAt: Date;
            updatedAt: Date;
            description: string | null;
            price: number | null;
            productId: string;
            size: import("@prisma/client/runtime/library").Decimal;
            unit: import(".prisma/client").$Enums.Unit;
        }[];
    } & {
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string;
        companyId: string;
        isFeatured: boolean | null;
        categoryId: number;
        lab: string | null;
        activeIngredients: string[];
        features: string[];
        benefits: string[];
        problemAddressed: string | null;
        imageMain: string | null;
        imageGallery: string[];
        isBestSeller: boolean | null;
        isOnSale: boolean | null;
    }>;
    findByCategory(categoryId: number): Promise<({
        presentations: {
            id: number;
            createdAt: Date;
            updatedAt: Date;
            description: string | null;
            price: number | null;
            productId: string;
            size: import("@prisma/client/runtime/library").Decimal;
            unit: import(".prisma/client").$Enums.Unit;
        }[];
    } & {
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string;
        companyId: string;
        isFeatured: boolean | null;
        categoryId: number;
        lab: string | null;
        activeIngredients: string[];
        features: string[];
        benefits: string[];
        problemAddressed: string | null;
        imageMain: string | null;
        imageGallery: string[];
        isBestSeller: boolean | null;
        isOnSale: boolean | null;
    })[]>;
    findByCompany(companyId: string): Promise<({
        presentations: {
            id: number;
            createdAt: Date;
            updatedAt: Date;
            description: string | null;
            price: number | null;
            productId: string;
            size: import("@prisma/client/runtime/library").Decimal;
            unit: import(".prisma/client").$Enums.Unit;
        }[];
    } & {
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string;
        companyId: string;
        isFeatured: boolean | null;
        categoryId: number;
        lab: string | null;
        activeIngredients: string[];
        features: string[];
        benefits: string[];
        problemAddressed: string | null;
        imageMain: string | null;
        imageGallery: string[];
        isBestSeller: boolean | null;
        isOnSale: boolean | null;
    })[]>;
    findFeaturedByCompany(companyId: string): Promise<({
        presentations: {
            id: number;
            createdAt: Date;
            updatedAt: Date;
            description: string | null;
            price: number | null;
            productId: string;
            size: import("@prisma/client/runtime/library").Decimal;
            unit: import(".prisma/client").$Enums.Unit;
        }[];
    } & {
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string;
        companyId: string;
        isFeatured: boolean | null;
        categoryId: number;
        lab: string | null;
        activeIngredients: string[];
        features: string[];
        benefits: string[];
        problemAddressed: string | null;
        imageMain: string | null;
        imageGallery: string[];
        isBestSeller: boolean | null;
        isOnSale: boolean | null;
    })[]>;
    update(id: string, updateProductDto: UpdateProductDto): Promise<{
        presentations: {
            id: number;
            createdAt: Date;
            updatedAt: Date;
            description: string | null;
            price: number | null;
            productId: string;
            size: import("@prisma/client/runtime/library").Decimal;
            unit: import(".prisma/client").$Enums.Unit;
        }[];
    } & {
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string;
        companyId: string;
        isFeatured: boolean | null;
        categoryId: number;
        lab: string | null;
        activeIngredients: string[];
        features: string[];
        benefits: string[];
        problemAddressed: string | null;
        imageMain: string | null;
        imageGallery: string[];
        isBestSeller: boolean | null;
        isOnSale: boolean | null;
    }>;
    remove(id: string): Promise<{
        presentations: {
            id: number;
            createdAt: Date;
            updatedAt: Date;
            description: string | null;
            price: number | null;
            productId: string;
            size: import("@prisma/client/runtime/library").Decimal;
            unit: import(".prisma/client").$Enums.Unit;
        }[];
    } & {
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string;
        companyId: string;
        isFeatured: boolean | null;
        categoryId: number;
        lab: string | null;
        activeIngredients: string[];
        features: string[];
        benefits: string[];
        problemAddressed: string | null;
        imageMain: string | null;
        imageGallery: string[];
        isBestSeller: boolean | null;
        isOnSale: boolean | null;
    }>;
}
