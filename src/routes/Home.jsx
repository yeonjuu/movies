import { useState, useEffect } from 'react';
import { Loading } from '../components/Loading';
import { Movie } from '../components/Movie';

export const Home = () => {
  const [loading, setLoading] = useState(true);
  const [movies, setMovies] = useState([]);

  const getMovies = async () => {
    const res = await fetch(`https://yts.mx/api/v2/list_movies.json?minimum_rating=9.0&sort_by=year`);
    const data = await res.json();
    console.log(data.data.movies);
    setMovies(data.data.movies);
    setLoading(false);
  };

  useEffect(() => {
    getMovies();
  }, []);

  return (
    <>
      {loading ? <Loading /> : null}
      <div>
        {movies.map((movie) => {
          return (
            <Movie
              key={movie.id}
              id={movie.id}
              coverImg={movie.medium_cover_image}
              title={movie.title}
              summary={movie.summary}
              genres={movie.genres}
            />
          );
        })}
      </div>
    </>
  );
};
