import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { AvailableGenres } from '../../interface/anime-genres.interface';

export class AvailableGenresDto {
  @ApiProperty({
    enum: AvailableGenres,
    isArray: true,
    example: [
      'Action',
      'Comedy',
      'Fantasy',
      'Romance',
      'Slice of Life',
      'Suspense',
    ],
    description: 'List of available genres.',
  })
  @IsEnum(AvailableGenres, { each: true, message: 'Invalid genre' })
  genres!: AvailableGenres[];
}
