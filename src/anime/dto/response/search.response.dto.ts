import { ApiProperty } from '@nestjs/swagger';

export class GenreDto {
  @ApiProperty({
    example: 1,
    description: 'Genre ID from MyAnimeList (Jikan).',
  })
  mal_id!: number;

  @ApiProperty({
    example: 'anime',
    description: 'Type of the genre (usually "anime").',
  })
  type!: string;

  @ApiProperty({
    example: 'Action',
    description: 'Readable name of the genre.',
  })
  name!: string;
}

export class SearchResponseDto {
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
    example: 2009,
    description: 'Release year of the anime.',
  })
  year!: number;

  @ApiProperty({
    example: 64,
    description: 'Number of episodes.',
  })
  episodes!: number;

  @ApiProperty({
    example: 'Finished Airing',
    description: 'Current airing status of the anime.',
  })
  status!: string;

  @ApiProperty({
    example: 9.1,
    description: 'Average score of the anime on MyAnimeList.',
  })
  score!: number;

  @ApiProperty({
    example: 'https://cdn.myanimelist.net/images/anime/1208/94745.jpg',
    description: 'Image/cover URL of the anime.',
  })
  image_url!: string;

  @ApiProperty({
    type: () => [GenreDto],
    description: 'List of genres associated with the anime.',
    example: [
      { mal_id: 1, type: 'anime', name: 'Action' },
      { mal_id: 24, type: 'anime', name: 'Sci-Fi' },
    ],
  })
  genres!: GenreDto[];

  @ApiProperty({
    example: 'TV',
    description: 'Type of anime (e.g., TV, Movie, OVA).',
  })
  type!: string;

  @ApiProperty({
    example: 'Spring',
    description: 'Season when the anime was released.',
  })
  season!: string;
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
    description: 'Total number of results for the search.',
  })
  totalResults!: number;

  @ApiProperty({
    example: 12,
    description: 'Total number of pages.',
  })
  totalPages!: number;
}

export class SearchPaginatedResponseDto {
  @ApiProperty({
    type: () => PaginationDto,
    description: 'Pagination metadata.',
  })
  pagination!: PaginationDto;

  @ApiProperty({
    type: () => [SearchResponseDto],
    description: 'List of anime matching the search criteria.',
  })
  data!: SearchResponseDto[];
}
