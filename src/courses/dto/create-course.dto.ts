import { IsString, IsNumber, IsBoolean, IsOptional, IsJSON, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Target } from '../enums/target.enum';

export class CreateCourseDto {
  @ApiProperty({ description: 'Title of the course' })
  @IsString()
  title: string;

  @ApiProperty({ description: 'Banner URL of the course' })
  @IsString()
  bannerUrl: string;

  @ApiProperty({ description: 'Description of the course' })
  @IsString()
  description: string;

  @ApiProperty({ description: 'Category ID to associate the course' })
  @IsString()
  categoryId: string;

  @ApiProperty({ description: 'Level of the course' })
  @IsString()
  level: string;

  @ApiProperty({ description: 'Price of the course' })
  @IsNumber()
  price: number;

  @ApiProperty({ description: 'Discount percentage of the course', required: false })
  @IsNumber()
  @IsOptional()
  discountPercentage?: number;

  @ApiProperty({ description: 'Target audience of the course', enum: Target, required: false })
  @IsEnum(Target)
  @IsOptional()
  target?: Target;

  @ApiProperty({ description: 'Instructor ID to associate with the course', required: false })
  @IsString()
  @IsOptional()
  instructorId?: string;

  @ApiProperty({ description: 'JSON for "What you will learn"', required: false })
  @IsJSON()
  @IsOptional()
  whatYouWillLearn?: string;

  @ApiProperty({ description: 'Whether the course is featured', required: false })
  @IsBoolean()
  @IsOptional()
  isFeatured?: boolean; // Campo opcional para indicar si el curso es destacado
}
