import { Module } from '@nestjs/common';
import { EmailService } from './email.service';
import { RedisService } from '../redis/redis.service';

@Module({
  providers: [EmailService, RedisService],
  exports: [EmailService],
})
export class EmailModule {}
