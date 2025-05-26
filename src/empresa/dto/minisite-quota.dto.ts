import { ApiProperty } from '@nestjs/swagger';
import { FeatureCode } from '@prisma/client';

export class UsageResponseDto {
  @ApiProperty({ enum: FeatureCode, example: FeatureCode.PRODUCTS_TOTAL })
  code: FeatureCode;

  @ApiProperty({
    nullable: true,
    example: 12,
    description: 'Límite asignado por el plan; `null` = ilimitado',
  })
  limit: number | null;

  @ApiProperty({ example: 4, description: 'Cantidad consumida' })
  used: number;

  @ApiProperty({
    type: 'array',
    description: 'Lista de objetos que consumen el cupo',
    items: { type: 'object' },
  })
  items: any[];
}
