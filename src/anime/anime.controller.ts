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

@Controller('anime')
export class AnimeController {
  constructor(private readonly animeService: AnimeService) {}

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
    return await this.animeService.getStaffRecomendation();
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
    return await this.animeService.getPopularRecomendation();
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
    return await this.animeService.getExploreRecomendation();
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
    return await this.animeService.getAnimeByGenre(
      q.genre,
      q.page,
      q.limit,
      q.year,
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
    return await this.animeService.getAnimeByName(q.name, q.page, q.limit);
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
