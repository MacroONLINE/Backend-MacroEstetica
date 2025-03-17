import { PrismaService } from 'src/prisma/prisma.service';
export declare class BlogService {
    private readonly prisma;
    constructor(prisma: PrismaService);
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
    incrementReaderCount(postId: string): Promise<{
        totalReaders: number;
    }>;
    updateUsefulness(postId: string, useful: boolean): Promise<{
        usefulCount: number;
        notUsefulCount: number;
    }>;
    private formatBlogDates;
}
