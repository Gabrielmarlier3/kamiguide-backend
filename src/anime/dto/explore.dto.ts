export class ExploreDto {
  genre: string;
  animes: ExploreAnime[];
}

export interface ExploreAnime {
  mal_id: number;
  title: string;
  image_url: string;
  score: number;
}
