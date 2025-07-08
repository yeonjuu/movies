const API_KEY = process.env.REACT_APP_TMDB_API_KEY || '';

if (!API_KEY) {
  throw new Error('REACT_APP_TMDB_API_KEY is not defined');
}

const BASE_URL = 'https://api.themoviedb.org/3';
const MOVIE_BASE_URL = 'https://api.themoviedb.org/3/movie';
const TV_BASE_URL = 'https://api.themoviedb.org/3/tv';

const REGION = 'ko-KR'; // 한국 영화 데이터

const options = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: `Bearer ${API_KEY}`,
  },
};

export interface IPaginatedResponse<T> {
  page: number;
  results: T[];
  total_pages: number;
  total_results: number;
}

export interface IMovie {
  adult: boolean;
  backdrop_path: string;
  genre_ids: number[];
  id: number;
  original_language: string;
  original_title: string;
  overview: string;
  popularity: number;
  poster_path: string;
  release_date: string;
  title: string;
  video: boolean;
  vote_average: number;
  vote_count: number;
}

export interface IProductionCompany {
  id: number;
  logo_path: string | null;
  name: string;
  origin_country: string;
}

export interface IProductionCountry {
  iso_3166_1: string;
  name: string;
}

export interface ISpokenLanguage {
  english_name: string;
  iso_639_1: string;
  name: string;
}

export interface IMovieDetails extends IMovie {
  belongs_to_collection: null | object;
  budget: number;
  genres: IGenre[];
  homepage: string;
  imdb_id: string;
  origin_country: string[];
  production_companies: IProductionCompany[];
  production_countries: IProductionCountry[];
  revenue: number;
  runtime: number;
  spoken_languages: ISpokenLanguage[];
  status: string;
  tagline: string;
}

export interface ITvShow {
  backdrop_path: string;
  first_air_date: string;
  genre_ids: number[];
  id: number;
  name: string;
  origin_country: string[];
  original_language: string;
  original_name: string;
  overview: string;
  popularity: number;
  poster_path: string;
  vote_average: number;
  vote_count: number;
  adult: boolean;
}

export interface ITrendingTvShow extends ITvShow {
  media_type: string;
}

// 상영중인 영화 응답 타입
export interface INowPlayingResponse extends IPaginatedResponse<IMovie> {
  dates: {
    maximum: string;
    minimum: string;
  };
}

// 인기 영화 응답 타입
export type IPopularMovieResponse = IPaginatedResponse<IMovie>;
export type ITvShowResponse = IPaginatedResponse<ITvShow>;
export type ITrendingTvShowResponse = IPaginatedResponse<ITrendingTvShow>;

// 영화
export async function getMovies(): Promise<INowPlayingResponse> {
  const response = await fetch(`${MOVIE_BASE_URL}/now_playing?language=${REGION}&page=1`, options);
  return await response.json();
}

export async function getPopularMovies(): Promise<IPopularMovieResponse> {
  const response = await fetch(`${MOVIE_BASE_URL}/popular?language=${REGION}&page=1`, options);
  return await response.json();
}

export async function getUpcomingMovies(): Promise<INowPlayingResponse> {
  const response = await fetch(`${MOVIE_BASE_URL}/upcoming?language=${REGION}&page=1`, options);
  return await response.json();
}

export async function getTopRatedMovies(): Promise<IPopularMovieResponse> {
  const response = await fetch(`${MOVIE_BASE_URL}/top_rated?language=${REGION}&page=1`, options);
  return await response.json();
}

export type MovieCategory = 'nowPlaying' | 'popular' | 'upcoming' | 'topRated';

export type AllMovies = Record<MovieCategory, IMovie[]>;

export async function getAllMovies(): Promise<AllMovies> {
  const [nowPlaying, popular, upcoming, topRated] = await Promise.all([
    getMovies(),
    getPopularMovies(),
    getUpcomingMovies(),
    getTopRatedMovies(),
  ]);

  return {
    nowPlaying: nowPlaying.results,
    popular: popular.results,
    upcoming: upcoming.results,
    topRated: topRated.results,
  };
}

export async function getMovieDetails(movieId: number): Promise<IMovieDetails> {
  const response = await fetch(`${MOVIE_BASE_URL}/${movieId}?language=${REGION}`, options);
  if (!response.ok) {
    throw new Error(`Failed to fetch movie details for ID ${movieId}`);
  }
  return await response.json();
}

// TV Shows
export async function getPopularTvShows(): Promise<ITvShowResponse> {
  const response = await fetch(`${TV_BASE_URL}/popular?language=${REGION}&page=1`, options);
  return await response.json();
}

export async function getTrendingTvShows(): Promise<ITrendingTvShowResponse> {
  const response = await fetch(`${BASE_URL}/trending/tv/day?language=${REGION}`, options);
  return await response.json();
}

//tv/airing_today?language=en-US&page=1';
export async function getAiringTodayTvShows(): Promise<ITvShowResponse> {
  const response = await fetch(`${TV_BASE_URL}/airing_today?language=${REGION}&page=1`, options);
  return await response.json();
}

///tv/top_rated?language=en-US&page=1';
export async function getTopRatedTvShows(): Promise<ITvShowResponse> {
  const response = await fetch(`${TV_BASE_URL}/top_rated?language=${REGION}&page=1`, options);
  return await response.json();
}

export type ContentCategory = 'popular' | 'trending' | 'airingToday' | 'topRated';

export type AllTvShows = Record<ContentCategory, ITvShow[]>;

export async function getAllTvShows(): Promise<AllTvShows> {
  const [popular, trending, airingToday, topRated] = await Promise.all([
    getPopularTvShows(),
    getTrendingTvShows(),
    getAiringTodayTvShows(),
    getTopRatedTvShows(),
  ]);

  if (!popular.results || !trending.results || !airingToday.results || !topRated.results) {
    throw new Error('Failed to fetch TV shows');
  }

  return {
    popular: popular.results,
    trending: trending.results,
    airingToday: airingToday.results,
    topRated: topRated.results,
  };
}

interface IGenre {
  id: number;
  name: string;
}

//'https://api.themoviedb.org/3/genre/tv/list?language=en'
// 한개의 장르를 쓰는거 같음
// 각자 받아서 중복제거하고 하나로 통일
export async function getGenres(): Promise<IGenre[]> {
  const [movie, tv] = await Promise.all([
    fetch(`${BASE_URL}/genre/movie/list?language=${REGION}`, options),
    fetch(`${BASE_URL}/genre/tv/list?language=${REGION}`, options),
  ]);
  const [movieData, tvData] = await Promise.all([movie.json(), tv.json()]);

  if (!movieData.genres || !tvData.genres) {
    throw new Error('Failed to fetch genres');
  }
  // 중복 제거를 위해 Set을 사용하여 id를 기준으로 고유한 장르만 남김
  const uniqueGenres = new Map<number, IGenre>();

  [...movieData.genres, ...tvData.genres].forEach((genre) => {
    if (!uniqueGenres.has(genre.id)) {
      uniqueGenres.set(genre.id, genre);
    }
  });
  return Array.from(uniqueGenres.values());
}
