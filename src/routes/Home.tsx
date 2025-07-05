import { useQuery } from 'react-query';
import { getAll, IMovie, ITrendingTvShow, ITvShow } from '../api';
import styled from 'styled-components';
import { AnimatePresence } from 'motion/react';
import { makeImagePath } from '../utils';
import { PathMatch, useMatch, useNavigate } from 'react-router-dom';
import { ContentSlider } from '../components/ContentSlider';
import { ContentModal } from '../components/ContentModal';

export const Home = () => {
  const navigate = useNavigate();
  const moviePathMatch: PathMatch<string> | null = useMatch('/movies/:movieId');
  const { data, isLoading } = useQuery<{ movies: IMovie[]; tvShows: ITvShow[]; trendingTvShows: ITrendingTvShow[] }>(
    'all',
    getAll,
  );

  const onBoxClicked = (movieId: number) => {
    navigate(`/movies/${movieId}`);
  };

  const { movies, tvShows, trendingTvShows } = data || {};

  if (isLoading || !movies || !tvShows || !trendingTvShows) {
    return (
      <Wrapper>
        <Loader>Loading...</Loader>
      </Wrapper>
    );
  }

  const allData = [...movies, ...tvShows, ...trendingTvShows];

  const movieId = moviePathMatch?.params.movieId;
  const clickedMovie = allData.find((movie) => movie.id.toString() === movieId) ?? null;

  const dataTitle = {
    movies: '실시간 인기 영화',
    tvShows: '실시간 인기 TV 프로그램',
    trendingTvShows: '실시간 인기 트렌딩 TV 프로그램',
  };

  return (
    <Wrapper>
      {isLoading ? (
        <Loader>Loading...</Loader>
      ) : (
        <>
          <Banner bgPhoto={makeImagePath(movies[0].backdrop_path || '')}>
            <Title>{movies[0].title}</Title>
          </Banner>
          <div>
            {data &&
              Object.entries(data).map(([key, value]: [any, IMovie[] | ITvShow[] | ITrendingTvShow[]]) => (
                <div key={key}>
                  <SliderTitle>{dataTitle[key as keyof typeof dataTitle]}</SliderTitle>
                  <ContentSlider type={key} data={value} onBoxClicked={onBoxClicked} />
                </div>
              ))}
          </div>
          <AnimatePresence>
            <ContentModal clickedMovie={clickedMovie} />
          </AnimatePresence>
        </>
      )}
    </Wrapper>
  );
};

interface BannerProps extends React.HTMLAttributes<HTMLDivElement> {
  bgPhoto: string;
}

const Wrapper = styled.div`
  background: black;
  padding-bottom: 200px;
`;

const Loader = styled.div`
  height: 20vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Banner = styled.div<BannerProps>`
  height: 80vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 60px;
  background-image: linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 1)), url(${(props) => props.bgPhoto});
  background-size: cover;
`;

const Title = styled.h2`
  font-size: 68px;
  color: ${(props) => props.theme.white.lighter};
  font-weight: 500;
`;

const SliderTitle = styled.h2`
  font-size: 30px;
  margin: 20px 0;
  color: ${(props) => props.theme.white.lighter};
  text-align: center;
  font-weight: bold;
  text-transform: uppercase;
  letter-spacing: 2px;
  position: relative;
  &::after {
    content: '';
    position: absolute;
    width: 100px;
    height: 3px;
    background-color: ${(props) => props.theme.red};
    bottom: -10px;
    left: 50%;
    transform: translateX(-50%);
  }
`;
