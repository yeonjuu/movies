import { Routes, Route, BrowserRouter } from 'react-router-dom';
import { Home } from './routes/Home';
import Header from './components/Header';
import { TV } from './routes/TV';

// Header 컴포넌트가 없는 경우가 있다면
// Layout 컴포넌트를 만들어서
// Header 컴포넌트를 Layout 컴포넌트에 넣고
// Layout 컴포넌트를 App 컴포넌트에서 사용하도록 변경할 수 있다.

function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/movies/:movieId" element={<Home />} />
        <Route path="/tv" element={<TV />} />
        <Route path="/tv/:tvId" element={<TV />} />
        <Route path="/search" element={null} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
