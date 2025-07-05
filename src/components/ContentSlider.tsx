import { IMovie, ITrendingTvShow, ITvShow } from '../api';
import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { makeImagePath } from '../utils';
import { offset } from '../constants';
import styled from 'styled-components';

interface IMovieProps {
  type: 'movies' | 'tvShows' | 'trendingTvShows';
  data: IMovie[] | ITvShow[] | ITrendingTvShow[];
  onBoxClicked: (movieId: number) => void;
}

const boxVariants = {
  normal: {
    scale: 1,
  },
  hover: {
    scale: 1.3,
    y: -80,
    transition: {
      delay: 0.5,
      duration: 0.1,
      type: 'tween',
    },
  },
};

const rowVariants = {
  hidden: {
    x: window.outerWidth + 5,
  },
  visible: {
    x: 0,
  },
  exit: {
    x: -window.outerWidth - 5,
  },
};

const infoVariants = {
  hover: {
    opacity: 1,
    transition: {
      delay: 0.5,
      duration: 0.1,
      type: 'tween',
    },
  },
};

//이름 추천
export const ContentSlider = ({ data, onBoxClicked }: IMovieProps) => {
  const [leaving, setLeaving] = useState(false);
  const [index, setIndex] = useState(0);
  const [disabled, setDisabled] = useState({
    left: false,
    right: false,
  });
  const maxIndex = data.length - offset; // offset * 6은 한 번에 보여줄 영화의 개수

  const toggleLeaving = () => setLeaving((prev) => !prev);

  const increaseIndex = () => {
    if (leaving) return;
    toggleLeaving();
    setIndex((prev) => (prev === maxIndex ? 0 : prev + 1));
  };

  const decreaseIndex = () => {
    if (data) {
      if (leaving) return;
      toggleLeaving();
      setIndex((prev) => (prev === 0 ? maxIndex : prev - 1));
    }
  };

  useEffect(() => {
    const isLeftDisabled = index === 0;
    const isRightDisabled = index === maxIndex;

    setDisabled({
      left: isLeftDisabled,
      right: isRightDisabled,
    });
  }, [index, maxIndex]);

  // 슬라이더 끝에 화살표 , increaseIndex 함수는 슬라이더의 인덱스를 증가시키는 역할을 합니다.
  return (
    <Slider>
      <AnimatePresence initial={false} onExitComplete={toggleLeaving}>
        <StyledButton className="left" onClick={decreaseIndex} key={`left-${index}`} disabled={disabled.left}>
          <LeftArrowSvg />
        </StyledButton>
        <StyledButton className="right" onClick={increaseIndex} key={`right-${index}`} disabled={disabled.right}>
          <RightArrowSvg />
        </StyledButton>
        <Row
          variants={rowVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          transition={{ type: 'tween', duration: 1 }}
        >
          {data
            .slice(
              index,
              index + offset, // offset * 6은 한 번에 보여줄 영화의 개수
            )
            .map((movie, i) => {
              const absoluteIndex = index + i;
              return (
                <Box
                  key={movie.id}
                  layoutId={movie.id.toString()}
                  bgPhoto={makeImagePath(movie.backdrop_path, 'w500')}
                  whileHover="hover"
                  initial="normal"
                  variants={boxVariants}
                  transition={{ type: 'tween' }}
                  onClick={() => onBoxClicked(movie.id)}
                >
                  <Ranking>
                    <span>{absoluteIndex + 1}</span>
                  </Ranking>
                  <Info variants={infoVariants}>
                    <h4>{'title' in movie ? movie.title : movie?.name}</h4>
                  </Info>
                </Box>
              );
            })}
        </Row>
      </AnimatePresence>
    </Slider>
  );
};

const Slider = styled.div`
  padding-left: 20px;
`;

const Row = styled(motion.div)`
  display: grid;
  gap: 30px;
  grid-template-columns: repeat(${offset}, 1fr);
  width: 100%;
`;

const Box = styled(motion.div).withConfig({
  shouldForwardProp: (prop) => prop !== 'bgPhoto',
})<{ bgPhoto: string }>`
  background-color: white;
  height: 250px;
  font-size: 66px;
  min-width: 190px;
  background-image: url(${(props) => props.bgPhoto});
  background-size: cover;
  background-position: center center;
  &:first-child {
    transform-origin: center left;
  }
  &:last-child {
    transform-origin: center right;
  }
`;

const Ranking = styled.div`
  color: ${(props) => props.theme.white.lighter};
  font-size: 60px;
  font-weight: bold;
  z-index: 1;

  span {
    padding: 0 5px;
    -webkit-text-stroke: 1px #fff;
    color: transparent;
    filter: drop-shadow(2px 2px 3px rgba(0, 0, 0, 0.8));
  }
`;

const Info = styled(motion.div)`
  padding: 10px;
  background-color: ${(props) => props.theme.black.lighter};
  opacity: 0;
  position: absolute;
  width: 100%;
  bottom: 0;
  h4 {
    text-align: center;
    font-size: 18px;
    font-weight: 500;
    color: ${(props) => props.theme.white.lighter};
  }
`;

const LeftArrowSvg = () => {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M17.9209 1.50495C17.9206 1.90264 17.7623 2.28392 17.4809 2.56495L9.80895 10.237C9.57673 10.4691 9.39252 10.7447 9.26684 11.0481C9.14117 11.3515 9.07648 11.6766 9.07648 12.005C9.07648 12.3333 9.14117 12.6585 9.26684 12.9618C9.39252 13.2652 9.57673 13.5408 9.80895 13.773L17.4709 21.435C17.7442 21.7179 17.8954 22.0968 17.892 22.4901C17.8885 22.8834 17.7308 23.2596 17.4527 23.5377C17.1746 23.8158 16.7983 23.9735 16.405 23.977C16.0118 23.9804 15.6329 23.8292 15.3499 23.556L7.68795 15.9C6.65771 14.8677 6.0791 13.4689 6.0791 12.0105C6.0791 10.552 6.65771 9.15322 7.68795 8.12095L15.3599 0.443953C15.5697 0.234037 15.8371 0.0910666 16.1281 0.0331324C16.4192 -0.0248017 16.7209 0.00490445 16.9951 0.118492C17.2692 0.232079 17.5036 0.424443 17.6684 0.671242C17.8332 0.918041 17.9211 1.20818 17.9209 1.50495Z"
        fill="#374957"
      />
    </svg>
  );
};

