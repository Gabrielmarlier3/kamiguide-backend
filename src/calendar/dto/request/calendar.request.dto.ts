import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { DayFilter } from '../../../jikan/interface/scheduleFilter.interface';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class CalendarRequestDto {
  @ApiProperty({
    description: 'Day of the week filter',
    enum: DayFilter,
    example: DayFilter.Monday,
  })
  @IsEnum(DayFilter)
  @IsNotEmpty()
  day!: DayFilter;

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
}
