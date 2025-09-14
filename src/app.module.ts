import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AnimeModule } from './anime/anime.module';
import { UserModule } from './user/user.module';
import { CalendarModule } from './calendar/calendar.module';
import { LibraryModule } from './library/library.module';

@Module({
  imports: [AnimeModule, UserModule, CalendarModule, LibraryModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  constructor() {
    if (!process.env.JINKAN_BASE_URL) {
      throw new Error(
        'A variável de ambiente JINKAN_BASE_URL não está definida.',
      );
    }
  }
}
