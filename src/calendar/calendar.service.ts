import {
  ConflictException,
  HttpException,
  HttpStatus,
  Injectable,
  Logger,
} from '@nestjs/common';
import { JikanService } from '../jikan/jikan.service';
import { ScheduleFilter } from '../jikan/interface/scheduleFilter.interface';
import { GetUserCalendarResponseDto } from './dto/response/getUserCalendar.response.dto';
import { Schedule } from '../jikan/interface/schedule.interface';
import { InjectModel } from '@nestjs/sequelize';
import { CalendarModel } from './calendar.model';
import { AddUserCalendarDto } from './dto/request/addUserCalendar.request';
import { UniqueConstraintError } from 'sequelize';
import { Cron, CronExpression } from '@nestjs/schedule';
import { sleep } from '../utils/sleep.util';
import { AnimeDetails } from '../jikan/interface/full-anime.interface';

@Injectable()
export class CalendarService {
  private logger: Logger = new Logger(this.constructor.name);

  constructor(
    private readonly jikanService: JikanService,
    @InjectModel(CalendarModel)
    private readonly calendarModel: typeof CalendarModel,
  ) {}

  async getCalendar(
    filter: ScheduleFilter,
  ): Promise<GetUserCalendarResponseDto[]> {
    try {
      this.logger.log(
        `Fetching calendar for ${filter.day} - Page: ${filter.page}`,
      );
      const schedule = await this.jikanService.getSchedule(filter);

      if (!schedule) return [];

      return this.processJikanSchedule(schedule.data);
    } catch (e) {
      this.logger.error(
        `Error fetching calendar with filter ${JSON.stringify(
          filter,
        )}: ${e.message}`,
      );
      throw e;
    }
  }

  async getUserCalendar(
    userUid: string,
  ): Promise<GetUserCalendarResponseDto[]> {
    try {
      const userCalendar = await this.calendarModel.findAll({
        where: { user_uid: userUid },
      });
      return this.retrieveUserCalendar(userCalendar);
    } catch (e) {
      this.logger.error(
        `[getUserCalendar] Error fetching calendar for userUid ${userUid}: ${
          e instanceof Error ? e.message : 'Unknown error'
        }`,
      );

      throw new HttpException(
        'Error fetching user calendar',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async addToUserCalendar(
    userUid: string,
    dto: AddUserCalendarDto,
  ): Promise<GetUserCalendarResponseDto[]> {
    try {
      await this.calendarModel.create({
        user_uid: userUid,
        mal_id: dto.malId,
        day: dto.day,
        title: dto.title,
        release_time: dto.releaseTime ?? null,
        episode_count: dto.episodeCount ?? null,
        image_url: dto.imageUrl ?? null,
        last_week: false,
      });
    } catch (error) {
      if (error instanceof UniqueConstraintError) {
        this.logger.warn(
          `User ${userUid} tried to add a duplicate anime calendar (malId=${dto.malId}).`,
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
      const userCalendar = await this.calendarModel.findAll({
        where: { user_uid: userUid },
      });
      return this.retrieveUserCalendar(userCalendar);
    } catch (error) {
      this.logger.error(
        `[addToUserCalendar] Error fetching updated calendar for user ${userUid}: ${
          error instanceof Error ? error.message : 'Unknown error'
        }`,
      );
      throw new HttpException(
        'Error fetching updated user calendar',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async removeFromUserCalendar(
    userUid: string,
    malId: number,
  ): Promise<GetUserCalendarResponseDto[]> {
    try {
      await this.calendarModel.destroy({
        where: { user_uid: userUid, mal_id: malId },
      });
    } catch (e) {
      this.logger.error(
        `[removeFromUserCalendar] Error removing anime (malId=${malId}) for user ${userUid}: ${
          e instanceof Error ? e.message : 'Unknown error'
        }`,
      );
      throw new HttpException(
        'Error removing anime from user calendar',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    try {
      const userCalendar = await this.calendarModel.findAll({
        where: { user_uid: userUid },
      });
      return this.retrieveUserCalendar(userCalendar);
    } catch (e) {
      this.logger.error(
        `[removeFromUserCalendar] Error fetching updated calendar after removal for user ${userUid}: ${
          e instanceof Error ? e.message : 'Unknown error'
        }`,
      );
      throw new HttpException(
        'Error fetching updated user calendar',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Cron(CronExpression.EVERY_DAY_AT_2AM)
  async updateUsersAnimes() {
    let maxPages = 3;
    const seenMalIds = new Set<number>();

    for (let page = 1; page <= maxPages; page++) {
      const animes = await this.jikanService.getSchedule({ page });
      if (animes === null) {
        await sleep(1000);
        page--;
        continue;
      }

      maxPages = animes.pagination.last_visible_page;

      const scheduled = this.processJikanSchedule(animes.data);

      for (const jikanAnime of scheduled) {
        const malId = jikanAnime.malId;
        seenMalIds.add(malId);

        const animeDetails: AnimeDetails =
          await this.jikanService.getAnimeDetailsById(malId);
        const hasEnded =
          !animeDetails.airing || animeDetails.status === 'Finished Airing';

        await this.calendarModel.update(
          {
            title: jikanAnime.title,
            day: jikanAnime.day,
            release_time: jikanAnime.releaseTime,
            episode_count: jikanAnime.episodeCount,
            image_url: jikanAnime.imageUrl,
            last_week: hasEnded,
          },
          { where: { mal_id: malId } },
        );
      }
    }

    const uniqueDbMalIds: { mal_id: number }[] =
      await this.calendarModel.findAll({
        attributes: ['mal_id'],
        group: ['mal_id'],
        raw: true,
      });

    for (const { mal_id } of uniqueDbMalIds) {
      if (!seenMalIds.has(mal_id)) {
        const animeDetails =
          await this.jikanService.getAnimeDetailsById(mal_id);
        const hasEnded =
          !animeDetails.airing || animeDetails.status === 'Finished Airing';

        if (hasEnded) {
          await this.calendarModel.update(
            { last_week: true },
            { where: { mal_id } },
          );
        }
      }
    }
  }

  @Cron('0 0 3 * * 1', { timeZone: 'America/Sao_Paulo' })
  async removeNotAiringAnimes() {
    await this.calendarModel.destroy({ where: { last_week: true } });
  }

  private processJikanSchedule(schedule: Schedule[]) {
    return schedule
      .filter((anime) => {
        return (
          anime.broadcast.day !== null && anime.broadcast.day !== undefined
        );
      })
      .map(
        (anime: Schedule) =>
          ({
            day: anime.broadcast.day.toLowerCase().replace(/s$/, ''),
            episodeCount: anime.episodes ?? null,
            malId: anime.mal_id,
            title: anime.title,
            releaseTime: anime.broadcast.time ?? null,
            imageUrl: anime.images.jpg.small_image_url,
          }) as GetUserCalendarResponseDto,
      );
  }

  private retrieveUserCalendar(
    calendar: CalendarModel[],
  ): GetUserCalendarResponseDto[] {
    return calendar.map(
      (anime: CalendarModel) =>
        ({
          day: anime.day,
          episodeCount: anime.episode_count ?? null,
          malId: anime.mal_id,
          title: anime.title,
          releaseTime: anime.release_time ?? null,
          imageUrl: anime.image_url,
        }) as GetUserCalendarResponseDto,
    );
  }
}
