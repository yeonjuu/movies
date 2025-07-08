import { useQuery } from 'react-query';
import { AllMovies, getAllMovies, IMovie } from '../api';
import { AnimatePresence } from 'motion/react';
import { makeImagePath } from '../utils';
import { PathMatch, useMatch, useNavigate } from 'react-router-dom';
import { ContentSlider } from '../components/ContentSlider';
import { ContentModal } from '../components/ContentModal';
import React from 'react';
import { Wrapper, Loader, Banner, Title, FlexBox, SliderWrapper, SliderTitle } from './Common';

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
        <ContentModal clicked={clickedMovie} />
      </AnimatePresence>
    </Wrapper>
  );
};
