export enum OrderBy {
  MalId = 'mal_id',
  Title = 'title',
  StartDate = 'start_date',
  EndDate = 'end_date',
  Episodes = 'episodes',
  Score = 'score',
  ScoredBy = 'scored_by',
  Rank = 'rank',
  Popularity = 'popularity',
  Members = 'members',
  Favorites = 'favorites',
}

export class GenreAnimeDto {
  genreId: number;
  page?: number = 1;
  order_by?: OrderBy = OrderBy.Score;
  sort?: 'desc' | 'asc' = 'desc';
  limit?: number = 12;
  year?: string;
}
