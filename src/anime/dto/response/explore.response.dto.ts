import { ApiProperty } from '@nestjs/swagger';

export class ExploreAnimeDto {
  @ApiProperty({
    example: 5114,
    description: 'Anime ID from MyAnimeList (Jikan).',
  })
  mal_id!: number;

  @ApiProperty({
    example: 'Fullmetal Alchemist: Brotherhood',
    description: 'Official title of the anime.',
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
}

export class ExploreResponseDto {
  @ApiProperty({
    example: 'Action',
    description: 'Genre name used to group the anime list.',
  })
  genre!: string;

  @ApiProperty({
    type: () => [ExploreAnimeDto],
    description: 'List of anime belonging to the given genre.',
  })
  animes!: ExploreAnimeDto[];
}
