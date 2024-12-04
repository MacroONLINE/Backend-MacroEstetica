import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCategoryDto {
  @ApiProperty({ description: 'Name of the category' })
  @IsString()
  name: string;

  @ApiProperty({ description: 'URL of the category icon' })
  @IsString()
  urlIcon: string;

  @ApiProperty({ description: 'Color hex code of the category' })
  @IsString()
  colorHex: string;
}
