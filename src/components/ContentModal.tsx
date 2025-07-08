import { motion, useScroll } from 'motion/react';
import styled from 'styled-components';
import { makeImagePath } from '../utils';
import { useMatch, useNavigate } from 'react-router-dom';
import { getGenres, IMovie, ITrendingTvShow, ITvShow } from '../api';
import { useQuery } from 'react-query';

interface ContentModalProps {
  clicked: IMovie | ITvShow | ITrendingTvShow | null;
}

export function ContentModal({ clicked }: ContentModalProps) {
  const moviePathMatch = useMatch('/movies/:movieId');
  const tvPathMatch = useMatch('/tv/:tvId');
  const { scrollY } = useScroll();
  const navigate = useNavigate();
  const { data: genres, isLoading } = useQuery('genres', getGenres);

  const onOverlayClick = () => navigate('/');

  const findGenres = (ids: number[]) => {
    if (isLoading || !genres) return [];
    return ids.map((id) => genres.find((genre) => genre.id === id));
  };

  if (!moviePathMatch && !tvPathMatch) return null;

  const id = moviePathMatch?.params.movieId ?? tvPathMatch?.params.tvId;

  return (
    <>
      <Overlay onClick={onOverlayClick} exit={{ opacity: 0 }} animate={{ opacity: 1 }} />
      <DetailMovie style={{ top: scrollY.get() + 100 }} layoutId={id ? `modal-${id}` : undefined}>
        {clicked && (
          <>
            <BigCover
              style={{
                backgroundImage: `linear-gradient(to top, black, transparent), url(${makeImagePath(
                  clicked.backdrop_path,
                  'w500',
                )})`,
              }}
            />
            <BigTitle> {'title' in clicked ? clicked.title : clicked?.name}</BigTitle>
            <BigGenres>
              {findGenres(clicked.genre_ids)
                .map((g) => g?.name)
                .join(' | ')}
            </BigGenres>
            <BigOverview>{clicked?.overview}</BigOverview>
          </>
        )}
      </DetailMovie>
    </>
  );
}

const Overlay = styled(motion.div)`
  position: fixed;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  opacity: 0;
  z-index: 100;
`;

const DetailMovie = styled(motion.div)`
  position: absolute;
  width: 40vw;
  height: 80vh;
  left: 0;
  right: 0;
  margin: 0 auto;
  border-radius: 15px;
  overflow: hidden;
  z-index: 100;
  background-color: ${(props) => props.theme.black.veryDark};
`;

const BigCover = styled('div')<React.HTMLAttributes<HTMLDivElement>>`
  width: 100%;
  background-size: cover;
  background-position: center center;
  height: 400px;
`;

const BigTitle = styled.h3`
  color: ${(props) => props.theme.white.lighter};
  padding: 20px;
  font-size: 32px;
  font-weight: 400;
`;

const BigGenres = styled.p`
  padding: 0px 20px;
  color: ${(props) => props.theme.white.lighter};
  font-size: 16px;
  font-weight: 300;
  margin-bottom: 10px;
`;

const BigOverview = styled.p`
  padding: 0px 20px;
  color: ${(props) => props.theme.white.lighter};
  word-wrap: break-word;
`;
