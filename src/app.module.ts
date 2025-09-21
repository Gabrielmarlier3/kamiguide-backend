import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AnimeModule } from './anime/anime.module';
import { UserModule } from './user/user.module';
import { CalendarModule } from './calendar/calendar.module';
import { LibraryModule } from './library/library.module';
import { JikanModule } from './jikan/jikan.module';
import { RedisModule } from './redis/redis.module';
import { DatabaseModule } from './database/database.module';
import { FirebaseModule } from './firebase/firebase.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    AnimeModule,
    UserModule,
    CalendarModule,
    LibraryModule,
    JikanModule,
    RedisModule,
    DatabaseModule,
    FirebaseModule.forRoot(),
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
