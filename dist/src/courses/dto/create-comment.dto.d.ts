import { CommentType } from '../enums/comment-type.enum';
export declare class CreateCommentDto {
    userId: string;
    classId: string;
    type: CommentType;
    rating: number;
    content: string;
}
