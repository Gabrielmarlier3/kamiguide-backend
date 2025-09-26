import { Injectable } from '@nestjs/common';
import { JikanService } from '../jikan/jikan.service';
import {
  DayFilter,
  ScheduleFilter,
} from '../jikan/interface/scheduleFilter.interface';
import { CalendarResponseDto } from './dto/response/calendar.response.dto';
import { Schedule } from '../jikan/interface/schedule.interface';
import { InjectModel } from '@nestjs/sequelize';
import { CalendarModel } from './calendar.model';

@Injectable()
export class CalendarService {
  private readonly days = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
  ];

  constructor(
    private readonly jikanService: JikanService,
    @InjectModel(CalendarModel)
    private readonly calendarModel: typeof CalendarModel,
  ) {}

  async getCalendar(filter: ScheduleFilter): Promise<CalendarResponseDto[]> {
    const schedule = await this.jikanService.getSchedule(filter);

    return schedule.map(
      (anime: Schedule) =>
        ({
          day: anime.broadcast.day,
          episodeCount: anime.episodes ?? null,
          malId: anime.mal_id,
          title: anime.title,
          releaseTime: anime.broadcast.time ?? null,
          imageUrl: anime.images.jpg.small_image_url,
        }) as CalendarResponseDto,
    );
  }

  async getUserCalendar(userUid: string): Promise<CalendarResponseDto[]> {
    const userCalendar = await this.calendarModel.findAll({
      where: { user_uid: userUid },
    });
    return userCalendar.map(
      (anime: CalendarModel) =>
        ({
          day: anime.day as DayFilter,
          episodeCount: anime.episode_count ?? null,
          malId: anime.mal_id,
          title: anime.title,
          releaseTime: anime.release_time ?? null,
          imageUrl: anime.image_url,
        }) as CalendarResponseDto,
    );
  }
}
