import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UpdateMedicoDto {
  @ApiPropertyOptional({ description: 'Verification information' })
  @IsOptional()
  @IsString()
  verification?: string;
}
