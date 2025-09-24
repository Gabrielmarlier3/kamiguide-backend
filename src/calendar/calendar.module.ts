import { Get, Module } from '@nestjs/common';
import { CalendarService } from './calendar.service';
import { CalendarController } from './calendar.controller';
import { JikanService } from '../jikan/jikan.service';
import { RedisService } from '../redis/redis.service';

@Module({
  providers: [CalendarService, JikanService, RedisService],
  controllers: [CalendarController],
})
export class CalendarModule {}
