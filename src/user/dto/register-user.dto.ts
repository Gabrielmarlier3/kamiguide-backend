import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';

export class RegisterUserDto {
  @ApiProperty({ example: 'Gabriel', description: "The user's first name" })
  @IsNotEmpty()
  @IsString()
  firstName!: string;

  @ApiProperty({ example: 'Silva', description: "The user's last name" })
  @IsNotEmpty()
  @IsString()
  lastName!: string;

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
