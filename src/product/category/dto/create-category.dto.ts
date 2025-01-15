import { IsString, IsOptional, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCategoryDto {
  @ApiProperty({
    description: 'Name of the category',
    example: 'Cosmiatría y Cosmetología',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'URL for the banner image of the category',
    example: 'https://example.com/images/banner.jpg',
  })
  @IsString()
  @IsOptional()
  bannerImageUrl?: string;

  @ApiProperty({
    description: 'URL for the minisite image of the category',
    example: 'https://example.com/images/minisite.jpg',
  })
  @IsString()
  @IsOptional()
  miniSiteImageUrl?: string;

  @ApiProperty({
    description: 'ID of the associated company',
    example: 'company-001',
  })
  @IsString()
  @IsNotEmpty()
  companyId: string;
}
