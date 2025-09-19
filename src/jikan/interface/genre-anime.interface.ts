import { AnimeGenreId } from './genre-sorted.interface';

export type OrderBy =
  | 'mal_id'
  | 'title'
  | 'start_date'
  | 'end_date'
  | 'episodes'
  | 'score'
  | 'scored_by'
  | 'rank'
  | 'popularity'
  | 'members'
  | 'favorites';

export interface IGenreAnimeFilter {
  genreId: AnimeGenreId;
  page?: number;
  order_by?: OrderBy;
  sort?: 'desc' | 'asc';
  limit?: number;
  year?: number;
}
