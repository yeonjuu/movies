import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Loading } from '../components/Loading';
import style from './Detail.module.css';
import Rating from '@mui/material/Rating';
import StarIcon from '@mui/icons-material/Star';

export const Detail = () => {
  const [loading, setLoading] = useState(true);
  const [movieInfo, setMovieInfo] = useState('');
  const { id } = useParams();

  const getMovie = async () => {
    const res = await fetch(`https://yts.mx/api/v2/movie_details.json?movie_id=${id}`);
    const data = await res.json();
    setMovieInfo(data.data.movie);
    setLoading(false);
  };

  useEffect(() => {
    getMovie();
  }, []);

  return (
    <>
      {loading ? (
        <Loading />
      ) : (
        <div className={style.detail}>
          <h1 className={style.title}>{movieInfo.title}</h1>
          <div className={style.flex}>
            <img
              src={movieInfo.medium_cover_image}
              alt={movieInfo.title}
              onError={(e) => {
                e.target.src = './placeholder.png';
              }}
              className="movie-img"
            />
            <div>{movieInfo.description_full}</div>
          </div>
          <div>
            <h3>INFORMATION</h3>
            <span>Year {movieInfo.year}</span>
            <br />
            <span>{movieInfo.like_count} likes</span>
            <br />
            <span>Rate {movieInfo.rating}</span>
            <br />
            <Rating
              name="read-only"
              value={movieInfo.rating / 2}
              precision={0.5}
              emptyIcon={<StarIcon style={{ color: '#ffffff' }} />}
              readOnly
            />
            <br />
          </div>
          <div>Genre</div>
          <ul className={style.genre}>
            {movieInfo.genres.map((g) => (
              <li key={g}>{g}</li>
            ))}
          </ul>
        </div>
      )}
    </>
  );
};
