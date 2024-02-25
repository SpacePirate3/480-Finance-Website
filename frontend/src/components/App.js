import React from 'react';
import './App.css';
import Header from './Header/Header';
import MarketSummary from './HomePage/MarketSummary/MarketSummary';
import Stocks from './HomePage/PopularStocks/PopularStocks';

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
