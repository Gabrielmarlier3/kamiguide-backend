import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, Min, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class SearchQueryDto {
  @ApiProperty({ example: 'Fullmetal' })
  @IsString()
  @IsNotEmpty()
  name!: string;

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
