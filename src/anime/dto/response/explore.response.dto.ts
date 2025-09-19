import { ApiProperty } from '@nestjs/swagger';

export class ExploreResponseDto {
  @ApiProperty({
    example: 'Action',
    description: 'Genre name used to group the anime list.',
  })
  genre!: string;

  @ApiProperty({
    example: 'https://cdn.myanimelist.net/images/anime/1208/94745.jpg',
    description: 'Image/cover URL of an anime with this genre.',
  })
  image!: string;
}
