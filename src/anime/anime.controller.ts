import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { GenreSearchDto, GENRES, GenreTabDto } from './dto/genreSearchDto';
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

  @Get('explore/:genre')
  async getAnimeByGender(
    @Param('genre') genre: GenreSearchDto,
  ): Promise<GenreTabDto[]> {
    return await this.animeService.getAnimeByGenre(genre);
  }

  @Post('search')
  async findAnimeByName(@Body('name') name: string): Promise<SearchDto[]> {
    return await this.animeService.getAnimeByName(name);
  }

  @Get('available-genres')
  getAvailableGenres(): typeof GENRES {
    return GENRES;
  }
}
