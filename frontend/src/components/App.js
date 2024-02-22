import React from 'react';
import './App.css';
import Header from './Header/Header';
import MarketSummary from './MarketSummary/MarketSummary';
import Stocks from './PopularStocks/PopularStocks';

function App() {
  return (
    <div>
      <Header />
      <MarketSummary />
      <Stocks />
    </div>
  );
}

export default App;
