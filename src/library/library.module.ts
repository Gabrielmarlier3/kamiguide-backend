import { Module } from '@nestjs/common';
import { LibraryService } from './library.service';
import { LibraryController } from './library.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { LibraryModel } from './library.model';

@Module({
  imports: [SequelizeModule.forFeature([LibraryModel])],
  providers: [LibraryService],
  controllers: [LibraryController],
})
export class LibraryModule {}
