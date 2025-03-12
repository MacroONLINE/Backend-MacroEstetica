import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsArray, IsUUID } from 'class-validator';

export class CreateBlogPostDto {
  @ApiProperty({ example: 'La importancia de la Dermatología', description: 'Título del post del blog' })
  @IsString()
  title: string;

  @ApiProperty({
    example: '<h1>Beneficios de la dermatología...</h1>',
    description: 'Contenido del blog con formato HTML o Markdown',
  })
  @IsString()
  content: string;

  @ApiProperty({ example: 'https://miweb.com/banner.jpg', description: 'URL de la imagen destacada', required: false })
  @IsOptional()
  @IsString()
  bannerImage?: string;

  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000', description: 'ID de la empresa' })
  @IsUUID('4')
  empresaId: string;

  @ApiProperty({ example: '234e4567-e89b-12d3-a456-426614174000', description: 'ID del autor' })
  @IsUUID('4')
  authorId: string;

  @ApiProperty({ example: ['345e4567-e89b-12d3-a456-426614174000'], description: 'Lista de IDs de categorías' })
  @IsArray()
  @IsUUID('4', { each: true })
  categories: string[];
}
