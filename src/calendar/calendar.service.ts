import { Injectable } from '@nestjs/common';
import { JikanService } from '../jikan/jikan.service';
import { ScheduleFilter } from '../jikan/interface/scheduleFilter.interface';
import { CalendarResponseDto } from './dto/response/calendar.response.dto';
import { Schedule } from '../jikan/interface/schedule.interface';

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

  constructor(private readonly jikanService: JikanService) {}

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
}
