import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class RefreshResponseDto {
  @ApiProperty({
    description: 'New ID token for authentication',
    example: 'eyJhbGciOiJSUzI1NiIsImtpZCI6Ij...',
  })
  @IsString()
  idToken: string;

  @ApiProperty({
    description: 'Refresh token that can be reused to obtain a new ID token',
    example: 'AEu4IL3cXYZ123...',
  })
  @IsString()
  refreshToken: string;

  @ApiProperty({
    description: 'Time in seconds until the ID token expires',
    example: '3600',
  })
  @IsString()
  expiresIn: string;
}
