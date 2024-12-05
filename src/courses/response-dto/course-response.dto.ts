import { ApiProperty } from '@nestjs/swagger';

export class CourseResponseDto {
  // Campos del curso
  @ApiProperty({ description: 'ID of the course' })
  id: string;

  @ApiProperty({ description: 'Title of the course' })
  title: string;

  @ApiProperty({ description: 'Description of the course' })
  description: string;

  @ApiProperty({ description: 'Price of the course' })
  price: number;

  @ApiProperty({ description: 'Discount percentage of the course' })
  discountPercentage?: number;

  @ApiProperty({ description: 'Level of the course' })
  level: string;

  @ApiProperty({ description: 'Target audience of the course' })
  target: string;

  @ApiProperty({ description: 'Number of participants in the course' })
  participantsCount: number;

  @ApiProperty({ description: 'Rating of the course' })
  rating: number;

  @ApiProperty({ description: 'Whether the course is featured' })
  isFeatured: boolean;

  @ApiProperty({ description: 'Banner URL of the course' })
  bannerUrl: string;

  @ApiProperty({ description: 'Square image URL of the course' })
  courseImageUrl: string;

  // Campos relacionados de categoría
  @ApiProperty({ description: 'Name of the category' })
  categoryName: string;

  @ApiProperty({ description: 'Color of the category' })
  categoryColor: string;

  @ApiProperty({ description: 'Icon URL of the category' })
  categoryIcon: string;

  // Campos relacionados del instructor
  @ApiProperty({ description: 'Name of the instructor' })
  instructorName: string;

  @ApiProperty({ description: 'Experience years of the instructor' })
  instructorExperience: number;

  @ApiProperty({ description: 'Certifications URL of the instructor' })
  instructorCertificationsUrl: string;

  @ApiProperty({ description: 'Status of the instructor' })
  instructorStatus: string;
}
