import { IsEnum } from 'class-validator';
import { AnimeGenreLabel } from '../interface/anime-genres.interface';

//uncomment the line active the category

export class GenreSearchResponseDto {
  @IsEnum(AnimeGenreLabel)
  genre: AnimeGenreLabel;
  page?: number = 1;
}

export class GenreTabDto {
  total: number;
  animes: GenreDetailDto[];
}

export interface GenreDetailDto {
  mal_id: number;
  title: string;
  image_url: string;
  score: number;
  season: string;
  status: string;
  type: string;
  year: number;
}