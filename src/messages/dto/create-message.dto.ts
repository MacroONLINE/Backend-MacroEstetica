import { IsString, IsEmail, IsNotEmpty, IsUUID, IsOptional, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateMessageDto {
  @ApiProperty({ description: 'Nombre del usuario que envía el mensaje' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: 'Número de celular del usuario que envía el mensaje' })
  @IsString()
  @IsNotEmpty()
  phone: string;

  @ApiProperty({ description: 'Correo electrónico del usuario que envía el mensaje' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ description: 'Descripción del mensaje' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ description: 'ID del usuario que envía el mensaje' })
  @IsUUID()
  @IsOptional()
  userId?: string;

  @ApiProperty({ description: 'ID de la empresa destinataria del mensaje' })
  @IsUUID()
  @IsOptional()
  empresaId?: string;

  @ApiProperty({ description: 'ID del producto relacionado', required: false })
  @IsUUID()
  @IsOptional()
  productId?: string;

  @ApiProperty({ description: 'Tipo de mensaje (direct, product)' })
  @IsEnum(['direct', 'product'])
  @IsNotEmpty()
  type: 'direct' | 'product';
}
