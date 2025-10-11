import { Injectable, Logger } from '@nestjs/common';
import { JikanService } from '../jikan/jikan.service';
import { Season } from '../jikan/interface/season-now.interface';
import { IGenreSorted } from '../jikan/interface/genre-sorted.interface';
import { Tops } from '../jikan/interface/popular-anime.interface';
import { IAnimeQuery } from '../jikan/interface/anime-query.interface';
import { GenreReturn } from '../jikan/interface/genre-return.interface';
import { AvailableGenres } from './interface/anime-genres.interface';
import { ExploreResponseDto } from './dto/response/explore.response.dto';
import { StaffDto } from './dto/response/staff-recomendation.response.dto';
import {
  PopularDto,
  PopularResponseDto,
} from './dto/response/popular.response.dto';
import {
  GenreDetailDto,
  GenreTabDto,
} from './dto/response/genre-search.response.dto';
import {
  SearchPaginated,
  SearchResponseDto,
} from './dto/response/search.response.dto';
import { sleep } from '../utils/sleep.util';
import { GenreToIdMap } from '../utils/genreToId.util';
import {
  AnimeDetailsDto,
  AnimeDetailsResponseDto,
} from './dto/response/anime-details.dto';

@Injectable()
export class AnimeService {
  private jikan: JikanService = new JikanService();
  private logger = new Logger(this.constructor.name);

  async getExploreRecommendation(): Promise<ExploreResponseDto[]> {
    this.logger.log('Fetching explore recommendation data...');
    const exploreData: GenreReturn[] = [];
    const animeIdSet = new Set<string>();
    for (const genreName of Object.values(AvailableGenres)) {
      for (let i = 0; i < 2; i++) {
        this.logger.log(
          `Trying to fetch genre: ${genreName}, attempt ${i + 1}`,
        );
        const data = await this.jikan.getAnimeByGenre({
          limit: 10,
          genreId: GenreToIdMap[genreName as AvailableGenres],
        });
        if (data.data.length > 0) {
          // Ensure unique animes across genres
          let filtered = data.data.find((anime) => {
            if (animeIdSet.has(anime.images.jpg.large_image_url)) {
              return false;
            }
            animeIdSet.add(anime.images.jpg.large_image_url);
            return true;
          });
          if (!filtered) {
            this.logger.warn(
              `All animes for genre: ${genreName} are duplicates. Skipping...`,
            );
            filtered = data.data[0]; // Fallback to at least one anime
          }
          exploreData.push({
            length: data.data.length,
            key: genreName,
            animes: [filtered],
          });
          break;
        }
        this.logger.warn(
          `Attempt ${i + 1} failed for genre: ${genreName}. Retrying...`,
        );
        await sleep(1000);
      }
      await sleep(333);
    }
    return exploreData.map((data) => {
      const genre = data.animes;
      return {
        genre: data.key,
        image: genre[0].images.jpg.large_image_url,
      };
    }) as ExploreResponseDto[];
  }

  async getStaffRecommendation(): Promise<StaffDto[]> {
    this.logger.log('Fetching staff recommendation data...');
    const animes: Season[] = await this.jikan.getSeasonAnime(20);

    return animes
      .filter((animes) => {
        return animes.airing;
      })
      .sort((a, b) => b.score - a.score)
      .slice(0, 3)
      .map((anime) => {
        return {
          mal_id: anime.mal_id,
          sinopses: anime.synopsis,
          title: anime.title_english || anime.title,
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
      });
  }

  async getPopularRecommendation(): Promise<PopularDto[]> {
    this.logger.log('Fetching popular recommendation data...');
    const animes: Tops[] = await this.jikan.getPopularRecomendation(8);
    return animes.map((anime: Tops) => {
      return {
        mal_id: anime.mal_id,
        title: anime.title_english || anime.title,
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
    });
  }

  async getAnimeByGenre(
    genreOptions: AvailableGenres,
    page: number,
    year?: number,
    minScore?: number,
    type?: 'movie' | 'series',
  ): Promise<GenreTabDto> {
    this.logger.log(
      `Fetching anime by genre: ${genreOptions}, page: ${page}${year ? ', year: ' + year : ''}`,
    );
    const animes: IGenreSorted = await this.jikan.getAnimeByGenre({
      genreId: GenreToIdMap[genreOptions],
      limit: 20,
      page: page,
      year: year,
      type: type,
      minScore: minScore,
    });

    return {
      pagination: {
        page: page,
        perPage: 20,
        totalResults: animes.pagination.items.total,
        totalPages: animes.pagination.last_visible_page,
      },
      data: animes.data.map((anime) => {
        return {
          mal_id: anime.mal_id,
          title: anime.title_english || anime.title,
          image_url: anime.images.jpg.large_image_url,
          score: anime.score,
          type: anime.type == 'TV' ? 'Series' : anime.type,
          status: anime.status,
          season: anime.season,
          year: anime.year,
        };
      }),
    };
  }

  async getAnimeByName(name: string, page: number): Promise<SearchPaginated> {
    this.logger.log(`Searching anime by name: ${name}, page: ${page}`);
    const searchAnime: IAnimeQuery = await this.jikan.getAnimeByName(
      name,
      page,
      20,
    );
    return {
      pagination: {
        page: page,
        perPage: 20,
        totalResults: searchAnime.pagination.items.total,
        totalPages: searchAnime.pagination.last_visible_page,
      },
      data: searchAnime.data.map((anime) => {
        return {
          mal_id: anime.mal_id,
          title: anime.title_english || anime.title,
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
      }),
    };
  }

  async getAnimeById(malId: number): Promise<AnimeDetailsDto> {
    this.logger.log(`Fetching anime details by ID: ${malId}`);
    const animeDetails = await this.jikan.getAnimeDetailsById(malId);

    return {
      title: animeDetails.title,
      title_english: animeDetails.title_english,
      image_url: animeDetails.images.jpg.large_image_url,
      mal_id: malId,
      score: animeDetails.score,
      season: animeDetails.season ?? 'Unknown',
      status: animeDetails.status,
      synopsis: animeDetails.synopsis,
      type: animeDetails.type == 'TV' ? 'Series' : animeDetails.type,
      year: animeDetails.year ?? 0,
      streaming: animeDetails.streaming.map((stream) => ({
        name: stream.name,
        url: stream.url,
      })),
      genres: animeDetails.genres.map((genre) => ({
        mal_id: genre.mal_id,
        type: genre.type,
        name: genre.name,
      })),
    };
  }
}
