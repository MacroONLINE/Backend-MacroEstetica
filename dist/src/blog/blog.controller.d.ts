import { BlogService } from './blog.service';
declare class VoteCommentDto {
    userId: string;
    useful: boolean;
    commentContent: string;
}
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
    voteAndComment(id: string, voteCommentDto: VoteCommentDto): Promise<{
        message: string;
    }>;
    getAllCategories(): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        iconUrl: string | null;
        colorHex: string;
    }[]>;
    incrementReaderCount(id: string): Promise<{
        totalReaders: number;
    }>;
}
export {};
