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
    getBlogById(id: string): Promise<any>;
}
export {};
