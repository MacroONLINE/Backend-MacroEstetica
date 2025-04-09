import { PrismaService } from 'src/prisma/prisma.service';
export declare class BlogService {
    private readonly prisma;
    private currentDto;
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
        comment: {
            id: string;
            content: string;
            createdAt: Date;
            updatedAt: Date;
            userId: string;
            postId: string;
        };
        rating: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            userId: string;
            postId: string;
            rating: number;
        };
    }>;
    getAllCategories(): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        colorHex: string;
        iconUrl: string | null;
    }[]>;
    incrementReaderCount(postId: string): Promise<{
        totalReaders: number;
    }>;
    getUsersCommentRatingForPost(postId: string): Promise<{
        userId: string;
        commentContent: string;
        rating: number;
        firstName: string;
        lastName: string;
        profileImageUrl: string;
    }[]>;
    setCurrentDto(dto: any): void;
    private formatBlogDates;
}
