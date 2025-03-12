import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsUUID, Min, Max } from 'class-validator';

export class CreateBlogRatingDto {
  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000', description: 'ID del post' })
  @IsUUID()
  postId: string;

  @ApiProperty({ example: '234e4567-e89b-12d3-a456-426614174000', description: 'ID del usuario' })
  @IsUUID()
  userId: string;

  @ApiProperty({ example: 5, description: 'Número de estrellas (1-5)' })
  @IsInt()
  @Min(1)
  @Max(5)
  rating: number;
}
