import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import PageRank from './pages/PageRank';
import Portfolio from './pages/Portfolio';

const App = () => {
  return (
    <Router basename='/'>
      <Routes>
        <Route path="/" element={<Portfolio />} />
        <Route path="/page-rank" element={<PageRank />} />
      </Routes>
    </Router>
  );
};

export default App;
