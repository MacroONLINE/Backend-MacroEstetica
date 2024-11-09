import { IsOptional, IsString } from 'class-validator';

export class UpdateMedicoDto {
  @IsOptional()
  @IsString()
  verificacion?: string;
}
