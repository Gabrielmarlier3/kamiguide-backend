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
import { IScheculeInterface } from './interface/schedule.interface';
import { ScheduleFilter } from './interface/scheduleFilter.interface';

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

  async getSeasonAnime(limit: number): Promise<Season[]> {
    try {
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

  async getPopularRecomendation(limit: number): Promise<Tops[]> {
    try {
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

  async getAnimeByGenre(filter: IGenreAnimeFilter): Promise<IGenreSorted> {
    try {
      const params = new URLSearchParams({
        genres: filter.genreId.toString(),
        order_by: filter.order_by ?? 'score',
        sort: filter.sort ?? 'desc',
        limit: (filter.limit ?? 12).toString(),
        sfw: 'true',
        page: (filter.page ?? 1).toString(),
      });

      if (filter.year) {
        params.append('start_date', `${filter.year}-01-01`);
        params.append('end_date', `${filter.year}-12-31`);
      }

      const url = `${this.base_url}/anime?${params.toString()}`;
      const response: AxiosResponse<IGenreSorted> = await axios.get(url, {
        headers: { accept: 'application/json' },
        timeout: 60_000,
        httpsAgent: this.agent,
      });

      if (!response.data) {
        throw new HttpException(
          'Error fetching anime by genre',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
      return response.data;
    } catch (error: any) {
      if (axios.isAxiosError(error) && error?.response?.status === 429) {
        return {
          pagination: {
            current_page: 1,
            has_next_page: false,
            items: {
              count: 0,
              total: 0,
              per_page: filter.limit ?? 12,
            },
            last_visible_page: 1,
          },
          data: [],
        };
      }
      this.logger.error(
        `Error while fetching anime by genre with filter: ${JSON.stringify(filter)} - ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Error fetching anime by genre',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getAnimeByName(
    name: string,
    page: number,
    limit: number,
  ): Promise<IAnimeQuery> {
    try {
      const params = new URLSearchParams({
        q: name,
        sfw: 'true',
        page: page.toString(),
        limit: limit.toString(),
      });

      const url = `${this.base_url}/anime?${params.toString()}`;

      const response: AxiosResponse<IAnimeQuery> = await axios.get(url, {
        headers: { accept: 'application/json' },
        timeout: 60_000,
        httpsAgent: this.agent,
      });

      if (!response.data) {
        throw new HttpException(
          'Error fetching anime by name',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }

      return response.data;
    } catch (error: any) {
      this.logger.error(
        `[getAnimeByName] Error get anime ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Error fetching anime by name',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getAnimeDetailsById(id: number): Promise<AnimeDetails> {
    try {
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

  async getSchedule(
    filter: ScheduleFilter,
  ): Promise<IScheculeInterface | null> {
    try {
      const params = new URLSearchParams({
        sfw: 'true',
        limit: '25',
      });

      if (filter.day) {
        params.append('filter', filter.day);
      }

      if (filter.page) {
        params.append('page', filter.page.toString());
      }

      const url = `${this.base_url}/schedules?${params.toString()}`;
      const response: AxiosResponse<IScheculeInterface> = await axios.get(url, {
        headers: { accept: 'application/json' },
        timeout: 60_000,
        httpsAgent: this.agent,
      });
      if (!response.data) {
        throw new HttpException(
          'Error fetching schedule anime',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
      return response.data;
    } catch (error: any) {
      if (axios.isAxiosError(error) && error?.response?.status === 429) {
        return null;
      }
      this.logger.error(
        `[getSchedule] Error get anime ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Error fetching schedule anime',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
