import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class GenerateTokenDto {
  @ApiProperty({ example: 'd03b3e6b-9f74-4d49-8e3b-9e6c6b3e5f4c', description: 'UUID del channel' })
  @IsString()
  uuid: string;

  @ApiProperty({ example: 'user-12345', description: 'ID del usuario solicitante' })
  @IsString()
  uid: string;
}
