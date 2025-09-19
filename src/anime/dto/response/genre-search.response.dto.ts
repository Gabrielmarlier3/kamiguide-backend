import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { AnimeGenreLabel } from '../../interface/anime-genres.interface';

export class GenreSearchResponseDto {
  @ApiProperty({
    enum: AnimeGenreLabel,
    description: 'Genre to be searched (enum defined in AnimeGenreLabel).',
    example: 'Action',
  })
  @IsEnum(AnimeGenreLabel)
  genre!: AnimeGenreLabel;

  @ApiProperty({
    example: 1,
    description: 'Page number (defaults to 1).',
    required: false,
  })
  page?: number = 1;
}

export class GenreDetailDto {
  @ApiProperty({
    example: 5114,
    description: 'Anime ID from MyAnimeList (Jikan).',
  })
  mal_id!: number;

  @ApiProperty({
    example: 'Fullmetal Alchemist: Brotherhood',
    description: 'Official anime title.',
  })
  title!: string;

  @ApiProperty({
    example: 'https://cdn.myanimelist.net/images/anime/1208/94745.jpg',
    description: 'Image/cover URL of the anime.',
  })
  image_url!: string;

  @ApiProperty({
    example: 9.1,
    description: 'Average score on MyAnimeList.',
  })
  score!: number;

  @ApiProperty({
    example: 'Spring',
    description: 'Season when the anime was released.',
  })
  season!: string;

  @ApiProperty({
    example: 'Finished Airing',
    description: 'Current status of the anime.',
  })
  status!: string;

  @ApiProperty({
    example: 'TV',
    description: 'Type of anime (e.g., TV, Movie, OVA).',
  })
  type!: string;

  @ApiProperty({
    example: 2009,
    description: 'Release year of the anime.',
  })
  year!: number;
}

export class GenreTabDto {
  @ApiProperty({
    example: 120,
    description: 'Total number of anime for the given genre.',
  })
  total!: number;

  @ApiProperty({
    type: () => [GenreDetailDto],
    description: 'List of anime details belonging to the selected genre.',
  })
  animes!: GenreDetailDto[];
}
