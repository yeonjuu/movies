import { Link } from 'react-router-dom';

export const Movie = ({ id, coverImg, title, summary, genres }) => {
  const handleImage = (e) => {
    e.target.src = './placeholder.png';
  };
  return (
    <div className="movie" style={{ cursor: 'hand' }}>
      <div className="top">
        <h2>{title}</h2>
      </div>
      <div className="bottom">
        <img className="cover-img" src={coverImg} alt={`${title} 포스터`} onError={handleImage} />
        {/* <img className="cover-img" src="./placeholder.png" alt={`${title} 포스터`} /> */}
        <div className="movie-info">
          <div className="summary">
            {summary.length > 400 ? `${summary.slice(0, 400)}...` : summary || 'Now, this movie does not have summary'}
          </div>
          <ul className="genre-wrapper">
            <span>Genre</span>
            {genres.map((g) => (
              <li key={g} className="genre">
                {g}
              </li>
            ))}
          </ul>
          <Link to={`/detail/${id}`}>
            <div>👉🏻 More Detail</div>
          </Link>
        </div>
      </div>
    </div>
  );
};
