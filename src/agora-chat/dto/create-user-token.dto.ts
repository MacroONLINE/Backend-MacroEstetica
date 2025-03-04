import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class CreateUserTokenDto {
  @ApiProperty({ example: 'user-001', description: 'ID único del usuario en Agora Chat' })
  @IsString()
  @IsNotEmpty()
  userId: string;
}
