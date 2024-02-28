import React from 'react';
import Header from '../Header/Header';
import PropTypes from 'prop-types';
import MarketSummary from '../HomePage/MarketSummary/MarketSummary'
import Stocks from '../HomePage/PopularStocks/PopularStocks'
import {createChart} from "lightweight-charts"
import './RealHome.css';

const RealHome = () => (
  <div>
    Hello
      <Header />
      <MarketSummary />
      <Stocks />
    </div>
);

RealHome.propTypes = {};

RealHome.defaultProps = {};

export default RealHome;
