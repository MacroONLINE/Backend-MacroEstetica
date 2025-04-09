import { BlogService } from './blog.service';
declare class VoteCommentDto {
    userId: string;
    useful: boolean;
    commentContent: string;
    rating: number;
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
    incrementReaderCount(id: string): Promise<{
        totalReaders: number;
    }>;
    getBlogById(id: string): Promise<any>;
    getUsersCommentRatingForPost(id: string): Promise<{
        userId: string;
        commentContent: string;
        rating: number;
        firstName: string;
        lastName: string;
        profileImageUrl: string;
    }[]>;
}
export {};
