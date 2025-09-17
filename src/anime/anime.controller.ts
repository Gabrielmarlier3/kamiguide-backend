import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
} from '@nestjs/common';
import { GenreTabDto, AvailableGenres } from './dto/genreSearchDto';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AnimeService } from './anime.service';
import { StaffRecomendationDto } from './dto/staff-recomendation.dto';
import { PopularDto } from './dto/popular.dto';
import { ExploreDto } from './dto/explore.dto';
import { SearchDto } from './dto/search.dto';

@Controller('anime')
export class AnimeController {
  constructor(private readonly animeService: AnimeService) {}

  @ApiOperation({ summary: "Endpoint to get today's staff recomendations" })
  @ApiResponse({ status: 201, description: 'Success.' })
  @ApiResponse({ status: 500, description: 'Internal Server Error.' })
  @Get('staff-recomendation')
  async getStaffRecomendation(): Promise<StaffRecomendationDto[]> {
    return await this.animeService.getStaffRecomendation();
  }

  @Get('popular')
  async getPopularRecomendation(): Promise<PopularDto[]> {
    return await this.animeService.getPopularRecomendation();
  }

  @Get('explore')
  async getExploreRecomendation(): Promise<ExploreDto[]> {
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

  @Post('search')
  async findAnimeByName(@Body('name') name: string): Promise<SearchDto[]> {
    return await this.animeService.getAnimeByName(name);
  }

  @Get('available-genres')
  getAvailableGenres(): AvailableGenres[] {
    return Object.values(AvailableGenres);
  }
}
