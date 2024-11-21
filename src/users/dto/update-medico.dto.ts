import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UpdateMedicoDto {
  @ApiPropertyOptional({ description: 'Verification file (will be stored as a URL)' })
  @IsOptional()
  @IsString()
  verification?: string;

  @ApiProperty({ description: 'ID of the associated user' })
  @IsString()
  userId!: string;
}
