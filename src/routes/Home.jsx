import { useState, useEffect } from 'react';
import { Loading } from '../components/Loading';
import { Movie } from '../components/Movie';

export const Home = () => {
  const [loading, setLoading] = useState(true);
  const [movies, setMovies] = useState([]);

  const getMovies = async () => {
    const res = await fetch(`https://yts.mx/api/v2/list_movies.json?minimum_rating=8.5&sort_by=year`);
    const data = await res.json();
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
        <h2>🍿MOVIE INFORMATION🍿</h2>
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
