import { ApiProperty } from '@nestjs/swagger';
import { DayFilter } from '../../../jikan/interface/scheduleFilter.interface';

export class CalendarResponseDto {
  @ApiProperty({
    example: 5114,
    description: 'MyAnimeList ID of the anime',
  })
  malId: number;

  @ApiProperty({
    example: 'monday',
    description: 'Day of the week when the episode is released',
    enum: DayFilter,
  })
  day: DayFilter;

  @ApiProperty({
    example: 'Fullmetal Alchemist: Brotherhood',
    description: 'Title of the anime',
  })
  title: string;

  @ApiProperty({
    example: '18:00',
    description:
      'Release time of the episode in HH:mm format (UTC or specified timezone)',
  })
  releaseTime: string;

  @ApiProperty({
    example: 64,
    description: 'Total number of episodes for the anime',
  })
  episodeCount: number;

  @ApiProperty({
    example: 'https://cdn.myanimelist.net/images/anime/1208/94745.jpg',
    description: 'URL of the cover image for the anime',
  })
  imageUrl: string;
}
