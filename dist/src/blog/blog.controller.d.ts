import { BlogService } from './blog.service';
export declare class BlogController {
    private readonly blogService;
    constructor(blogService: BlogService);
    getAllBlogs(): Promise<({
        empresa: {
            name: string;
        };
        categories: {
            name: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            colorHex: string;
        }[];
        author: {
            user: {
                firstName: string;
                lastName: string;
                profileImageUrl: string;
            };
        } & {
            id: string;
            userId: string;
            description: string;
            experienceYears: number;
            certificationsUrl: string | null;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        content: string;
        bannerImage: string | null;
        title: string;
        empresaId: string;
        averageRating: number;
        authorId: string;
        totalRatings: number;
    })[]>;
    getBlogById(id: string): Promise<{
        empresa: {
            name: string;
        };
        comments: ({
            user: {
                firstName: string;
                lastName: string;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            content: string;
            userId: string;
            postId: string;
        })[];
        categories: {
            name: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            colorHex: string;
        }[];
        author: {
            user: {
                firstName: string;
                lastName: string;
                profileImageUrl: string;
            };
        } & {
            id: string;
            userId: string;
            description: string;
            experienceYears: number;
            certificationsUrl: string | null;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        content: string;
        bannerImage: string | null;
        title: string;
        empresaId: string;
        averageRating: number;
        authorId: string;
        totalRatings: number;
    }>;
    getBlogsByEmpresa(empresaId: string): Promise<({
        categories: {
            name: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            colorHex: string;
        }[];
        author: {
            user: {
                firstName: string;
                lastName: string;
                profileImageUrl: string;
            };
        } & {
            id: string;
            userId: string;
            description: string;
            experienceYears: number;
            certificationsUrl: string | null;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        content: string;
        bannerImage: string | null;
        title: string;
        empresaId: string;
        averageRating: number;
        authorId: string;
        totalRatings: number;
    })[]>;
    getBlogsByAuthor(authorId: string): Promise<({
        empresa: {
            name: string;
        };
        categories: {
            name: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            colorHex: string;
        }[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        content: string;
        bannerImage: string | null;
        title: string;
        empresaId: string;
        averageRating: number;
        authorId: string;
        totalRatings: number;
    })[]>;
    getBlogsByCategory(categoryId: string): Promise<({
        empresa: {
            name: string;
        };
        author: {
            user: {
                firstName: string;
                lastName: string;
                profileImageUrl: string;
            };
        } & {
            id: string;
            userId: string;
            description: string;
            experienceYears: number;
            certificationsUrl: string | null;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        content: string;
        bannerImage: string | null;
        title: string;
        empresaId: string;
        averageRating: number;
        authorId: string;
        totalRatings: number;
    })[]>;
    getTopRatedBlogs(): Promise<({
        empresa: {
            name: string;
        };
        author: {
            user: {
                firstName: string;
                lastName: string;
                profileImageUrl: string;
            };
        } & {
            id: string;
            userId: string;
            description: string;
            experienceYears: number;
            certificationsUrl: string | null;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        content: string;
        bannerImage: string | null;
        title: string;
        empresaId: string;
        averageRating: number;
        authorId: string;
        totalRatings: number;
    })[]>;
    getRecentBlogs(): Promise<({
        empresa: {
            name: string;
        };
        author: {
            user: {
                firstName: string;
                lastName: string;
                profileImageUrl: string;
            };
        } & {
            id: string;
            userId: string;
            description: string;
            experienceYears: number;
            certificationsUrl: string | null;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        content: string;
        bannerImage: string | null;
        title: string;
        empresaId: string;
        averageRating: number;
        authorId: string;
        totalRatings: number;
    })[]>;
    searchBlogs(query: string): Promise<({
        empresa: {
            name: string;
        };
        author: {
            user: {
                firstName: string;
                lastName: string;
                profileImageUrl: string;
            };
        } & {
            id: string;
            userId: string;
            description: string;
            experienceYears: number;
            certificationsUrl: string | null;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        content: string;
        bannerImage: string | null;
        title: string;
        empresaId: string;
        averageRating: number;
        authorId: string;
        totalRatings: number;
    })[]>;
}
