export interface IMovie {
  id: number;
  medium_cover_image: string;
  title: string;
  summary: string;
  genres: string[];
}

export interface IMovieDetail extends IMovie {
  rating: number;
  year: number;
  description_full: string;
  like_count: number;
  runtime: number;
}
