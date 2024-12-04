import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateModuleDto {
  @ApiProperty({ description: 'Course ID the module belongs to' })
  @IsString()
  courseId: string;

  @ApiProperty({ description: 'Description of the module' })
  @IsString()
  description: string;
}
