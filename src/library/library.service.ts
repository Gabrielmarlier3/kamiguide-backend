import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { LibraryModel } from './library.model';
import { AddLibraryDto } from './dto/request/addToUserLibrary.dto';
import { GetUserLibraryResponseDto } from './dto/response/getUserLibrary.dto';
import { AnimeStatus } from '../jikan/interface/anime-status.interface';

@Injectable()
export class LibraryService {
  private logger: Logger = new Logger(this.constructor.name);

  constructor(
    @InjectModel(LibraryModel)
    private readonly libraryModel: typeof LibraryModel,
  ) {}

  async getUserLibrary(userUid: string): GetUserLibraryResponseDto[] {
    try {
      const userLibrary = await this.libraryModel.findAll({
        where: { user_uid: userUid },
      });
      return this.formatedUserLibrary(userLibrary);
    } catch (e) {
      this.logger.error(
        `[getUserLibrary] Error fetching library for userUid ${userUid}: ${
          e instanceof Error ? e.message : 'Unknown error'
        }`,
      );

      throw new HttpException(
        'Error fetching user library',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async addToUserLibrary(userUid: string, anime: AddLibraryDto) {
    try {
    return this.libraryModel.create({
      mal_id: anime.malId,
      media_type: anime.mediaType,
      year: anime.year,
      user_uid: userUid,
      title: anime.title,
      image_url: anime.imageUrl,
      status: anime.status,
    });
    catch (e) {

      }
  }

  formatedUserLibrary(library: LibraryModel[]): GetUserLibraryResponseDto[] {
    return library.map((item) => ({
      user_uid: item.user_uid,
      mal_id: item.mal_id,
      title: item.title,
      media_type: item.media_type,
      season: item.season,
      image_url: item.image_url,
      year: item.year,
      status: item.status as unknown as typeof AnimeStatus,
    }));
  }
}
