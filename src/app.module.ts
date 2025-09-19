import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AnimeModule } from './anime/anime.module';
import { UserModule } from './user/user.module';
import { CalendarModule } from './calendar/calendar.module';
import { LibraryModule } from './library/library.module';
import { JikanModule } from './jikan/jikan.module';
import { RedisModule } from './redis/redis.module';

@Module({
  imports: [
    AnimeModule,
    UserModule,
    CalendarModule,
    LibraryModule,
    JikanModule,
    RedisModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
