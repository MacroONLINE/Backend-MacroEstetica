import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class CreateBannerDto {
  @ApiProperty({ description: 'URL del banner' })
  @IsString()
  banner: string;

  @ApiProperty({ description: 'Título del banner' })
  @IsString()
  title: string;

  @ApiProperty({ description: 'Descripción del banner' })
  @IsString()
  description: string;

  @ApiProperty({ description: 'Fecha del banner (opcional)', required: false })
  @IsOptional()
  date?: Date;  // validación Date no está en class-validator, se maneja como un tipo nativo

  @ApiProperty({ description: 'URL de CTA (opcional)', required: false })
  @IsOptional()
  @IsString()
  cta_url?: string;

  @ApiProperty({ description: 'Texto del botón de CTA (opcional)', required: false, default: '¡Clic aquí!' })
  @IsOptional()
  @IsString()
  cta_button_text?: string;

  @ApiProperty({ description: 'Logo del banner' })
  @IsString()
  logo: string;

  @ApiProperty({ description: 'ID de la empresa asociada (opcional)', required: false })
  @IsOptional()
  @IsString()
  empresaId?: string;
}
