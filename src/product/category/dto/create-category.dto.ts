// src/product/categories/dto/create-category.dto.ts
import { IsString, IsOptional, IsNotEmpty } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class CreateCategoryDto {
  @ApiProperty({ example: 'Cosmiatría y Cosmetología' })
  @IsString()
  @IsNotEmpty()
  name: string

  @ApiProperty({ example: 'company-001' })
  @IsString()
  @IsNotEmpty()
  companyId: string

  @ApiProperty({
    type: 'string',
    format: 'binary',
    required: false,
  })
  @IsOptional()
  bannerImage?: any

  @ApiProperty({
    type: 'string',
    format: 'binary',
    required: false,
  })
  @IsOptional()
  miniSiteImage?: any
}
