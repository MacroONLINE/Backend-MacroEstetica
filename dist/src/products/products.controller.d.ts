import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
export declare class ProductController {
    private readonly productService;
    constructor(productService: ProductService);
    create(createProductDto: CreateProductDto): Promise<any>;
    findAll(): Promise<any>;
    findById(id: number): Promise<any>;
    findByCategory(categoryId: number): Promise<any>;
    findByCompany(companyId: string): Promise<any>;
    findFeatured(): Promise<any>;
    update(id: number, updateProductDto: UpdateProductDto): Promise<any>;
    remove(id: number): Promise<any>;
}
