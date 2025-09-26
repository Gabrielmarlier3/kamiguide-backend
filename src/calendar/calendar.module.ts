import { Get, Module } from '@nestjs/common';
import { CalendarService } from './calendar.service';
import { CalendarController } from './calendar.controller';
import { JikanService } from '../jikan/jikan.service';
import { RedisService } from '../redis/redis.service';
import { CalendarModel } from './calendar.model';
import { SequelizeModule } from '@nestjs/sequelize';

@Module({
  imports: [SequelizeModule.forFeature([CalendarModel])],
  providers: [CalendarService, JikanService, RedisService],
  controllers: [CalendarController],
})
export class CalendarModule {}
