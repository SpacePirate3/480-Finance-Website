import React from 'react';
import './App.css';
import Header from './Header/Header';

import MarketSummary from './MarketSummary/MarketSummary'
import Stocks from './PopularStocks/PopularStocks'
import {createChart} from "lightweight-charts"
import axios from "axios"


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
