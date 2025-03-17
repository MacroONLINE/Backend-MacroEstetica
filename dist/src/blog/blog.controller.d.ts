import { BlogService } from './blog.service';
export declare class BlogController {
    private readonly blogService;
    constructor(blogService: BlogService);
    getAllBlogs(): Promise<any[]>;
    getBlogById(id: string): Promise<any>;
    getBlogsByEmpresa(empresaId: string): Promise<any[]>;
    getBlogsByAuthor(authorId: string): Promise<any[]>;
    getBlogsByCategory(categoryId: string): Promise<any[]>;
    getTopRatedBlogs(): Promise<any[]>;
    getRecentBlogs(): Promise<any[]>;
    searchBlogs(query: string): Promise<any[]>;
    getAllCategories(): Promise<{
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        colorHex: string;
        iconUrl: string | null;
    }[]>;
    incrementReaderCount(id: string): Promise<{
        totalReaders: number;
    }>;
    updateUsefulness(id: string, useful: boolean): Promise<{
        usefulCount: number;
        notUsefulCount: number;
    }>;
}
