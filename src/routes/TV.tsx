import { useQuery } from 'react-query';
import { AllTvShows, ContentCategory, getAllTvShows, ITvShow } from '../api';
import { AnimatePresence } from 'motion/react';
import React from 'react';
import { ContentModal } from '../components/ContentModal';
import { ContentSlider } from '../components/ContentSlider';
import { makeImagePath } from '../utils';
import { Wrapper, Banner, Title, FlexBox, SliderWrapper, SliderTitle, Loader } from './Common';
import { useMatch, useNavigate } from 'react-router-dom';

const TitleMap: Record<ContentCategory, string> = {
  popular: '실시간 인기 TV 프로그램',
  trending: '실시간 트렌드 TV 프로그램',
  airingToday: '오늘 방영 중인 TV 프로그램',
  topRated: '역대 최고 평점 TV 프로그램',
};

export function TV() {
  const { data, isLoading } = useQuery<AllTvShows>(['all', 'tv'], getAllTvShows);
  const navigate = useNavigate();
  const tvPathMatch = useMatch('/tv/:tvId');

  const onBoxClicked = (tvId: number) => {
    navigate(`/tv/${tvId}`);
  };

  if (isLoading || !data) {
    return (
      <Wrapper>
        <Loader>Loading...</Loader>
      </Wrapper>
    );
  }

  const randomIndex = Math.floor(Math.random() * data.trending.length);
  const headTvSeries = data.trending[randomIndex];
  data.trending = [...data.trending.slice(randomIndex), ...data.trending.slice(0, randomIndex)];

  const tvId = tvPathMatch?.params.tvId;
  const clickedTv =
    Object.values(data)
      .flat()
      .find((tv) => tv.id === Number(tvId)) || null;

  return (
    <Wrapper>
      <Banner bgPhoto={makeImagePath(headTvSeries.backdrop_path || '')}>
        <Title>{headTvSeries.name}</Title>
      </Banner>
      <FlexBox>
        {data &&
          Object.entries(data).map(([key, value]: [string, ITvShow[]]) => {
            return (
              <React.Fragment key={key}>
                <SliderWrapper>
                  <SliderTitle>{TitleMap[key as keyof typeof TitleMap]}</SliderTitle>
                  <ContentSlider data={[key, value]} onBoxClicked={onBoxClicked} haveRanking={key === 'popular'} />
                </SliderWrapper>
              </React.Fragment>
            );
          })}
      </FlexBox>
      <AnimatePresence>
        <ContentModal clicked={clickedTv} />
      </AnimatePresence>
    </Wrapper>
  );
}
