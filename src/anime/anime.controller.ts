import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { GenreDto, GENRES } from './dto/genre.dto';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AnimeService } from './anime.service';

@Controller('anime')
export class AnimeController {
  private readonly animeService: AnimeService;
  @ApiOperation({ summary: "Endpoint to get today's staff recomendations" })
  @ApiResponse({ status: 201, description: 'Success.' })
  @ApiResponse({ status: 500, description: 'Internal Server Error.' })
  @Get('staff-recomendation')
  async getStaffRecomendation() {
    return await this.animeService.getStaffRecomendation();
  }

  @Get('popular')
  async getPopularRecomendation() {}

  @Get('explore')
  async getExploreRecomendation() {}

  @Get('available-genres')
  async getAvailableGenres(): Promise<typeof GENRES> {
    return GENRES;
  }

  @Get('explore/:genre')
  async getAnimeByGender(@Param('genre') genre: GenreDto) {}

  @Post('search')
  async findAnimeByName(@Body('name') name: string) {}
}
