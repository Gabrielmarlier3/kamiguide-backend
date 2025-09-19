import { Injectable } from '@nestjs/common';
import { JikanService } from '../jikan/jikan.service';
import { Season } from '../jikan/interface/season-now.interface';
import { AnimeGenreId } from '../jikan/interface/genre-sorted.interface';
import { Tops } from '../jikan/interface/popular-anime.interface';
import { Quered } from '../jikan/interface/anime-query.interface';
import { GenreReturn } from '../jikan/interface/genre-return.interface';
import { AvailableGenres } from './interface/anime-genres.interface';
import {
  ExploreAnimeDto,
  ExploreResponseDto,
} from './dto/response/explore.response.dto';
import { StaffRecomendationResponseDto } from './dto/response/staff-recomendation.response.dto';
import { PopularResponseDto } from './dto/response/popular.response.dto';
import {
  GenreDetailDto,
  GenreTabDto,
} from './dto/response/genre-search.response.dto';
import { SearchResponseDto } from './dto/response/search.response.dto';

@Injectable()
export class AnimeService {
  private jikan: JikanService = new JikanService();

  async getExploreRecomendation(): Promise<ExploreResponseDto[]> {
    const exploreData: GenreReturn[] = [];
    for (const genreName of Object.keys(AvailableGenres)) {
      exploreData.push(
        await this.jikan.getAnimeByGenre({
          limit: 5,
          genreId: AnimeGenreId[genreName as keyof typeof AnimeGenreId],
        }),
      );
    }
    return exploreData.map((data) => {
      const genre = data.animes;
      return {
        genre: genre[0].name,
        animes: genre.map((anime) => {
          return {
            mal_id: anime.mal_id,
            title: anime.title,
            image_url: anime.images.jpg.large_image_url,
            score: anime.score,
          };
        }) as ExploreAnimeDto[],
      };
    }) as ExploreResponseDto[];
  }

  async getStaffRecomendation(): Promise<StaffRecomendationResponseDto[]> {
    const animes: Season[] = await this.jikan.getSeasonAnime(3);

    return animes.map((anime) => {
      return {
        mal_id: anime.mal_id,
        sinopses: anime.synopsis,
        title: anime.title,
        image_url: anime.images.jpg.large_image_url,
        year: String(anime?.year),
        episodes: String(anime?.episodes),
        genres: anime.genres.map((genre) => {
          return {
            mal_id: genre.mal_id,
            type: genre.type,
            name: genre.name,
          };
        }),
      };
    }) as StaffRecomendationResponseDto[];
  }

  async getPopularRecomendation(): Promise<PopularResponseDto[]> {
    const animes: Tops[] = await this.jikan.getPopularRecomendation(10);
    return animes.map((anime: Tops) => {
      return {
        mal_id: anime.mal_id,
        title: anime.title,
        image_url: anime.images.jpg.image_url,
        score: anime.score,
        status: anime.status,
        genres: anime.genres.map((genre) => {
          return {
            mal_id: genre.mal_id,
            type: genre.type,
            name: genre.name,
          };
        }),
      };
    }) as PopularResponseDto[];
  }

  async getAnimeByGenre(
    genreOptions: AvailableGenres,
    page: number,
    limit: number,
    year?: number,
  ): Promise<GenreTabDto> {
    const animes: GenreReturn = await this.jikan.getAnimeByGenre({
      genreId: AnimeGenreId[genreOptions as keyof typeof AnimeGenreId],
      limit: limit,
      page: page,
      year: year,
    });

    return {
      total: animes.length,
      animes: animes.animes.map((anime) => {
        return {
          mal_id: anime.mal_id,
          title: anime.title,
          image_url: anime.images.jpg.large_image_url,
          score: anime.score,
          type: anime.type == 'TV' ? 'Series' : anime.type,
          status: anime.status,
          season: anime.season,
          year: anime.year,
        };
      }) as GenreDetailDto[],
    };
  }

  async getAnimeByName(
    name: string,
    page: number,
    limit: number,
  ): Promise<SearchResponseDto[]> {
    const searchAnime: Quered[] = await this.jikan.getAnimeByName(
      name,
      page,
      limit,
    );
    return searchAnime.map((anime) => {
      return {
        mal_id: anime.mal_id,
        title: anime.title,
        year: anime.year,
        episodes: anime.episodes,
        status: anime.status,
        score: anime.score,
        image_url: anime.images.jpg.large_image_url,
        genres: anime.genres.map((genre) => {
          return {
            mal_id: genre.mal_id,
            type: genre.type,
            name: genre.name,
          };
        }),
        type: anime.type == 'TV' ? 'Series' : anime.type,
        season: anime.season,
      };
    }) as SearchResponseDto[];
  }
}
