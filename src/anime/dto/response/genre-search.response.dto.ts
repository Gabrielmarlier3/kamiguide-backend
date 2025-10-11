import { ApiProperty } from '@nestjs/swagger';

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
  title: string;

  @ApiProperty({
    example: 'https://cdn.myanimelist.net/images/anime/1208/94745.jpg',
    description: 'Image/cover URL of the anime.',
  })
  image_url!: string;

  @ApiProperty({
    example: 9.1,
    description: 'Average score on MyAnimeList.',
  })
  score?: number;

  @ApiProperty({
    example: 'Spring',
    description: 'Season when the anime was released.',
  })
  season?: string;

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
  year?: number;
}

export class PaginationDto {
  @ApiProperty({
    example: 1,
    description: 'Current page number.',
  })
  page!: number;

  @ApiProperty({
    example: 20,
    description: 'Number of items per page.',
  })
  perPage!: number;

  @ApiProperty({
    example: 240,
    description: 'Total number of results for the given genre.',
  })
  totalResults!: number;

  @ApiProperty({
    example: 12,
    description: 'Total number of pages.',
  })
  totalPages!: number;
}

export class GenreTabDto {
  @ApiProperty({
    type: () => PaginationDto,
    description: 'Pagination metadata.',
  })
  pagination!: PaginationDto;

  @ApiProperty({
    type: () => [GenreDetailDto],
    description: 'List of anime details belonging to the selected genre.',
  })
  data!: GenreDetailDto[];
}

export class GenreSearchResponseDto {
  @ApiProperty({
    type: () => GenreTabDto,
    description: 'Anime list filtered by genre with pagination.',
  })
  payload!: GenreTabDto;

  @ApiProperty({
    example: new Date(),
    description: 'Timestamp when the data was fetched.',
  })
  fetchedAt!: string;
}