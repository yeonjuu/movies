import './App.css';
import { Routes, Route, BrowserRouter } from 'react-router-dom';
import { Home } from './routes/Home';
import { Detail } from './routes/Detail';

function App() {
  return (
    <BrowserRouter basename={process.env.PUBLIC_URL}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/detail/:id" element={<Detail />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
