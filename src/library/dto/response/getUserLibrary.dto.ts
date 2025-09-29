import { AnimeStatus } from '../../../jikan/interface/anime-status.interface';

export class GetUserLibraryResponseDto {
  user_uid!: string;
  mal_id!: number;
  title!: string;
  media_type!: string;
  season?: string;
  image_url!: string;
  year?: number;
  status!: typeof AnimeStatus;
}
