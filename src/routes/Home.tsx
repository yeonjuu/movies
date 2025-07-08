import { useQuery } from 'react-query';
import { AllMovies, getAllMovies, IMovie } from '../api';
import styled from 'styled-components';
import { AnimatePresence } from 'motion/react';
import { makeImagePath } from '../utils';
import { PathMatch, useMatch, useNavigate } from 'react-router-dom';
import { ContentSlider } from '../components/ContentSlider';
import { ContentModal } from '../components/ContentModal';
import React from 'react';

export const Home = () => {
  const navigate = useNavigate();
  const moviePathMatch: PathMatch<string> | null = useMatch('/movies/:movieId');
  const { data, isLoading } = useQuery<AllMovies>(['all', 'movies'], getAllMovies);

  const onBoxClicked = (movieId: number) => {
    navigate(`/movies/${movieId}`);
  };

  if (isLoading || !data) {
    return (
      <Wrapper>
        <Loader>Loading...</Loader>
      </Wrapper>
    );
  }

  //titleMovie는 nowPlaying, pupular, topRated 중 랜덤으로 하나
  const randomIndex = Math.floor(Math.random() * data.popular.length);
  const titleMovie = data.popular[randomIndex];
  data.popular = [...data.popular.slice(randomIndex), ...data.popular.slice(0, randomIndex)];
  //topRated에서 첫 번째 영화만 titleMovie로 설정하고 나머지는 restTopRated에 저장
  //이렇게 하면 topRated의 첫 번째 영화가 항상 titleMovie로 설정되고, 나머지 영화들은 restTopRated에 저장됩니다.
  //이후에 titleMovie를 배너에 사용하고, restTopRated을 슬라이더에 사용합니다.
  //이렇게 하면 매번 랜덤으로 영화가 바뀌면서도, 첫 번째 영화는 항상 배너에 표시됩니다.

  const movieId = moviePathMatch?.params.movieId;

  const clickedMovie =
    Object.values(data)
      .flat()
      .find((movie) => movie.id === Number(movieId)) || null;

  type ITitle = 'nowPlaying' | 'popular' | 'upcoming' | 'topRated';

  const dataTitle: Record<ITitle, string> = {
    nowPlaying: '실시간 상영 중인 영화',
    popular: '실시간 인기 영화',
    upcoming: '실시간 개봉 예정 영화',
    topRated: '역대 최고 평점 영화',
  };

  return (
    <Wrapper>
      <Banner bgPhoto={makeImagePath(titleMovie.backdrop_path || '')}>
        <Title>{titleMovie.title}</Title>
      </Banner>
      <FlexBox>
        {data &&
          Object.entries(data).map(([key, value]: [string, IMovie[]]) => {
            return (
              <React.Fragment key={key}>
                <SliderWrapper>
                  <SliderTitle>{dataTitle[key as keyof typeof dataTitle]}</SliderTitle>
                  <ContentSlider data={[key, value]} onBoxClicked={onBoxClicked} haveRanking={key === 'popular'} />
                </SliderWrapper>
              </React.Fragment>
            );
          })}
      </FlexBox>
      <AnimatePresence>
        <ContentModal clickedMovie={clickedMovie} />
      </AnimatePresence>
    </Wrapper>
  );
};

interface BannerProps extends React.HTMLAttributes<HTMLDivElement> {
  bgPhoto: string;
}

const FlexBox = styled.div`
  display: flex;
  flex-direction: column;
`;
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

const SliderWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;
