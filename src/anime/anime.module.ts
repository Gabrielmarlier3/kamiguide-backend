import { Module } from '@nestjs/common';
import { AnimeService } from './anime.service';
import { AnimeController } from './anime.controller';
import { RedisService } from '../redis/redis.service';

@Module({
  providers: [AnimeService, RedisService],
  controllers: [AnimeController],
})
export class AnimeModule {}
