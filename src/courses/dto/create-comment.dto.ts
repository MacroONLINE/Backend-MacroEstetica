// src/courses/dto/create-comment.dto.ts
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateCommentDto {
  @ApiProperty()
  userId: string;

  @ApiProperty()
  classId: string;

  @ApiProperty()
  content: string;

  // Campo opcional para indicar si es una "reply"
  @ApiPropertyOptional()
  parentCommentId?: string;
}