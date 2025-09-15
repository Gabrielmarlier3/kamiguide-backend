export class SearchDto {
  mal_id: number;
  title: string;
  year: number;
  episodes: number;
  status: string;
  score: number;
  image_url: string;
  genres: IGenres[];
  type: string;
  season: string;
}

interface IGenres {
  mal_id: number;
  type: string;
  name: string;
}
