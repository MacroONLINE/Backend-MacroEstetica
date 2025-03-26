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
    voteAndComment(postId: string, userId: string, useful: boolean, commentContent: string): Promise<{
        message: string;
    }>;
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
    private formatBlogDates;
}
