import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { GetUserCalendarRequestDto } from './dto/request/getUserCalendar.request.dto';
import { CalendarService } from './calendar.service';
import { getOrSet } from '../utils/cache.util';
import { RedisService } from '../redis/redis.service';
import { ApiBearerAuth, ApiBody, ApiOkResponse } from '@nestjs/swagger';
import { GetUserCalendarResponseDto } from './dto/response/getUserCalendar.response.dto';
import { AuthGuard } from '../auth/auth.guard';
import { UserUid } from '../decorator/user-uid.decorator';
import { AddUserCalendarDto } from './dto/request/addUserCalendar.request';

@Controller('calendar')
export class CalendarController {
  constructor(
    private readonly calendarService: CalendarService,
    private readonly redis: RedisService,
  ) {}

  @Get()
  @ApiOkResponse({
    description: 'Get staff recommendation.',
    type: [GetUserCalendarResponseDto],
  })
  async getAiring(
    @Query() dto: GetUserCalendarRequestDto,
  ): Promise<GetUserCalendarResponseDto[]> {
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
    type: [GetUserCalendarResponseDto],
  })
  async getUserCalendar(
    @UserUid() userUid: string,
  ): Promise<GetUserCalendarResponseDto[]> {
    return this.calendarService.getUserCalendar(userUid);
  }

  @Post('user')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiBody({ type: AddUserCalendarDto })
  @ApiOkResponse({
    description: 'Add an anime to user calendar and return updated list.',
    type: [GetUserCalendarResponseDto],
  })
  async addAnimeToUserCalendar(
    @UserUid() userUid: string,
    @Body() dto: AddUserCalendarDto,
  ): Promise<GetUserCalendarResponseDto[]> {
    return this.calendarService.addToUserCalendar(userUid, dto);
  }

  @Delete('user/:mal_id')
  async removeAnimeFromUserCalendar(
    @UserUid() userUid: string,
    @Param('mal_id') malId: number,
  ): Promise<GetUserCalendarResponseDto[]> {
    return this.calendarService.removeFromUserCalendar(userUid, malId);
  }
}
