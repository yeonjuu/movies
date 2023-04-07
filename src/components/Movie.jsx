import { Link } from 'react-router-dom';

export const Movie = ({ id, coverImg, title, summary, genres }) => {
  return (
    <div>
      <h2>
        <Link to={`/detail/${id}`}>{title}</Link>
      </h2>
      <img src={coverImg} alt={`${title} 포스터`} />
      <div>{summary}</div>
      <ul>
        {genres.map((g) => (
          <li key={g}>{g}</li>
        ))}
      </ul>
    </div>
  );
};
