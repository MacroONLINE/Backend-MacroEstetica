import { CommentType } from '@prisma/client';
export declare class CreateCommentDto {
    content: string;
    type: CommentType;
    rating?: number;
    classId: string;
    userId: string;
}
