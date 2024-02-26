import React, { useState, useEffect } from 'react';
import './PopularStocks.css';
import '../Utility.css'
import { renderTableRow, renderTableRowsWithDataPadding, fetchAllStockData} from '../Utility';

function PopularStocks() {
    const [stocks, setStocks] = useState([]);
    const [topMovers, setTopMovers] = useState([]);
    const [topGainers, setTopGainers] = useState([]);
    const [topLosers, setTopLosers] = useState([]);
    const apiBaseUrl = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8000/api';

    const fetchData = async () => {
        const updatedStocks = await fetchAllStockData(apiBaseUrl);
        setStocks(updatedStocks);
        updateTopMovers(updatedStocks);
        updateTopGainers(updatedStocks);
        updateTopLosers(updatedStocks);
    };

    useEffect(() => {
        fetchData();
        const interval = setInterval(fetchData, 60000); // Fetch data every minute
        return () => clearInterval(interval);
    }, []);

    const updateTopMovers = (updatedStocks) => {
    
        const movers = updatedStocks
            .sort((a, b) => parseFloat(b.percentChange) - parseFloat(a.percentChange))
            .slice(0, 6);
        
        setTopMovers(movers);
    };

    const updateTopGainers = (updatedStocks) => {
        const gainers = updatedStocks
            .filter(stock => parseFloat(stock.change) > 0)
            .sort((a, b) => parseFloat(b.percentChange) - parseFloat(a.percentChange))
            .slice(0, 6);

        setTopGainers(gainers);
    };

    const updateTopLosers = (updatedStocks) => {
        const losers = updatedStocks
            .filter(stock => parseFloat(stock.change) < 0)
            .sort((a, b) => parseFloat(a.percentChange) - parseFloat(b.percentChange))
            .slice(0, 6); // Adjust the number of top losers as needed
    
        setTopLosers(losers);
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

    return (
        <div className="flex-container"> {/* Use shared container class */}
            <div className="flex-component"> {/* Use shared class for left section */}
                <h2>POPULAR STOCKS</h2>
                <div className="popular-stocks">
                    {stocks.map(renderStockButton)}
                </div>
            </div>
            <div className="flex-table"> {/* Use shared class for right section, adjusted for content */}
                <div className="top-movers-section">
                    <h2>TOP MOVERS</h2>
                    <div className="table">
                        <div className="table-header">
                            <span>SYMBOL</span>
                            <span>LAST (USD)</span>
                            <span>CHG (USD)</span>
                            <span>%CHG</span>
                        </div>
                        {renderTableRowsWithDataPadding(topMovers, renderTableRow)}
                    </div>
                </div>
                <div className="top-gainers-section">
                    <h2>TOP GAINERS</h2>
                    <div className="table">
                        <div className="table-header">
                            <span>SYMBOL</span>
                            <span>LAST (USD)</span>
                            <span>CHG (USD)</span>
                            <span>%CHG</span>
                        </div>
                        {renderTableRowsWithDataPadding(topGainers, renderTableRow)}
                    </div>
                </div>
                <div className="top-losers-section">
                    <h2>TOP LOSERS</h2>
                    <div className="table">
                        <div className="table-header">
                            <span>SYMBOL</span>
                            <span>LAST (USD)</span>
                            <span>CHG (USD)</span>
                            <span>%CHG</span>
                        </div>
                        {renderTableRowsWithDataPadding(topLosers, renderTableRow)}
                    </div>
                </div>
            </div>
        </div>
    );  
}

export default PopularStocks;
