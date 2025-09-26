import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEnum,
  IsInt,
  IsOptional,
  IsPositive,
  IsString,
  IsUrl,
  Matches,
  MaxLength,
} from 'class-validator';
import { DayFilter } from '../../../jikan/interface/scheduleFilter.interface';

export class AddUserCalendarDto {
  @ApiProperty({
    example: 5114,
    description: 'MyAnimeList ID of the anime',
  })
  @IsInt()
  @IsPositive()
  malId: number;

  @ApiProperty({
    example: 'monday',
    description: 'Day of the week when the episode is released',
    enum: DayFilter,
  })
  @IsEnum(DayFilter)
  day: DayFilter;

  @ApiProperty({
    example: 'Fullmetal Alchemist: Brotherhood',
    description: 'Title of the anime',
  })
  @IsString()
  @MaxLength(255)
  title: string;

  @ApiPropertyOptional({
    example: '18:00',
    description:
      'Release time of the episode in HH:mm format (00:00–23:59). Optional.',
  })
  @IsOptional()
  @IsString()
  @Matches(/^([01]\d|2[0-3]):[0-5]\d$/, {
    message: 'releaseTime must be in HH:mm format',
  })
  releaseTime?: string;

  @ApiPropertyOptional({
    example: 64,
    description: 'Total number of episodes for the anime. Optional.',
  })
  @IsOptional()
  @IsInt()
  @IsPositive()
  episodeCount?: number;

  @ApiPropertyOptional({
    example: 'https://cdn.myanimelist.net/images/anime/1208/94745.jpg',
    description: 'Cover image URL. Optional.',
  })
  @IsOptional()
  @IsUrl()
  imageUrl?: string;
}
