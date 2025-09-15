export class StaffRecomendationDto {
  mal_id: number;
  image_url: string;
  title: string;
  sinopses: string;
  genres: IGenres[];
}

interface IGenres {
  mal_id: number;
  type: string;
  name: string;
}
