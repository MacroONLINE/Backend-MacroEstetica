// courses/dto/courses-fetch.dto.ts
import { ApiProperty } from '@nestjs/swagger';

export class CoursesFetchDto {
  @ApiProperty({ description: 'Identificador único del curso' })
  id: string;

  @ApiProperty({ description: 'Título del curso' })
  title: string;

  @ApiProperty({ description: 'Nombre del instructor' })
  instructor: string;

  @ApiProperty({ description: 'Precio del curso' })
  price: number;

  @ApiProperty({ description: 'Número de comentarios' })
  comments: number;

  @ApiProperty({ description: 'Fecha del curso', type: String, format: 'date-time' })
  date: Date;

  @ApiProperty({ description: 'Calificación promedio' })
  rating: number;

  @ApiProperty({ description: 'URL de la imagen del curso' })
  imageUrl: string;

  @ApiProperty({ description: 'Nombre de la categoría' })
  categoryName: string;

  @ApiProperty({ description: 'Ícono de la categoría' })
  categoryIcon: string;

  @ApiProperty({ description: 'Indica si el curso es destacado' })
  featured: boolean;
}
