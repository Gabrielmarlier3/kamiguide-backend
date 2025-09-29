import { ApiProperty } from '@nestjs/swagger';

export class RemoveLibraryDto {
  @ApiProperty({ example: 5114, description: 'MyAnimeList ID of the anime' })
  malId!: number;
}
