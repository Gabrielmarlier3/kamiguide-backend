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

export class PopularDto {
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
    description: 'Average score of the anime on MyAnimeList.',
  })
  score!: number;

  @ApiProperty({
    example: 'Finished Airing',
    description: 'Current airing status of the anime.',
  })
  status!: string;

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

export class PopularResponseDto {
  @ApiProperty({
    type: () => [PopularDto],
    description: 'List of popular anime.',
  })
  payload!: PopularDto[];

  @ApiProperty({
    example: new Date().toISOString(),
    description: 'Timestamp when the data was fetched.',
  })
  fetchedAt!: string;
}
