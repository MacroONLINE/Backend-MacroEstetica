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
    remove(id: string): Promise<{
        message: string;
    }>;
}
