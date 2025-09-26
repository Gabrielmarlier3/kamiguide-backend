import { ConflictException, Injectable, Logger } from '@nestjs/common';
import { JikanService } from '../jikan/jikan.service';
import { ScheduleFilter } from '../jikan/interface/scheduleFilter.interface';
import { GetUserCalendarResponseDto } from './dto/response/getUserCalendar.response.dto';
import { Schedule } from '../jikan/interface/schedule.interface';
import { InjectModel } from '@nestjs/sequelize';
import { CalendarModel } from './calendar.model';
import { AddUserCalendarDto } from './dto/request/addUserCalendar.request';
import { UniqueConstraintError } from 'sequelize';

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
        `Error fetching user calendar for userUid ${userUid}: ${e.message}`,
      );
      throw e;
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
      });
    } catch (error) {
      if (error instanceof UniqueConstraintError) {
        this.logger.warn(
          `User ${userUid} tried to add a duplicate anime (malId=${dto.malId}).`,
        );
        throw new ConflictException(
          'This anime is already in the user calendar.',
        );
      }
      this.logger.error(
        `Unexpected error while adding anime to calendar for user ${userUid}: ${error.message}`,
      );
      throw error;
    }

    const userCalendar = await this.calendarModel.findAll({
      where: { user_uid: userUid },
    });
    return this.retrieveUserCalendar(userCalendar);
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
