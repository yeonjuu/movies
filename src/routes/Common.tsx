import styled from 'styled-components';

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

export { FlexBox, Wrapper, Loader, Banner, Title, SliderTitle, SliderWrapper };
