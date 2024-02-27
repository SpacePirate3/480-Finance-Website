import React, {useEffect} from 'react';
import './App.css';
import Header from './Header/Header';

import MarketSummary from './HomePage/MarketSummary/MarketSummary'
import Stocks from './HomePage/PopularStocks/PopularStocks'
import {createChart} from "lightweight-charts"
import axios from "axios"
function App() {

    useEffect(() => {

    }, []);
  return (
    <div>
      <Header />
      <MarketSummary />
      <Stocks />
    </div>
  );

}

export default App;
