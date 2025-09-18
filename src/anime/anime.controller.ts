import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
} from '@nestjs/common';
import { GenreTabDto } from './dto/genre-search.response.dto';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AnimeService } from './anime.service';
import { StaffRecomendationResponseDto } from './dto/staff-recomendation.response.dto';
import { PopularResponseDto } from './dto/popular.response.dto';
import { ExploreResponseDto } from './dto/explore.response.dto';
import { SearchResponseDto } from './dto/search.response.dto';
import { AvailableGenres } from './interface/anime-genres.interface';

@Controller('anime')
export class AnimeController {
  constructor(private readonly animeService: AnimeService) {}

  @ApiOperation({ summary: "Endpoint to get today's staff recomendations" })
  @ApiResponse({ status: 201, description: 'Success.' })
  @ApiResponse({ status: 500, description: 'Internal Server Error.' })
  @Get('staff-recomendation')
  async getStaffRecomendation(): Promise<StaffRecomendationResponseDto[]> {
    return await this.animeService.getStaffRecomendation();
  }

  @Get('popular')
  async getPopularRecomendation(): Promise<PopularResponseDto[]> {
    return await this.animeService.getPopularRecomendation();
  }

  @Get('explore')
  async getExploreRecomendation(): Promise<ExploreResponseDto[]> {
    return await this.animeService.getExploreRecomendation();
  }

  @Get('explore/:genre/:page')
  async getAnimeByGender(
    @Param('genre') genre: AvailableGenres,
    @Param('page') page: number,
  ): Promise<GenreTabDto> {
    if (isNaN(page) || page < 1) page = 1;
    if (!Object.values(AvailableGenres).includes(genre)) {
      throw new HttpException('Genre not found', HttpStatus.BAD_REQUEST);
    }
    return await this.animeService.getAnimeByGenre(genre, page);
  }

  @Get('search/:name')
  async findAnimeByName(
    @Param('name') name: string,
  ): Promise<SearchResponseDto[]> {
    return await this.animeService.getAnimeByName(name);
  }

  @Get('available-genres')
  getAvailableGenres(): AvailableGenres[] {
    return Object.values(AvailableGenres);
  }
}
