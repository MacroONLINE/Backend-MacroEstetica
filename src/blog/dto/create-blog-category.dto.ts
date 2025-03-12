import { ApiProperty } from '@nestjs/swagger';
import { IsString, Length, Matches } from 'class-validator';

export class CreateBlogCategoryDto {
  @ApiProperty({ example: 'Medicina Estética', description: 'Nombre de la categoría de blog' })
  @IsString()
  @Length(3, 50)
  name: string;

  @ApiProperty({ example: '#FF5733', description: 'Código de color en formato HEX' })
  @IsString()
  @Matches(/^#([0-9A-F]{3}){1,2}$/i, { message: "El color debe ser un código HEX válido" })
  colorHex: string;
}
