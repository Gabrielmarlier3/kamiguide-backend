import { IsIn } from 'class-validator';

//uncomment the line active the category
export const GENRES = [
  'Action',
  // 'Adventure',
  // 'Avant Garde',
  // 'Award Winning',
  // 'Boys Love',
  'Comedy',
  // 'Drama',
  'Fantasy',
  // 'Girls Love',
  // 'Gourmet',
  // 'Horror',
  // 'Mystery',
  'Romance',
  // 'Sci-Fi',
  'Slice of Life',
  // 'Sports',
  // 'Supernatural',
  'Suspense',
  // 'Ecchi',
  // 'Erotica',
  // 'Hentai',
  // 'Adult Cast',
  // 'Anthropomorphic',
  // 'CGDCT',
  // 'Childcare',
  // 'Combat Sports',
  // 'Crossdressing',
  // 'Delinquents',
  // 'Detective',
  // 'Educational',
  // 'Gag Humor',
  // 'Gore',
  // 'Harem',
  // 'High Stakes Game',
  // 'Historical',
  // 'Idols (Female)',
  // 'Idols (Male)',
  // 'Isekai',
  // 'Iyashikei',
  // 'Love Polygon',
  // 'Magical Sex Shift',
  // 'Mahou Shoujo',
  // 'Martial Arts',
  // 'Mecha',
  // 'Medical',
  // 'Military',
  // 'Music',
  // 'Mythology',
  // 'Organized Crime',
  // 'Otaku Culture',
  // 'Parody',
  // 'Performing Arts',
  // 'Pets',
  // 'Psychological',
  // 'Racing',
  // 'Reincarnation',
  // 'Reverse Harem',
  // 'Love Status Quo',
  // 'Samurai',
  // 'School',
  // 'Showbiz',
  // 'Space',
  // 'Strategy Game',
  // 'Super Power',
  // 'Survival',
  // 'Team Sports',
  // 'Time Travel',
  // 'Vampire',
  // 'Video Game',
  // 'Visual Arts',
  // 'Workplace',
  // 'Urban Fantasy',
  // 'Villainess',
  // 'Josei',
  // 'Kids',
  // 'Seinen',
  // 'Shoujo',
  // 'Shounen',
] as const;

export type Genre = (typeof GENRES)[number];

export class GenreSearchDto {
  @IsIn(GENRES)
  genre: Genre;
  page?: number = 1;
}

export class GenreTabDto {
  mal_id: number;
  title: string;
  image_url: string;
  score: number;
  season: string;
  status: string;
  type: string;
  year: number;
}
