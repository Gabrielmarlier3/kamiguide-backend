import { HttpException, Injectable } from '@nestjs/common';
import { FirebaseService } from '../firebase/firebase.service';
import { RegisterUserDto } from './dto/register-user.dto';
import { UserRecord } from 'firebase-admin/lib/auth/user-record';
import { EmailService } from '../email/email.service';
import { cacheGet, cacheSet } from '../utils/cache.util';
import { RedisService } from '../redis/redis.service';
import { ChangePasswordDto } from './dto/change-password.dto';

@Injectable()
export class UserService {
  constructor(
    private readonly firebaseService: FirebaseService,
    private readonly emailService: EmailService,
    private readonly redis: RedisService,
  ) {}

  async registerUser(registerUser: RegisterUserDto): Promise<UserRecord> {
    return this.firebaseService.createUser({
      displayName: registerUser.firstName,
      email: registerUser.email,
      password: registerUser.password,
    });
  }

  async changePassword(dto: ChangePasswordDto): Promise<void> {
    const key = `app:recovery:attempts:${dto.email}`;
    const attempts: string | null = await cacheGet(this.redis.client, key);
    if (attempts && parseInt(attempts) >= 5) {
      throw new HttpException(
        'Too many attempts, please request a new token',
        429,
      );
    }
    const newAttempts = attempts ? parseInt(attempts) + 1 : 1;
    await cacheSet(this.redis.client, key, 600, newAttempts.toString());
    const token = await cacheGet(
      this.redis.client,
      `app:recovery:token:${dto.email}`,
    );
    if (token !== dto.token) {
      throw new HttpException('Invalid token', 400);
    }
    await this.firebaseService.changePassword(dto.email, dto.newPassword);
  }

  async sendRefactorCodeMail(email: string): Promise<void> {
    const user = await this.firebaseService.getUserByEmail(email);
    if (user) {
      await this.emailService.sendRefactorCodeMail(user.email!);
    }
  }
}
