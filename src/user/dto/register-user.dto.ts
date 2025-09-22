import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';

export class RegisterUserDto {
  @ApiProperty({ example: 'Gabriel', description: "The user's first name" })
  @IsNotEmpty()
  @IsString()
  firstName!: string;

  @ApiProperty({
    example: '12345',
    description:
      'Five-digit verification code sent to the user’s email for create account',
  })
  @IsNotEmpty()
  @IsString()
  token!: string;

  @ApiProperty({
    example: 'gabrielmarliere2005@gmail.com',
    description: "The user's email address",
  })
  @IsNotEmpty()
  @IsEmail()
  email!: string;

  @ApiProperty({
    example: 'strongPassword123',
    description: "The user's password",
  })
  @IsNotEmpty()
  @IsString()
  @Length(8, 20)
  password!: string;
}
