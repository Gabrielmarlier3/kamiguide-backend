import { Injectable } from '@nestjs/common';
import { JikanService } from '../jikan/jikan.service';
import { Season } from '../jikan/interface/season-now.interface';
import { AnimeGenreId } from '../jikan/interface/genre-sorted.interface';
import { StaffRecomendationDto } from './dto/staff-recomendation.dto';
import { PopularDto } from './dto/popular.dto';
import { Tops } from '../jikan/interface/popular-anime.interface';
import { ExploreAnime, ExploreDto } from './dto/explore.dto';
import {
  AvailableGenres,
  GenreDetailDto,
  GenreTabDto,
} from './dto/genreSearchDto';
import { Quered } from '../jikan/interface/anime-query.interface';
import { SearchDto } from './dto/search.dto';
import { GenreReturn } from '../jikan/interface/genre-return.interface';

@Injectable()
export class AnimeService {
  private jikan: JikanService = new JikanService();

  async getExploreRecomendation(): Promise<ExploreDto[]> {
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
        }) as ExploreAnime[],
      };
    }) as ExploreDto[];
  }

  async getStaffRecomendation(): Promise<StaffRecomendationDto[]> {
    const animes: Season[] = await this.jikan.getSeasonAnime();

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
    }) as StaffRecomendationDto[];
  }

  async getPopularRecomendation(): Promise<PopularDto[]> {
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
    }) as PopularDto[];
  }

  async getAnimeByGenre(
    genreOptions: AvailableGenres,
    page: number,
  ): Promise<GenreTabDto> {
    const animes: GenreReturn = await this.jikan.getAnimeByGenre({
      genreId: AnimeGenreId[genreOptions as keyof typeof AnimeGenreId],
      limit: 20,
      page: page,
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

  async getAnimeByName(name: string): Promise<SearchDto[]> {
    const searchAnime: Quered[] = await this.jikan.getAnimeByName(name);
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
    }) as SearchDto[];
  }
}
