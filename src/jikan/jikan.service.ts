import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { AnimeDetails, IFullAnime } from './interface/full-anime.interface';
import { ISeasonNow, Season } from './interface/season-now.interface';
import { IPopularAnime, Tops } from './interface/popular-anime.interface';
import { IGenreSorted } from './interface/genre-sorted.interface';
import { IAnimeQuery, Quered } from './interface/anime-query.interface';
import { Agent } from 'https';
import axios, { AxiosResponse } from 'axios';
import * as dns from 'node:dns';
import { IGenreAnimeFilter } from './interface/genre-anime.interface';
import { GenreReturn } from './interface/genre-return.interface';

@Injectable()
export class JikanService {
  private logger: Logger = new Logger(JikanService.name);
  private base_url = process.env.JINKAN_BASE_URL ?? 'https://api.jikan.moe/v4';
  private readonly agent: Agent;

  constructor() {
    this.agent = new Agent({
      lookup: (hostname, options, callback) => {
        return dns.lookup(hostname, { ...options, family: 4 }, callback);
      },
    });
  }

  async getSeasonAnime(limit: number = 3): Promise<Season[]> {
    try {
      if (isNaN(limit)) {
        throw new HttpException(
          'Limit must be a number',
          HttpStatus.BAD_REQUEST,
        );
      }

      const response: AxiosResponse<ISeasonNow> = await axios.get(
        `${this.base_url}/seasons/now?limit=${limit}`,
        {
          headers: { accept: 'application/json' },
          timeout: 60_000,
          httpsAgent: this.agent,
        },
      );

      if (!response.data) {
        throw new HttpException(
          'Error fetching season anime',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }

      return response.data.data;
    } catch (error: any) {
      this.logger.error(
        `[getSeasonAnime] Error get anime ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Error fetching season anime',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getPopularRecomendation(limit: number = 10): Promise<Tops[]> {
    try {
      if (isNaN(limit)) {
        throw new HttpException(
          'Limit must be a number',
          HttpStatus.BAD_REQUEST,
        );
      }

      const response: AxiosResponse<IPopularAnime> = await axios.get(
        `${this.base_url}/top/anime?limit=${limit}`,
        {
          headers: { accept: 'application/json' },
          timeout: 60_000,
          httpsAgent: this.agent,
        },
      );

      if (!response.data) {
        throw new HttpException(
          'Error fetching popular anime recommendation',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }

      return response.data.data;
    } catch (error: any) {
      this.logger.error(
        `[getPopularRecomendation] Error get anime ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Error fetching season anime',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getAnimeByGenre(filter: IGenreAnimeFilter): Promise<GenreReturn> {
    try {
      if (isNaN(Number(filter.limit))) {
        throw new HttpException(
          'Limit must be a number',
          HttpStatus.BAD_REQUEST,
        );
      }
      if (filter.page && isNaN(Number(filter.page))) {
        throw new HttpException(
          'Page must be a number',
          HttpStatus.BAD_REQUEST,
        );
      }

      let url = `${this.base_url}/anime?genres=${filter.genreId}&order_by=${filter.order_by ?? 'score'}&sort=${filter.sort ?? 'desc'}&limit=${filter.limit ?? '12'}&sfw=true&page=${filter.page ?? 1}`;
      if (filter.year) {
        url += `&start_date=${filter.year}-01-01&end_date=${filter.year}-12-31`;
      }

      const response: AxiosResponse<IGenreSorted> = await axios.get(url, {
        headers: { accept: 'application/json' },
        timeout: 60_000,
        httpsAgent: this.agent,
      });

      if (!response.data) {
        throw new HttpException(
          'Error fetching explore anime recommendation',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
      return {
        length: response.data.pagination.items.total,
        animes: response.data.data,
      };
    } catch (error: any) {
      this.logger.error(
        `[getAnimeByGenre] Error get anime ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Error fetching season anime',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getAnimeByName(name: string, page: number = 1): Promise<Quered[]> {
    try {
      if (!name?.trim()) {
        throw new HttpException('Name is required', HttpStatus.BAD_REQUEST);
      }
      if (isNaN(page) || page < 1) {
        throw new HttpException(
          'Page must be a positive number',
          HttpStatus.BAD_REQUEST,
        );
      }

      const response: AxiosResponse<IAnimeQuery> = await axios.get(
        `${this.base_url}/anime?q=${encodeURIComponent(name)}&sfw=true&page=${page}`,
        {
          headers: { accept: 'application/json' },
          timeout: 60_000,
          httpsAgent: this.agent,
        },
      );

      if (!response.data) {
        throw new HttpException(
          'Error fetching anime by name',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }

      return response.data.data;
    } catch (error: any) {
      this.logger.error(
        `[getAnimeByName] Error get anime ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Error fetching season anime',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getAnimeDetailsById(id: number): Promise<AnimeDetails> {
    try {
      if (isNaN(id) || id <= 0) {
        throw new HttpException(
          'Id must be a positive number',
          HttpStatus.BAD_REQUEST,
        );
      }

      const response: AxiosResponse<IFullAnime> = await axios.get(
        `${this.base_url}/anime/${id}/full`,
        {
          headers: { accept: 'application/json' },
          timeout: 60_000,
          httpsAgent: this.agent,
        },
      );

      if (!response.data) {
        throw new HttpException(
          'Error fetching anime details by id',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }

      return response.data.data;
    } catch (error: any) {
      this.logger.error(
        `[getAnimeDetailsById] Error get anime ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Error fetching season anime',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getSimilarAnime(id: number): Promise<Quered[]> {
    try {
      if (isNaN(id) || id <= 0) {
        throw new HttpException(
          'Id must be a positive number',
          HttpStatus.BAD_REQUEST,
        );
      }

      const response: AxiosResponse<IAnimeQuery> = await axios.get(
        `${this.base_url}/anime/${id}/recommendations`,
        {
          headers: { accept: 'application/json' },
          timeout: 60_000,
          httpsAgent: this.agent,
        },
      );

      if (!response.data) {
        throw new HttpException(
          'Error fetching similar anime',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }

      return response.data.data;
    } catch (error: any) {
      this.logger.error(
        `[getSimilarAnime] Error get anime ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Error fetching season anime',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
