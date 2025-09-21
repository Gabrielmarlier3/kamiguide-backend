import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class GenerateTokenDto {
  @ApiProperty({
    example: 'gabrielmarliere2005@gmail.com',
    description: "The user's email address",
  })
  @IsNotEmpty()
  @IsEmail()
  email!: string;
}
