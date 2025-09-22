import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';

export class ChangePasswordDto {
  @ApiProperty({
    example: 'gabrielmarliere2005@gmail.com',
    description: "The user's email address",
  })
  @IsNotEmpty()
  @IsEmail()
  email!: string;

  @ApiProperty({
    example: '182469',
    description:
      'Five-digit verification code sent to the user’s email for password reset',
  })
  @IsNotEmpty()
  @IsString()
  token!: string;

  @ApiProperty({
    example: 'strongPassword123',
    description: "The user's password",
  })
  @IsNotEmpty()
  @IsString()
  @Length(8, 20)
  newPassword!: string;
}
