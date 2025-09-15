export enum AnimeGenreId {
  Action = 1,
  Adventure = 2,
  AvantGarde = 5,
  AwardWinning = 46,
  BoysLove = 28,
  Comedy = 4,
  Drama = 8,
  Fantasy = 10,
  GirlsLove = 26,
  Gourmet = 47,
  Horror = 14,
  Mystery = 7,
  Romance = 22,
  SciFi = 24,
  SliceOfLife = 36,
  Sports = 30,
  Supernatural = 37,
  Suspense = 41,
  Ecchi = 9,
  Erotica = 49,
  Hentai = 12,
  AdultCast = 50,
  Anthropomorphic = 51,
  CGDCT = 52,
  Childcare = 53,
  CombatSports = 54,
  Crossdressing = 81,
  Delinquents = 55,
  Detective = 39,
  Educational = 56,
  GagHumor = 57,
  Gore = 58,
  Harem = 35,
  HighStakesGame = 59,
  Historical = 13,
  IdolsFemale = 60,
  IdolsMale = 61,
  Isekai = 62,
  Iyashikei = 63,
  LovePolygon = 64,
  MagicalSexShift = 65,
  MahouShoujo = 66,
  MartialArts = 17,
  Mecha = 18,
  Medical = 67,
  Military = 38,
  Music = 19,
  Mythology = 6,
  OrganizedCrime = 68,
  OtakuCulture = 69,
  Parody = 20,
  PerformingArts = 70,
  Pets = 71,
  Psychological = 40,
  Racing = 3,
  Reincarnation = 72,
  ReverseHarem = 73,
  LoveStatusQuo = 74,
  Samurai = 21,
  School = 23,
  Showbiz = 75,
  Space = 29,
  StrategyGame = 11,
  SuperPower = 31,
  Survival = 76,
  TeamSports = 77,
  TimeTravel = 78,
  Vampire = 32,
  VideoGame = 79,
  VisualArts = 80,
  Workplace = 48,
  UrbanFantasy = 82,
  Villainess = 83,
  Josei = 43,
  Kids = 15,
  Seinen = 42,
  Shoujo = 25,
  Shounen = 27,
}

export interface IGenreSorted {
  pagination: Pagination;
  data: Genre[];
}

export interface Pagination {
  last_visible_page: number;
  has_next_page: boolean;
  current_page: number;
  items: Items;
}

export interface Items {
  count: number;
  total: number;
  per_page: number;
}

export interface Genre {
  mal_id: number;
  url: string;
  images: Images;
  trailer: Trailer;
  approved: boolean;
  titles: Title[];
  title: string;
  title_english?: string;
  title_japanese: string;
  title_synonyms: string[];
  type: string;
  source: string;
  episodes: number;
  status: string;
  airing: boolean;
  aired: Aired;
  duration: string;
  rating: string;
  score: number;
  scored_by: number;
  rank: number;
  popularity: number;
  members: number;
  favorites: number;
  synopsis: string;
  background: string;
  season?: string;
  year?: number;
  broadcast: Broadcast;
  producers: Producer[];
  licensors: Licensor[];
  studios: Studio[];
  genres: Genre[];
  explicit_genres: any[];
  themes: Theme[];
  demographics: Demographic[];
}

export interface Images {
  jpg: Jpg;
  webp: Webp;
}

export interface Jpg {
  image_url: string;
  small_image_url: string;
  large_image_url: string;
}

export interface Webp {
  image_url: string;
  small_image_url: string;
  large_image_url: string;
}

export interface Trailer {
  youtube_id?: string;
  url?: string;
  embed_url?: string;
  images: Images2;
}

export interface Images2 {
  image_url?: string;
  small_image_url?: string;
  medium_image_url?: string;
  large_image_url?: string;
  maximum_image_url?: string;
}

export interface Title {
  type: string;
  title: string;
}

export interface Aired {
  from: string;
  to?: string;
  prop: Prop;
  string: string;
}

export interface Prop {
  from: From;
  to: To;
}

export interface From {
  day: number;
  month: number;
  year: number;
}

export interface To {
  day?: number;
  month?: number;
  year?: number;
}

export interface Broadcast {
  day?: string;
  time?: string;
  timezone?: string;
  string?: string;
}

export interface Producer {
  mal_id: number;
  type: string;
  name: string;
  url: string;
}

export interface Licensor {
  mal_id: number;
  type: string;
  name: string;
  url: string;
}

export interface Studio {
  mal_id: number;
  type: string;
  name: string;
  url: string;
}

export interface Genre {
  mal_id: number;
  type: string;
  name: string;
  url: string;
}

export interface Theme {
  mal_id: number;
  type: string;
  name: string;
  url: string;
}

export interface Demographic {
  mal_id: number;
  type: string;
  name: string;
  url: string;
}
