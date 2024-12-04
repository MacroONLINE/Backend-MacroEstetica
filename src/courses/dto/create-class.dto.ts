import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateClassDto {
  @ApiProperty({ description: 'Module ID the class belongs to' })
  @IsString()
  moduleId: string;

  @ApiProperty({ description: 'Description of the class' })
  @IsString()
  description: string;
}
