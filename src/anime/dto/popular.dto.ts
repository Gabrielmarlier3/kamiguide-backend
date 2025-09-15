export class PopularDto {
  mal_id: number;
  title: string;
  image_url: string;
  score: number;
  status: string;
  genres: IGenres[];
}

interface IGenres {
  mal_id: number;
  type: string;
  name: string;
}
