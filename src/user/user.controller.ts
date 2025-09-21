import { Body, Controller, Get, Patch, Post, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { FirebaseService } from '../firebase/firebase.service';
import { ApiBearerAuth } from '@nestjs/swagger';
import { IdToken } from '../auth/id-token.decorator';
import { AuthGuard } from '../auth/auth.guard';
import { GenerateTokenDto } from './dto/generateToken.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { RegisterUserDto } from './dto/register-user.dto';

@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly firebaseService: FirebaseService,
  ) {}

  @Post('register')
  async registerUser(@Body() dto: RegisterUserDto) {
    return await this.userService.registerUser(dto);
  }

  @Patch('change-password')
  async changePassword(@Body() dto: ChangePasswordDto) {
    await this.userService.changePassword(dto);
    return { message: 'Password changed successfully' };
  }

  @Post('token')
  async createToken(@Body() dto: GenerateTokenDto) {
    await this.userService.sendRefactorCodeMail(dto.email);
    return { message: 'If the email is registered, a code has been sent' };
  }

  @Get('profile')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  async profile(@IdToken() token: string) {
    return await this.firebaseService.verifyIdToken(token);
  }
}
