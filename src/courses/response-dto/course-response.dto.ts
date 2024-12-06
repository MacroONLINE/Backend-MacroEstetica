import { ApiProperty } from '@nestjs/swagger';

export class CourseResponseDto {
  // Campos del curso
  @ApiProperty({ description: 'ID of the course' })
  id: string;

  @ApiProperty({ description: 'Title of the course' })
  title: string;

  @ApiProperty({ description: 'Description of the course' })
  description: string;

  @ApiProperty({ description: 'Longer about description of the course', required: false })
  aboutDescription?: string;

  @ApiProperty({ description: 'Total hours of the course' })
  totalHours: number;

  @ApiProperty({ description: 'Price of the course' })
  price: number;

  @ApiProperty({ description: 'Discount percentage of the course', required: false })
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

  @ApiProperty({ description: 'What you will learn in the course (JSON)', required: false })
  whatYouWillLearn?: any;

  @ApiProperty({ description: 'Requirements for the course (JSON)', required: false })
  requirements?: any;

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

  // Recursos del curso
  @ApiProperty({ description: 'Number of resources in the course' })
  totalResources: number;

  @ApiProperty({ description: 'List of resources for the course' })
  resources: { id: string; url: string }[];

  // Módulos y clases
  @ApiProperty({ description: 'Total number of modules in the course' })
  totalModules: number;

  @ApiProperty({ description: 'List of modules in the course', type: () => [ModuleResponseDto] })
  modules: ModuleResponseDto[];
}

export class ModuleResponseDto {
  @ApiProperty({ description: 'ID of the module' })
  id: string;

  @ApiProperty({ description: 'Description of the module' })
  description: string;

  @ApiProperty({ description: 'List of classes in the module', type: () => [ClassResponseDto] })
  classes: ClassResponseDto[];
}

export class ClassResponseDto {
  @ApiProperty({ description: 'ID of the class' })
  id: string;

  @ApiProperty({ description: 'Description of the class' })
  description: string;
}
