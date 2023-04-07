import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Loading } from '../components/Loading';

export const Detail = () => {
  const [loading, setLoading] = useState(true);
  const [movieInfo, setMovieInfo] = useState('');
  const { id } = useParams();

  const getMovie = async () => {
    const res = await fetch(`https://yts.mx/api/v2/movie_details.json?movie_id=${id}`);
    const data = await res.json();
    setMovieInfo(data.data.movie);
    setLoading(false);
    console.log(data.data.movie);
  };

  useEffect(() => {
    getMovie();
  }, []);

  return (
    <>
      {loading ? (
        <Loading />
      ) : (
        <div>
          <h1>{movieInfo.title}</h1>
          <img src={movieInfo.medium_cover_image} alt={movieInfo.title} />
          <div>{movieInfo.description_full}</div>
          <div>
            <h3>MOVIE INFO</h3>
            <span>{movieInfo.year}</span>
            <br />
            <span>{movieInfo.like_count} likes</span>
            <br />
            <span>{movieInfo.rating}</span>
            <br />
          </div>
          <ul>
            {movieInfo.genres.map((g) => (
              <li key={g}>{g}</li>
            ))}
          </ul>
        </div>
      )}
    </>
  );
};
