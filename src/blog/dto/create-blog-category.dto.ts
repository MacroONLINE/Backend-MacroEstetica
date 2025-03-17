import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsUrl } from 'class-validator';

export class CreateBlogCategoryDto {
  @ApiProperty({ example: 'Dermatología', description: 'Nombre de la categoría' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'https://example.com/icon.png', description: 'URL del icono de la categoría' })
  @IsUrl()
  iconUrl: string;

  @ApiProperty({ example: '#FF5733', description: 'Color en formato hexadecimal' })
  @IsString()
  @IsNotEmpty()
  colorHex: string;
  
}
