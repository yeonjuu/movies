import styled from 'styled-components';
import { motion, useAnimation, useMotionValueEvent, useScroll } from 'framer-motion';
import { Link, useMatch, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

const logoVariants = {
  normal: {
    fillOpacity: 1,
  },
  active: {
    fillOpacity: [0, 1, 0],
    transition: {
      repeat: Infinity,
    },
  },
};

interface IForm {
  keyword: string;
}

function Header() {
  const [searchOpen, setSearchOpen] = useState(false);
  const homeMatch = useMatch('/');
  const tvMatch = useMatch('/tv');
  const inputAnimation = useAnimation();
  const navAnimation = useAnimation();
  const { scrollY } = useScroll();
  const { register, handleSubmit } = useForm<IForm>();
  const navigate = useNavigate();

  const onValid = ({ keyword }: IForm) => {
    if (keyword === '') return;
    navigate(`/search?keyword=${keyword}`);
    setSearchOpen(false);
    inputAnimation.start('normal');
  };

  const toggleSearch = () => {
    if (searchOpen) {
      inputAnimation.start('normal');
    } else {
      inputAnimation.start('active');
    }
    setSearchOpen((prev) => !prev);
  };

  // better to use useMotionValueEvent for performance not useEffect
  // for why?
  // https://www.framer.com/docs/use-motion-value-event/
  useMotionValueEvent(scrollY, 'change', (latest) => {
    if (latest > 80) {
      navAnimation.start({
        backgroundColor: 'rgba(0,0,0,1)',
      });
    } else {
      navAnimation.start({
        backgroundColor: 'rgba(0,0,0,0)',
      });
    }
  });

  return (
    <Nav initial={{ backgroundColor: 'rgba(0,0,0,0)' }} animate={navAnimation}>
      <Col>
        <Logo
          variants={logoVariants}
          whileHover="active"
          initial="normal"
          xmlns="http://www.w3.org/2000/svg"
          width="1024"
          height="276.742"
          viewBox="0 0 1024 276.742"
        >
          <motion.path d="M140.803 258.904c-15.404 2.705-31.079 3.516-47.294 5.676l-49.458-144.856v151.073c-15.404 1.621-29.457 3.783-44.051 5.945v-276.742h41.08l56.212 157.021v-157.021h43.511v258.904zm85.131-157.558c16.757 0 42.431-.811 57.835-.811v43.24c-19.189 0-41.619 0-57.835.811v64.322c25.405-1.621 50.809-3.785 76.482-4.596v41.617l-119.724 9.461v-255.39h119.724v43.241h-76.482v58.105zm237.284-58.104h-44.862v198.908c-14.594 0-29.188 0-43.239.539v-199.447h-44.862v-43.242h132.965l-.002 43.242zm70.266 55.132h59.187v43.24h-59.187v98.104h-42.433v-239.718h120.808v43.241h-78.375v55.133zm148.641 103.507c24.594.539 49.456 2.434 73.51 3.783v42.701c-38.646-2.434-77.293-4.863-116.75-5.676v-242.689h43.24v201.881zm109.994 49.457c13.783.812 28.377 1.623 42.43 3.242v-254.58h-42.43v251.338zm231.881-251.338l-54.863 131.615 54.863 145.127c-16.217-2.162-32.432-5.135-48.648-7.838l-31.078-79.994-31.617 73.51c-15.678-2.705-30.812-3.516-46.484-5.678l55.672-126.75-50.269-129.992h46.482l28.377 72.699 30.27-72.699h47.295z" />
        </Logo>
        <Items>
          <Item>
            <Link to="/">Home {homeMatch && <Circle layoutId="circle" />}</Link>
          </Item>
          <Item>
            <Link to="/tv">시리즈 {tvMatch && <Circle layoutId="circle" />}</Link>
          </Item>
        </Items>
      </Col>
      <Col>
        <Search onSubmit={handleSubmit(onValid)}>
          <motion.svg
            onClick={toggleSearch}
            transition={{ type: 'tween' }}
            animate={{ x: searchOpen ? -180 : 0 }}
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
              clipRule="evenodd"
            />
          </motion.svg>
          <Input
            {...register('keyword', { required: true, minLength: 2 })}
            transition={{ type: 'tween' }}
            animate={{ scaleX: searchOpen ? 1 : 0 }}
            placeholder="Search for movie or tv show..."
          />
        </Search>
      </Col>
    </Nav>
  );
}

export default Header;

//stylted components가 더 길어지면 heder.styled.ts로 분리
const Nav = styled(motion.nav)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: fixed;
  width: 100%;
  top: 0;
  background-color: black;
  font-size: 14px;
  padding: 20px 60px;
  color: white;
  box-sizing: border-box;
  z-index: 1000;
  gap: 20px;
`;

const Logo = styled(motion.svg)`
  width: 95px;
  height: 25px;
  fill: ${(props) => props.theme.red};
  path {
    stroke-width: 6px;
    stroke: transparent;
  }
`;

const Col = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
`;

const Items = styled.ul`
  display: flex;
  align-items: center;
  gap: 20px;
`;

const Item = styled.li`
  color: ${(props) => props.theme.white.darker};
  transition: color 0.3s ease-in-out;
  position: relative;
  display: flex;
  justify-content: center;
  flex-direction: column;
  &:hover {
    color: ${(props) => props.theme.white.lighter};
  }
  a {
    display: flex;
    align-items: center;
    height: 100%;
    width: 100%;
    color: inherit;
    text-decoration: none;
  }
`;

const Circle = styled(motion.span)`
  position: absolute;
  width: 5px;
  height: 5px;
  border-radius: 5px;
  bottom: -8px;
  left: 0;
  right: 0;
  margin: 0 auto;
  background-color: ${(props) => props.theme.red};
`;

const Search = styled('form')<React.FormHTMLAttributes<HTMLFormElement>>`
  color: white;
  display: flex;
  align-items: center;
  position: relative;
  svg {
    height: 25px;
  }
`;

const Input = styled(motion.input)`
  transform-origin: right center;
  position: absolute;
  right: 0px;
  padding: 8px 10px;
  padding-left: 30px;
  z-index: -1;
  color: white;
  font-size: 16px;
  background-color: transparent;
  border: 1px solid ${(props) => props.theme.white.lighter};
`;
