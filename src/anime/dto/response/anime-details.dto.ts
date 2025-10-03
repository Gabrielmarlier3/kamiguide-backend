import { ApiProperty } from '@nestjs/swagger';

export class GenreDto {
  @ApiProperty({ example: 1, description: 'Genre ID from MyAnimeList' })
  mal_id!: number;

  @ApiProperty({ example: 'anime', description: 'Type of the genre' })
  type!: string;

  @ApiProperty({ example: 'Action', description: 'Readable name of the genre' })
  name!: string;
}

export class StreamingDto {
  @ApiProperty({
    example: 'Crunchyroll',
    description: 'Streaming platform name',
  })
  name!: string;

  @ApiProperty({
    example: 'https://crunchyroll.com/anime',
    description: 'Streaming platform URL',
  })
  url!: string;
}

export class AnimeDetailsDto {
  @ApiProperty({
    example: 5114,
    description: 'Anime ID from MyAnimeList',
  })
  mal_id!: number;

  @ApiProperty({
    example: 'Fullmetal Alchemist: Brotherhood',
    description: 'Official anime title',
  })
  title!: string;

  @ApiProperty({
    example: 'https://cdn.myanimelist.net/images/anime/1223/96541.jpg',
    description: 'Main anime image',
  })
  image_url!: string;

  @ApiProperty({
    example: 9.2,
    description: 'Anime score on MyAnimeList',
  })
  score!: number;

  @ApiProperty({
    example: 'Spring',
    description: 'Season of release',
  })
  season!: string;

  @ApiProperty({
    example: 'Finished Airing',
    description: 'Current airing status',
  })
  status!: string;

  @ApiProperty({
    example: 'Two brothers search for the Philosopher’s Stone...',
    description: 'Anime synopsis',
  })
  synopsis!: string;

  @ApiProperty({
    example: 'Series',
    description: 'Anime type (TV, OVA, Movie, etc.)',
  })
  type!: string;

  @ApiProperty({
    example: 2009,
    description: 'Release year',
  })
  year!: number;

  @ApiProperty({
    type: [StreamingDto],
    description: 'Available streaming platforms',
  })
  streaming!: StreamingDto[];

  @ApiProperty({
    type: [GenreDto],
    description: 'Anime genres list',
  })
  genres!: GenreDto[];
}

export class AnimeDetailsResponseDto {
  @ApiProperty({
    type: () => AnimeDetailsDto,
    description: 'Detailed information about the anime',
  })
  payload!: AnimeDetailsDto;

  @ApiProperty({
    example: new Date(),
    description: 'Timestamp when the data was fetched',
  })
  fetchedAt!: string;
}