const RightArrowSvg = () => {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M6.07904 22.5C6.07939 22.1023 6.23766 21.7211 6.51904 21.44L14.191 13.768C14.4233 13.5359 14.6075 13.2602 14.7331 12.9569C14.8588 12.6535 14.9235 12.3284 14.9235 12C14.9235 11.6717 14.8588 11.3465 14.7331 11.0432C14.6075 10.7398 14.4233 10.4642 14.191 10.232L6.52904 2.56502C6.2558 2.28211 6.10461 1.90321 6.10803 1.50992C6.11145 1.11662 6.2692 0.740401 6.54731 0.462289C6.82542 0.184177 7.20164 0.0264236 7.59494 0.0230059C7.98823 0.0195883 8.36714 0.17078 8.65004 0.444017L16.312 8.10502C17.3423 9.13728 17.9209 10.5361 17.9209 11.9945C17.9209 13.4529 17.3423 14.8518 16.312 15.884L8.64004 23.556C8.43056 23.7656 8.16368 23.9085 7.87309 23.9666C7.58249 24.0247 7.2812 23.9954 7.00723 23.8824C6.73326 23.7695 6.49889 23.5779 6.3337 23.3319C6.16851 23.0858 6.07989 22.7964 6.07904 22.5Z"
        fill="#374957"
      />
    </svg>
  );
};

const StyledButton = styled.button<React.ButtonHTMLAttributes<HTMLButtonElement>>`
  border: none;
  background: none;
  cursor: pointer;

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;
