import { Module } from '@nestjs/common';
import { LibraryService } from './library.service';
import { LibraryController } from './library.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { LibraryModel } from './library.model';
import { JikanService } from '../jikan/jikan.service';

@Module({
  imports: [SequelizeModule.forFeature([LibraryModel])],
  providers: [LibraryService, JikanService],
  controllers: [LibraryController],
})
export class LibraryModule {}
