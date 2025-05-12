import { Route, Routes } from 'react-router-dom';
import PageRenderer from './PageRenderer';

function App() {
  return (
    <Routes>
      <Route path=":page" element={<PageRenderer />} />
    </Routes>
  );
}

export default App;
