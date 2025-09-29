import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEnum,
  IsInt,
  IsOptional,
  IsPositive,
  IsString,
  IsUrl,
  MaxLength,
} from 'class-validator';
import { AnimeStatus } from '../../../jikan/interface/anime-status.interface';

export class AddLibraryDto {
  @ApiProperty({
    example: 5114,
    description: 'MyAnimeList ID of the anime',
  })
  @IsInt()
  @IsPositive()
  malId: number;

  @ApiProperty({
    example: 'Fullmetal Alchemist: Brotherhood',
    description: 'Title of the anime',
  })
  @IsString()
  @MaxLength(255)
  title: string;

  @ApiProperty({
    example: 'series',
    description: 'Type of media',
    enum: ['movie', 'series'],
  })
  @IsEnum(['movie', 'series'] as const)
  mediaType: 'movie' | 'series';

  @ApiPropertyOptional({
    example: 'spring',
    description: 'Season of release (spring, summer, fall, winter). Optional.',
  })
  @IsOptional()
  @IsString()
  season?: string;

  @ApiProperty({
    example: 'https://cdn.myanimelist.net/images/anime/1208/94745.jpg',
    description: 'Cover image URL of the anime',
  })
  @IsUrl()
  imageUrl: string;

  @ApiPropertyOptional({
    example: 2009,
    description: 'Release year of the anime. Optional.',
  })
  @IsOptional()
  @IsInt()
  @IsPositive()
  year?: number;

  @ApiProperty({
    example: AnimeStatus.AIRING,
    description: 'Current airing status of the anime from MyAnimeList',
    enum: AnimeStatus,
  })
  @IsEnum(AnimeStatus)
  status: AnimeStatus;
}
