import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import PageRank from './pages/PageRank';
import IndicCommerce from './pages/indicCommerce/IndicCommerce';
import ProductsPage from './pages/indicCommerce/ProductsPage';
import Portfolio from './pages/Portfolio';

const App = () => {
  return (
    <Router basename='/'>
      <Routes>
        <Route path="/" element={<Portfolio />} />
        <Route path="/page-rank" element={<PageRank />} />
        <Route path="/indic-commerce" element={<IndicCommerce />} />
        <Route path="/indic-commerce/products" element={<ProductsPage />} />
      </Routes>
    </Router>
  );
};

export default App;
