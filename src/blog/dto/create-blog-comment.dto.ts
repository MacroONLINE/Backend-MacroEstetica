import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsUUID } from 'class-validator';

export class CreateBlogCommentDto {
  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000', description: 'ID del post' })
  @IsUUID()
  postId: string;

  @ApiProperty({ example: '234e4567-e89b-12d3-a456-426614174000', description: 'ID del usuario' })
  @IsUUID()
  userId: string;

  @ApiProperty({ example: 'Excelente artículo, muy informativo.', description: 'Contenido del comentario' })
  @IsString()
  content: string;
}
