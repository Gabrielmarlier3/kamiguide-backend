import { ApiProperty } from '@nestjs/swagger';

export class GenreDto {
  @ApiProperty({
    example: 1,
    description: 'Genre ID from MyAnimeList (Jikan).',
  })
  mal_id!: number;

  @ApiProperty({
    example: 'anime',
    description: 'Type of genre according to Jikan (usually "anime").',
  })
  type!: string;

  @ApiProperty({
    example: 'Action',
    description: 'Readable name of the genre.',
  })
  name!: string;
}

export class StaffRecomendationResponseDto {
  @ApiProperty({
    type: () => [StaffDto],
    description: 'List of staff recommendations.',
  })
  payload: StaffDto[];
  @ApiProperty({
    example: new Date(),
    description: 'Timestamp when the data was fetched.',
  })
  fetchedAt: string;
}

export class StaffDto {
  @ApiProperty({
    example: 5114,
    description: 'Anime ID from MyAnimeList (Jikan).',
  })
  mal_id!: number;

  @ApiProperty({
    example: 'https://cdn.myanimelist.net/images/anime/1208/94745.jpg',
    description: 'Image/cover URL of the anime.',
  })
  image_url!: string;

  @ApiProperty({
    example: 'Fullmetal Alchemist: Brotherhood',
    description: 'Official anime title.',
  })
  title!: string;

  @ApiProperty({
    example: '2009',
    description: 'Release year (string according to your DTO).',
  })
  year!: string;

  @ApiProperty({
    example: '64',
    description: 'Number of episodes (string according to your DTO).',
  })
  episodes!: string;

  @ApiProperty({
    example:
      'After a failed attempt at human transmutation, the Elric brothers search for the Philosopher’s Stone to restore their bodies.',
    description: 'Anime synopsis (text coming from Jikan).',
  })
  sinopses!: string;

  @ApiProperty({
    type: () => [GenreDto],
    description: 'List of genres associated with the anime.',
    example: [
      { mal_id: 1, type: 'anime', name: 'Action' },
      { mal_id: 24, type: 'anime', name: 'Sci-Fi' },
    ],
  })
  genres!: GenreDto[];
}
