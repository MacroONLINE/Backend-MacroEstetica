import { IsString, IsInt, IsEnum, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { CommentType } from '@prisma/client';

export class CreateCommentDto {
  @ApiProperty({ example: 'Muy buena clase', description: 'Contenido del comentario' })
  @IsString()
  content: string;

  @ApiProperty({ enum: CommentType, description: 'Tipo de comentario' })
  @IsEnum(CommentType)
  type: CommentType;

  @ApiProperty({ example: 5, description: 'Calificación de la clase', required: false })
  @IsOptional()
  @IsInt()
  rating?: number;

  @ApiProperty({ example: 'claseId123', description: 'ID de la clase asociada' })
  @IsString()
  classId: string;

  @ApiProperty({ example: 'userId123', description: 'ID del usuario que comenta' })
  @IsString()
  userId: string;
}
