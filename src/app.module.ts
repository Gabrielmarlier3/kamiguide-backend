import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AnimeModule } from './anime/anime.module';
import { UserModule } from './user/user.module';
import { CalendarModule } from './calendar/calendar.module';
import { LibraryModule } from './library/library.module';
import { JikanModule } from './jikan/jikan.module';
import { RedisModule } from './redis/redis.module';
import { FirebaseModule } from './firebase/firebase.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { EmailModule } from './email/email.module';
import { SequelizeModule } from '@nestjs/sequelize';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    AnimeModule,
    UserModule,
    CalendarModule,
    LibraryModule,
    JikanModule,
    RedisModule,
    FirebaseModule.forRoot(),
    AuthModule,
    EmailModule,
    SequelizeModule.forRoot({
      dialect: 'postgres',
      host: process.env.POSTGRES_HOST || 'localhost',
      port: parseInt(process.env.POSTGRES_PORT || '5432', 10),
      username: process.env.POSTGRES_USER || 'admin',
      password: process.env.POSTGRES_PASSWORD || 'secretpassword',
      database: process.env.POSTGRES_DB || 'mydatabase',
      autoLoadModels: true,
      synchronize: true,
      models: [],
      logging: false,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
