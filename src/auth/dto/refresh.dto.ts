import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class RefreshDto {
  @ApiProperty({ description: "The user's refresh token" })
  @IsNotEmpty()
  @IsString()
  refreshToken!: string;
}