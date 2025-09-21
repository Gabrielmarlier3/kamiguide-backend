import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { FirebaseService } from '../firebase/firebase.service';
import { RedisService } from '../redis/redis.service';
import { EmailService } from '../email/email.service';

@Module({
  providers: [UserService, RedisService, EmailService],
  exports: [UserService],
  controllers: [UserController],
})
export class UserModule {}
