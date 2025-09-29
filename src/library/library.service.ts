import {
  ConflictException,
  HttpException,
  HttpStatus,
  Injectable,
  Logger,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { LibraryModel } from './library.model';
import { AddLibraryDto } from './dto/request/addToUserLibrary.dto';
import { GetUserLibraryResponseDto } from './dto/response/getUserLibrary.dto';
import { AnimeStatus } from '../jikan/interface/anime-status.interface';
import { UniqueConstraintError } from 'sequelize';
import { Cron } from '@nestjs/schedule';

@Injectable()
export class LibraryService {
  private logger: Logger = new Logger(this.constructor.name);

  constructor(
    @InjectModel(LibraryModel)
    private readonly libraryModel: typeof LibraryModel,
  ) {}

  async getUserLibrary(userUid: string): Promise<GetUserLibraryResponseDto[]> {
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

  async addToUserLibrary(
    userUid: string,
    dto: AddLibraryDto,
  ): Promise<GetUserLibraryResponseDto[]> {
    try {
      await this.libraryModel.create({
        mal_id: dto.malId,
        media_type: dto.mediaType,
        year: dto.year,
        user_uid: userUid,
        title: dto.title,
        image_url: dto.imageUrl,
        status: dto.status,
      });
    } catch (error) {
      if (error instanceof UniqueConstraintError) {
        this.logger.warn(
          `User ${userUid} tried to add a duplicate anime library (malId=${dto.malId}).`,
        );
        throw new ConflictException(
          'This anime is already in the user calendar.',
        );
      }
      this.logger.error(
        `[addToUserCalendar] Unexpected error creating record for user ${userUid}: ${
          error instanceof Error ? error.message : 'Unknown error'
        }`,
      );
      throw new HttpException(
        'Error adding anime to calendar',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    try {
      const userLibrary = await this.libraryModel.findAll({
        where: { user_uid: userUid },
      });
      return this.formatedUserLibrary(userLibrary);
    } catch (error) {
      this.logger.error(
        `[addToUserLibrary] Error fetching updated library for user ${userUid}: ${
          error instanceof Error ? error.message : 'Unknown error'
        }`,
      );
      throw new HttpException(
        'Error fetching updated user library',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async removeFromUserLibrary(
    userUid: string,
    malId: number,
  ): Promise<GetUserLibraryResponseDto[]> {
    try {
      await this.libraryModel.destroy({
        where: { user_uid: userUid, mal_id: malId },
      });
    } catch (error) {
      this.logger.error(
        `[removeFromUserLibrary] Unexpected error deleting record for user ${userUid}: ${
          error instanceof Error ? error.message : 'Unknown error'
        }`,
      );
      throw new HttpException(
        'Error removing anime from library',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    try {
      const userLibrary = await this.libraryModel.findAll({
        where: { user_uid: userUid },
      });
      return this.formatedUserLibrary(userLibrary);
    } catch (error) {
      this.logger.error(
        `[removeFromUserLibrary] Error fetching updated library for user ${userUid}: ${
          error instanceof Error ? error.message : 'Unknown error'
        }`,
      );
      throw new HttpException(
        'Error fetching updated user library',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  //todo: criar logica para atualizar todas os animes da biblioteca
  @Cron('0 0 2 * * 7', { timeZone: 'America/Sao_Paulo' })
  async updateLibraryStatus(): Promise<void> {}

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
