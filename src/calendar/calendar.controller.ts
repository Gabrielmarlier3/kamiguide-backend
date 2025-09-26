import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { CalendarRequestDto } from './dto/request/calendar.request.dto';
import { CalendarService } from './calendar.service';
import { getOrSet } from '../utils/cache.util';
import { RedisService } from '../redis/redis.service';
import { ApiBearerAuth, ApiOkResponse } from '@nestjs/swagger';
import { CalendarResponseDto } from './dto/response/calendar.response.dto';
import { AuthGuard } from '../auth/auth.guard';
import { UserUid } from '../decorator/user-uid.decorator';

@Controller('calendar')
export class CalendarController {
  constructor(
    private readonly calendarService: CalendarService,
    private readonly redis: RedisService,
  ) {}

  @Get()
  @ApiOkResponse({
    description: 'Get staff recomendation.',
    type: [CalendarResponseDto],
  })
  async getAiring(
    @Query() dto: CalendarRequestDto,
  ): Promise<CalendarResponseDto[]> {
    const key = `app:calendar:v1:${dto.day}:${dto.page}`;
    const TTL_7_DAYS = 60 * 60 * 24 * 7; // 7 days in seconds

    return await getOrSet(this.redis.client, key, TTL_7_DAYS, () =>
      this.calendarService.getCalendar(dto),
    );
  }

  @Get('user')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOkResponse({
    description: 'Get user calendar.',
    type: [CalendarResponseDto],
  })
  async getUserCalendar(
    @UserUid() userUid: string,
  ): Promise<CalendarResponseDto[]> {
    return this.calendarService.getUserCalendar(userUid);
  }
}
