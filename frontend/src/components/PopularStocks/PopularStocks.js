import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './PopularStocks.css';

function PopularStocks() {
    const [stocks, setStocks] = useState([]);
    const [topMovers, setTopMovers] = useState([]);
    const [topGainers, setTopGainers] = useState([]);
    const apiBaseUrl = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8000/api'; //temporary until .env works

    const fetchData = async () => {
        try {
            const response = await axios.get(`${apiBaseUrl}/stock/list/`);
            const stockSymbols = response.data;
            const updatedStocks = [];
    
            for (const symbol of stockSymbols) {
                try {
                    const overviewResponse = await axios.get(`${apiBaseUrl}/stock/overview/${symbol}/`);
                    const intradayResponse = await axios.get(`${apiBaseUrl}/stock/intraday/${symbol}/`);
                    const intradayData = intradayResponse.data.map(item => item.fields);
                    const latestIntraday = intradayData[0];
                    const change = latestIntraday.close - intradayData[intradayData.length - 1].open;
                    const percentChange = (change / intradayData[intradayData.length - 1].open) * 100;
                    const updatedStock = {
                        symbol,
                        ...overviewResponse.data, // Assuming the fields come within a 'fields' object
                        price: latestIntraday.close,
                        change: change.toFixed(2),
                        percentChange: percentChange.toFixed(2)
                    };
                    updatedStocks.push(updatedStock);
                } catch (error) {
                    console.error(`Error updating stock ${symbol}:`, error);
                }
            }
    
            setStocks(updatedStocks);
            updateTopMovers(updatedStocks);
            updateTopGainers(updatedStocks); // Update top gainers here
        } catch (error) {
            console.error('Error fetching stock list:', error);
        }
    };

    useEffect(() => {
        fetchData();

        const interval = setInterval(() => {
            fetchData();
        }, 60000); // Fetch data every minute

        return () => clearInterval(interval);
    }, []); // Fetch data on component mount and set interval

    const updateTopMovers = (updatedStocks) => {
        const excludedSymbols = ['DOW', 'NDAQ', 'SPGI']; // List of symbols to exclude
    
        const movers = updatedStocks
            .filter(stock => !excludedSymbols.includes(stock.fields.symbol)) // Exclude specified symbols
            .sort((a, b) => parseFloat(b.percentChange) - parseFloat(a.percentChange))
            .slice(0, 6);
        
        setTopMovers(movers);
    };

    const updateTopGainers = (updatedStocks) => {
        const gainers = updatedStocks
            .filter(stock => parseFloat(stock.change) > 0)
            .sort((a, b) => parseFloat(b.percentChange) - parseFloat(a.percentChange));
        setTopGainers(gainers);
    };

    const renderStockButton = (stock, index) => {
        console.log('Stock object:', stock); // Add this line to see the stock object structure
        const changeClass = parseFloat(stock.change) > 0 ? 'stock-change-positive' : 'stock-change-negative';
        const percentChangeClass = parseFloat(stock.percentChange) > 0 ? 'stock-change-positive' : 'stock-change-negative';
        const { name, symbol } = stock.fields;
        
        return (
            <div key={index} className="stock-button-popular">
                <div className="stock-logo"></div>
                <div className="stock-info-wrapper">
                    <div className="company-name">{name}</div> {/* Use destructured 'name' */}
                    <div className="stock-symbol">{symbol}</div> {/* Use destructured 'symbol' */}
                    <div className="stock-price">{stock.price} USD</div>
                </div>
                <div className="stock-change-group">
                    <div className={`stock-change ${changeClass}`}>
                        {stock.change}
                    </div>
                    <div className={`percent-change ${percentChangeClass}`}>
                        {stock.percentChange}%
                    </div>
                </div>
            </div>
        );
    };
    
    const renderTopMoversRow = (mover, index) => {
        const changeClass = parseFloat(mover.change) > 0 ? 'stock-change-positive' : 'stock-change-negative';
        const percentChangeClass = parseFloat(mover.percentChange) > 0 ? 'stock-change-positive' : 'stock-change-negative';
    
        return (
            <div className="stock-button-table-top" key={index}>
                <span>{mover.symbol}</span>
                <span>{mover.price} USD</span>
                <span className={changeClass}>{mover.change}</span>
                <span className={percentChangeClass}>{mover.percentChange}%</span>
            </div>
        );
    };

    const renderTopGainersRow = (gainer, index) => {
        const changeClass = parseFloat(gainer.change) > 0 ? 'stock-change-positive' : 'stock-change-negative';
        const percentChangeClass = parseFloat(gainer.percentChange) > 0 ? 'stock-change-positive' : 'stock-change-negative';
    
        return (
            <div className="stock-button-table-top" key={index}>
                <span>{gainer.symbol}</span>
                <span>{gainer.price} USD</span>
                <span className={changeClass}>{gainer.change}</span>
                <span className={percentChangeClass}>{gainer.percentChange}%</span>
            </div>
        );
    };

    return (
        <div className="stocks-container">
            <div className="popular-stocks-section">
                <h2>POPULAR STOCKS</h2>
                <div className="popular-stocks">
                    {stocks.map(renderStockButton)}
                </div>
            </div>
            <div className="movers-gainers-container">
                <div className="top-movers-section">
                    <h2>TOP MOVERS</h2>
                    <div className="stock-table">
                        <div className="stock-table-header">
                            <span>NAME</span>
                            <span>LAST</span>
                            <span>CHG</span>
                            <span>%CHG</span>
                        </div>
                        {topMovers.map(renderTopMoversRow)}
                    </div>
                </div>
                <div className="top-gainers-section">
                    <h2>TOP GAINERS</h2>
                    <div className="stock-table">
                        <div className="stock-table-header">
                            <span>NAME</span>
                            <span>LAST</span>
                            <span>CHG</span>
                            <span>%CHG</span>
                        </div>
                        {topGainers.map(renderTopGainersRow)}
                    </div>
                </div>
            </div>
        </div>
    );  
}

export default PopularStocks;
