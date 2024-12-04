import { IsString, IsEnum, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { CommentType } from '../enums/comment-type.enum';

export class CreateCommentDto {
  @ApiProperty({ description: 'User ID who created the comment' })
  @IsString()
  userId: string;

  @ApiProperty({ description: 'Class ID the comment belongs to' })
  @IsString()
  classId: string;

  @ApiProperty({ description: 'Type of the comment', enum: CommentType })
  @IsEnum(CommentType)
  type: CommentType;

  @ApiProperty({ description: 'Rating of the comment' })
  @IsNumber()
  rating: number;

  @ApiProperty({ description: 'Content of the comment' })
  @IsString()
  content: string;
}
