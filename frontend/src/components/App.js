import React, {useEffect} from 'react';
import './App.css';
import Header from './Header/Header';
import { BrowserRouter} from 'react-router-dom';
import {Route, Routes} from 'react-router-dom'

import RealHome from './RealHome/RealHome'
//import DetailedPage from './DetailedPage'
import MarketSummary from './HomePage/MarketSummary/MarketSummary'
import Stocks from './HomePage/PopularStocks/PopularStocks'
import {createChart} from "lightweight-charts"
import axios from "axios"
import DetailedPage from './DetailedPage/DetailedPage'
import AboutUs from './AboutUsPage/AboutUs';
function App() {

    useEffect(() => {

    }, []);
  return (

    <>
        <Routes>
          <Route path="/" element={<RealHome/>}/>
          <Route path="/details/:stockSymbol" element={<DetailedPage/>}/>
          <Route path="/about" element={<AboutUs />} />
        </Routes>
    </>

                  
          
     
    
  );

}

export default App;
