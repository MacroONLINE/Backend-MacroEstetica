import { ProductService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
export declare class ProductController {
    private readonly productService;
    constructor(productService: ProductService);
    create(createProductDto: CreateProductDto): Promise<{
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string;
        categoryId: number;
        isFeatured: boolean | null;
        companyId: string;
        activeIngredients: string[];
        benefits: string[];
        features: string[];
        imageGallery: string[];
        imageMain: string | null;
        isBestSeller: boolean | null;
        isOnSale: boolean | null;
        lab: string | null;
        problemAddressed: string | null;
    }>;
    findAll(companyId: string): Promise<({
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
        categoryId: number;
        isFeatured: boolean | null;
        companyId: string;
        activeIngredients: string[];
        benefits: string[];
        features: string[];
        imageGallery: string[];
        imageMain: string | null;
        isBestSeller: boolean | null;
        isOnSale: boolean | null;
        lab: string | null;
        problemAddressed: string | null;
    })[]>;
    findByCategory(companyId: string, categoryId: string): Promise<({
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
        categoryId: number;
        isFeatured: boolean | null;
        companyId: string;
        activeIngredients: string[];
        benefits: string[];
        features: string[];
        imageGallery: string[];
        imageMain: string | null;
        isBestSeller: boolean | null;
        isOnSale: boolean | null;
        lab: string | null;
        problemAddressed: string | null;
    })[]>;
    findFeatured(companyId: string): Promise<({
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
        categoryId: number;
        isFeatured: boolean | null;
        companyId: string;
        activeIngredients: string[];
        benefits: string[];
        features: string[];
        imageGallery: string[];
        imageMain: string | null;
        isBestSeller: boolean | null;
        isOnSale: boolean | null;
        lab: string | null;
        problemAddressed: string | null;
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
        categoryId: number;
        isFeatured: boolean | null;
        companyId: string;
        activeIngredients: string[];
        benefits: string[];
        features: string[];
        imageGallery: string[];
        imageMain: string | null;
        isBestSeller: boolean | null;
        isOnSale: boolean | null;
        lab: string | null;
        problemAddressed: string | null;
    }>;
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
        categoryId: number;
        isFeatured: boolean | null;
        companyId: string;
        activeIngredients: string[];
        benefits: string[];
        features: string[];
        imageGallery: string[];
        imageMain: string | null;
        isBestSeller: boolean | null;
        isOnSale: boolean | null;
        lab: string | null;
        problemAddressed: string | null;
    }>;
    remove(id: string): Promise<{
        message: string;
    }>;
}
