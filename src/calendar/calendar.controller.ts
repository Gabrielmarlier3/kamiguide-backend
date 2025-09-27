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
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody, ApiConflictResponse,
  ApiInternalServerErrorResponse,
  ApiOkResponse,
} from '@nestjs/swagger';
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
    description: 'Get airing schedule of animes by day and page',
    type: [GetUserCalendarResponseDto],
  })
  @ApiBadRequestResponse({
    description: 'Invalid query parameters',
    schema: {
      example: {
        statusCode: 400,
        message: 'Validation failed: "day" must be a valid enum value',
        error: 'Bad Request',
      },
    },
  })
  @ApiInternalServerErrorResponse({
    description: 'Error fetching schedule from Jikan API',
    schema: {
      example: {
        statusCode: 500,
        message: 'Error fetching schedule anime',
        error: 'Internal Server Error',
      },
    },
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
  @ApiInternalServerErrorResponse({
    description: 'Error fetching user calendar from database',
    schema: {
      example: {
        statusCode: 500,
        message: 'Error fetching user calendar',
        error: 'Internal Server Error',
      },
    },
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
  @ApiConflictResponse({
    description: 'Anime already exists in user calendar',
    schema: {
      example: {
        statusCode: 409,
        message: 'This anime is already in the user calendar.',
        error: 'Conflict',
      },
    },
  })
  @ApiInternalServerErrorResponse({
    description: 'Unexpected error while adding or fetching user calendar',
    schema: {
      example: {
        statusCode: 500,
        message: 'Error fetching updated user calendar',
        error: 'Internal Server Error',
      },
    },
  })
  async addAnimeToUserCalendar(
    @UserUid() userUid: string,
    @Body() dto: AddUserCalendarDto,
  ): Promise<GetUserCalendarResponseDto[]> {
    return this.calendarService.addToUserCalendar(userUid, dto);
  }

  @Delete('user/:mal_id')
  @ApiOkResponse({
    description: 'Remove an anime from user calendar and return updated list.',
    type: [GetUserCalendarResponseDto],
  })
  @ApiInternalServerErrorResponse({
    description: 'Unexpected error while removing or fetching user calendar',
    schema: {
      example: {
        statusCode: 500,
        message: 'Error removing anime from user calendar',
        error: 'Internal Server Error',
      },
    },
  })
  async removeAnimeFromUserCalendar(
    @UserUid() userUid: string,
    @Param('mal_id') malId: number,
  ): Promise<GetUserCalendarResponseDto[]> {
    return this.calendarService.removeFromUserCalendar(userUid, malId);
  }
}
