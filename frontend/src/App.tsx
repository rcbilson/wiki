import { Route, Routes, Navigate } from 'react-router-dom';
import PageRenderer from './PageRenderer';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/index" replace />} />
      <Route path=":page" element={<PageRenderer />} />
    </Routes>
  );
}

export default App;
