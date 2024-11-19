import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UpdateInstructorDto {
  @ApiPropertyOptional({ description: 'Bio of the instructor' })
  @IsOptional()
  @IsString()
  bio?: string;
}
