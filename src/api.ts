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
}

export interface ITrendingTvShow {
  adult: boolean;
  backdrop_path: string;
  id: number;
  name: string;
  original_language: string;
  original_name: string;
  overview: string;
  poster_path: string;
  media_type: string;
  genre_ids: number[];
  popularity: number;
  first_air_date: string;
  vote_average: number;
  vote_count: number;
  origin_country: string[];
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
export type IPopularTvShowResponse = IPaginatedResponse<ITvShow>;
export type ITrendingTvShowResponse = IPaginatedResponse<ITrendingTvShow>;

export async function getMovies(): Promise<INowPlayingResponse> {
  const response = await fetch(`${MOVIE_BASE_URL}/now_playing?language=${REGION}&page=1`, options);
  return await response.json();
}

export async function getPopularMovies(): Promise<IPopularMovieResponse> {
  const response = await fetch(`${MOVIE_BASE_URL}/popular?language=${REGION}&page=1`, options);
  return await response.json();
}

export async function getUpcomingMovies(): Promise<IPaginatedResponse<IMovie>> {
  const response = await fetch(`${MOVIE_BASE_URL}/upcoming?language=${REGION}&page=1`, options);
  return await response.json();
}

export async function getPopularTvShows(): Promise<IPopularTvShowResponse> {
  const response = await fetch(`${TV_BASE_URL}/popular?language=${REGION}&page=1`, options);
  return await response.json();
}

export async function getTrendingTvShows(): Promise<ITrendingTvShowResponse> {
  const response = await fetch(`${BASE_URL}/trending/tv/day?language=${REGION}`, options);
  return await response.json();
}

// popular movies, tv shows, and trending tv shows get all data at once without pagination
export async function getAll(): Promise<{
  movies: IMovie[];
  tvShows: ITvShow[];
  trendingTvShows: ITrendingTvShow[];
}> {
  try {
    const [moviesRes, tvRes, trendingRes]: [IPopularMovieResponse, IPopularTvShowResponse, ITrendingTvShowResponse] =
      await Promise.all([getPopularMovies(), getPopularTvShows(), getTrendingTvShows()]);

    if (!moviesRes.results || !tvRes.results || !trendingRes.results) {
      throw new Error('One or more API responses are invalid');
    }

    return {
      movies: moviesRes.results,
      tvShows: tvRes.results,
      trendingTvShows: trendingRes.results,
    };
  } catch (err) {
    console.error('Failed to fetch all data:', err);
    throw err;
  }
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
