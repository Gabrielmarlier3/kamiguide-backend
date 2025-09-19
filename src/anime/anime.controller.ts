import { Controller, Get, Query } from '@nestjs/common';
import { ApiInternalServerErrorResponse, ApiOkResponse } from '@nestjs/swagger';
import { AnimeService } from './anime.service';
import { AvailableGenres } from './interface/anime-genres.interface';
import { StaffRecomendationResponseDto } from './dto/response/staff-recomendation.response.dto';
import { PopularResponseDto } from './dto/response/popular.response.dto';
import { ExploreResponseDto } from './dto/response/explore.response.dto';
import { GenreTabDto } from './dto/response/genre-search.response.dto';
import { SearchResponseDto } from './dto/response/search.response.dto';
import { AvailableGenresDto } from './dto/response/available-genre.response.dto';
import { SearchQueryDto } from './dto/request/search.request.dto';
import { GetAnimeByGenreDto } from './dto/request/genre-search.request.dto';
import { RedisService } from '../redis/redis.service';
import { getOrSet } from '../utils/cache.util';

@Controller('anime')
export class AnimeController {
  constructor(
    private readonly animeService: AnimeService,
    private readonly redis: RedisService,
  ) {}

  @Get('staff-recomendation')
  @ApiOkResponse({
    description: 'Get staff recomendation.',
    type: [StaffRecomendationResponseDto],
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error.',
    schema: {
      example: {
        statusCode: 500,
        message: 'Error fetching season anime',
      },
    },
  })
  async getStaffRecomendation(): Promise<StaffRecomendationResponseDto[]> {
    const key = 'app:home:v1:stf_recommendation';
    const TTL_7_DAYS = 60 * 60 * 24 * 7; // 7 days in seconds
    return await getOrSet(this.redis.client, key, TTL_7_DAYS, () =>
      this.animeService.getStaffRecomendation(),
    );
  }

  @Get('popular')
  @ApiOkResponse({
    description: 'Get popular recomendation.',
    type: [PopularResponseDto],
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error.',
    schema: {
      example: {
        statusCode: 500,
        message: 'Error fetching popular anime recommendation',
      },
    },
  })
  async getPopularRecomendation(): Promise<PopularResponseDto[]> {
    const key = 'app:home:v1:popular_recommendation';
    const TTL_7_DAYS = 60 * 60 * 24 * 7; // 7 days in seconds
    return await getOrSet(this.redis.client, key, TTL_7_DAYS, () =>
      this.animeService.getPopularRecomendation(),
    );
  }

  @Get('explore')
  @ApiOkResponse({
    description: 'Get explore recomendation.',
    type: [ExploreResponseDto],
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error.',
    schema: {
      example: {
        statusCode: 500,
        message: 'Error fetching explore anime recommendation',
      },
    },
  })
  async getExploreRecomendation(): Promise<ExploreResponseDto[]> {
    const key = 'app:home:v1:explore_recommendation';
    const TTL_7_DAYS = 60 * 60 * 24 * 7; // 7 days in seconds
    return await getOrSet(this.redis.client, key, TTL_7_DAYS, () =>
      this.animeService.getExploreRecomendation(),
    );
  }

  @Get('explore/genre')
  @ApiOkResponse({
    description: 'Get anime by genre with pagination.',
    type: GenreTabDto,
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error.',
    schema: {
      example: {
        statusCode: 500,
        message: 'Error fetching anime by genre',
      },
    },
  })
  async getAnimeByGender(@Query() q: GetAnimeByGenreDto): Promise<GenreTabDto> {
    const key = `app:explore:v1:genre:${q.genre}:page:${q.page}:year:${q.year}`;
    const TTL_1_DAY = 60 * 60 * 24; // 1 day in seconds
    return await getOrSet(this.redis.client, key, TTL_1_DAY, () =>
      this.animeService.getAnimeByGenre(q.genre, q.page, q.year),
    );
  }

  @Get('search')
  @ApiOkResponse({
    description: 'Search anime by name.',
    type: [SearchResponseDto],
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error.',
    schema: {
      example: {
        statusCode: 500,
        message: 'Error fetching anime by name',
      },
    },
  })
  async findAnimeByName(
    @Query() q: SearchQueryDto,
  ): Promise<SearchResponseDto[]> {
    const key = `app:search:v1:name:${q.name}:page:${q.page}}`;
    const TTL_1_HOUR = 60 * 60; // 1 hour in seconds
    return await getOrSet(this.redis.client, key, TTL_1_HOUR, () =>
      this.animeService.getAnimeByName(q.name, q.page),
    );
  }

  @Get('available-genres')
  @ApiOkResponse({
    description: 'Returns the list of available genres.',
    type: AvailableGenresDto,
  })
  getAvailableGenres(): AvailableGenresDto {
    return {
      genres: Object.values(AvailableGenres),
    };
  }
}
