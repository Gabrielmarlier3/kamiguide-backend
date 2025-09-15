export class StaffRecomendationDto {
  mal_id: number;
  image_url: string;
  title: string;
  year: string;
  episodes: string;
  sinopses: string;
  genres: IGenres[];
}

interface IGenres {
  mal_id: number;
  type: string;
  name: string;
}
