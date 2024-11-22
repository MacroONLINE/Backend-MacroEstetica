import { IsOptional, IsString, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

// Define the enum explicitly for Swagger
export enum TargetEnum {
  MEDICO = 'MEDICO',
  ESTETICISTA = 'ESTETICISTA',
}

export class UpdateEmpresaDto {
  @ApiProperty()
  @IsString()
  @IsOptional()
  dni!: string;

  @ApiProperty()
  @IsString()
  name!: string;

  @ApiProperty({ enum: TargetEnum, description: 'Target must be either MEDICO or ESTETICISTA' })
  @IsEnum(TargetEnum, { message: 'Target must be either MEDICO or ESTETICISTA' })
  target!: TargetEnum;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  categoryId?: string;

  @ApiProperty({ description: 'ID of the associated user' })
  @IsString()
  userId!: string;
}
