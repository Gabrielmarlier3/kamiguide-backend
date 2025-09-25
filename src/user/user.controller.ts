import {
  Body,
  Controller,
  Get,
  HttpException,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { FirebaseService } from '../firebase/firebase.service';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiTooManyRequestsResponse,
} from '@nestjs/swagger';
import { IdToken } from '../auth/id-token.decorator';
import { AuthGuard } from '../auth/auth.guard';
import { GenerateTokenDto } from './dto/generateToken.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { RegisterUserDto } from './dto/register-user.dto';
import { StaffRecomendationResponseDto } from '../anime/dto/response/staff-recomendation.response.dto';

@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly firebaseService: FirebaseService,
  ) {}

  @ApiCreatedResponse({
    description: 'User registered successfully',
    schema: {
      example: { message: 'User registered successfully.', statusCode: 201 },
    },
  })
  @ApiBadRequestResponse({
    description: 'Response when code is not equal to the sent one.',
    schema: {
      example: {
        statusCode: 400,
        message: 'Invalid token',
      },
    },
  })
  @ApiTooManyRequestsResponse({
    description: 'Too many attempts, please request a new token.',
    schema: {
      example: {
        statusCode: 429,
        message: 'Too many attempts, please request a new token.',
      },
    },
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error.',
    schema: {
      example: {
        statusCode: 500,
        message: 'Error registering user.',
      },
    },
  })
  @Post('register')
  async registerUser(@Body() dto: RegisterUserDto) {
    const user = await this.userService.registerUser(dto);
    if (user) {
      return { message: 'User registered successfully.', statusCode: 201 };
    }
    throw new HttpException('Error registering user.', 500);
  }

  @Patch('change-password')
  @ApiOkResponse({
    description: 'Password changed successfully',
    schema: {
      example: { message: 'Password changed successfully', status: 200 },
    },
  })
  @ApiBadRequestResponse({
    description: 'Invalid token.',
    schema: {
      example: {
        statusCode: 400,
        message: 'Invalid token',
      },
    },
  })
  @ApiTooManyRequestsResponse({
    description: 'Too many attempts, please request a new token.',
    schema: {
      example: {
        statusCode: 429,
        message: 'Too many attempts, please request a new token',
      },
    },
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error.',
    schema: {
      example: {
        statusCode: 500,
        message: 'Error changing password',
      },
    },
  })
  async changePassword(@Body() dto: ChangePasswordDto) {
    await this.userService.changePassword(dto);
    return { message: 'Password changed successfully', status: 200 };
  }

  @Post('refactor-token')
  @ApiOkResponse({
    description: 'If the email is registered, a code has been sent',
    schema: {
      example: {
        statusCode: 200,
        message: 'If the email is registered, a code has been sent',
      },
    },
  })
  @ApiInternalServerErrorResponse({
    description: 'Error sending code.',
    schema: {
      example: {
        statusCode: 500,
        message: 'Error sending code.',
      },
    },
  })
  async createToken(@Body() dto: GenerateTokenDto) {
    await this.userService.sendRefactorCodeMail(dto.email);
    return { message: 'If the email is registered, a code has been sent', status: 200};
  }

  @Post('verification-token')
  @ApiOkResponse({
    description: 'Verification code sent to your email',
    schema: {
      example: { message: 'Verification code sent to your email' },
    },
  })
  @ApiBadRequestResponse({
    description: 'Account with this email already exist.',
    schema: {
      example: {
        statusCode: 400,
        message: 'Account with this email already exist',
      },
    },
  })
  @ApiInternalServerErrorResponse({
    description: 'Error sending code.',
    schema: {
      example: {
        statusCode: 500,
        message: 'Error sending code.',
      },
    },
  })
  async createVerificationToken(@Body() dto: GenerateTokenDto) {
    await this.userService.sendVerificationCode(dto.email);
    return { message: 'Verification code sent to your email' };
  }

  @Get('profile')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  async profile(@IdToken() token: string) {
    return await this.firebaseService.verifyIdToken(token);
  }
}
