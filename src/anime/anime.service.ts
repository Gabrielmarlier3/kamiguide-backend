import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { IStaffRecommendation } from './interface/staff-recommendation.interface';

@Injectable()
export class AnimeService {
  private base_url: string =
    process.env.JINKAN_BASE_URL ?? 'https://api.jikan.moe/v4';

  //todo: usar alguma biblioteca para ficar mais limpo
  async getStaffRecomendation() {
    const data: Response = await fetch(
      `${this.base_url}/recommendations/anime`,
    );

    if (!data.ok) {
      throw new HttpException(
        'Error fetching anime recommendation',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    const recommendations = (await data.json()) as IStaffRecommendation;
    return recommendations.data.sort(() => Math.random() - 0.5).slice(0, 3);
  }

  async getPopularRecomendation() {
    // Lógica para buscar animes populares
    return [];
  }

  async getExploreRecomendation() {
    // Lógica para explorar animes
    return [];
  }

  async getAnimeByGender(genre: string) {
    // Lógica para buscar animes por gênero
    return [];
  }

  async findAnimeByName(name: string) {
    // Lógica para buscar animes pelo nome
    return [];
  }
}
