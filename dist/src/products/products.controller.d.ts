import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
export declare class ProductsController {
    private readonly productsService;
    constructor(productsService: ProductsService);
    createProduct(createProductDto: CreateProductDto): Promise<{
        name: string;
        id: number;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        companyId: string;
        cost: import("@prisma/client/runtime/library").Decimal;
        discount: import("@prisma/client/runtime/library").Decimal | null;
        productCode: string;
        availableQuantity: number;
        isFeatured: boolean;
    }>;
    getProductsByCompany(companyId: string): Promise<{
        name: string;
        id: number;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        companyId: string;
        cost: import("@prisma/client/runtime/library").Decimal;
        discount: import("@prisma/client/runtime/library").Decimal | null;
        productCode: string;
        availableQuantity: number;
        isFeatured: boolean;
    }[]>;
    updateProduct(productId: number, updateProductDto: UpdateProductDto): Promise<{
        name: string;
        id: number;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        companyId: string;
        cost: import("@prisma/client/runtime/library").Decimal;
        discount: import("@prisma/client/runtime/library").Decimal | null;
        productCode: string;
        availableQuantity: number;
        isFeatured: boolean;
    }>;
    deleteProduct(productId: number): Promise<{
        name: string;
        id: number;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        companyId: string;
        cost: import("@prisma/client/runtime/library").Decimal;
        discount: import("@prisma/client/runtime/library").Decimal | null;
        productCode: string;
        availableQuantity: number;
        isFeatured: boolean;
    }>;
    setProductFeatured(productId: number, isFeatured: boolean): Promise<{
        name: string;
        id: number;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        companyId: string;
        cost: import("@prisma/client/runtime/library").Decimal;
        discount: import("@prisma/client/runtime/library").Decimal | null;
        productCode: string;
        availableQuantity: number;
        isFeatured: boolean;
    }>;
    getFeaturedProducts(limit?: number): Promise<{
        name: string;
        id: number;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        companyId: string;
        cost: import("@prisma/client/runtime/library").Decimal;
        discount: import("@prisma/client/runtime/library").Decimal | null;
        productCode: string;
        availableQuantity: number;
        isFeatured: boolean;
    }[]>;
}
