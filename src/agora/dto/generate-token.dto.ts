// dto/generate-token.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class GenerateTokenDto {
  @ApiProperty({ example: 'stream-001' })
  @IsString()
  @IsNotEmpty()
  channelName: string;

  @ApiProperty({ example: 'user-12345' })
  @IsString()
  @IsNotEmpty()
  uid: string;
}
