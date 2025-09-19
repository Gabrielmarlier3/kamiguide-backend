import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, Max, Min } from 'class-validator';
import { AvailableGenres } from '../../interface/anime-genres.interface';

export class GetAnimeByGenreDto {
  @ApiProperty({
    enum: AvailableGenres,
    description: 'Genre to search anime by.',
    example: AvailableGenres.Action,
  })
  @IsEnum(AvailableGenres, { message: 'Genre not found' })
  genre!: AvailableGenres;

  @ApiPropertyOptional({
    example: 1,
    description: 'Page number (>= 1, default = 1).',
    default: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'Page must be a number' })
  @Min(1, { message: 'Page must be a positive number' })
  page: number = 1;

  @ApiPropertyOptional({
    example: 2024,
    description: 'Release year of the anime (e.g., 2024).',
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'Year must be a number' })
  @Min(1900, { message: 'Year must be greater than or equal to 1900' })
  @Max(new Date().getFullYear() + 1, {
    message: 'Year must not exceed next year',
  })
  year?: number;
}
