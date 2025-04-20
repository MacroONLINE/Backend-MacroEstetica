import { ApiProperty } from '@nestjs/swagger'

export class CourseCardDto {
  @ApiProperty() courseId!: string
  @ApiProperty() title!: string
  @ApiProperty() bannerUrl!: string
  @ApiProperty() categoryName!: string
  @ApiProperty() categoryColor!: string
  @ApiProperty() enrollmentDate!: Date
  @ApiProperty() instructorName!: string
  @ApiProperty() totalModules!: number
  @ApiProperty() modulesCompleted!: number
  @ApiProperty() progressPercentage!: number
  @ApiProperty() currentModuleTitle!: string
}

