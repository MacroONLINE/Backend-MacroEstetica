import { IsNotEmpty, IsString } from 'class-validator';

export class GenerateTokenDto {
  @IsString()
  @IsNotEmpty()
  channelName: string;

  @IsString()
  @IsNotEmpty()
  uid: string;
}
