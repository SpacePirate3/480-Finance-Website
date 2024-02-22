import React, { useState } from 'react';
import './PopularStocks.css';

function Stocks() {
    const [selectedStock, setSelectedStock] = useState(null);

    const stockInfo = [
        { symbol: 'AAPL', company: 'Apple Inc', price: '145.30', change: '-2000', percentChange: '-0.37%' },
        { symbol: 'MSFT', company: 'Microsoft Corp', price: '289.67', change: '+1.23', percentChange: '+0.43%' },
        { symbol: 'AAPL', company: 'Apple Inc', price: '145.30', change: '-0.54', percentChange: '-0.37%' },
        { symbol: 'MSFT', company: 'Microsoft Corp', price: '289.67', change: '+1.23', percentChange: '+0.43%' },
        { symbol: 'AAPL', company: 'Apple Inc', price: '145.30', change: '-0.54', percentChange: '-0.37%' },
        { symbol: 'MSFT', company: 'Microsoft Corp', price: '289.67', change: '+1.23', percentChange: '+0.43%' },
        // ... more stocks
    ];

    const topMovers = [
        { symbol: 'AAPL', company: 'Apple Inc', price: '145.30', change: '-2000', percentChange: '-0.37%' },
        { symbol: 'MSFT', company: 'Microsoft Corp', price: '289.67', change: '+1.23', percentChange: '+0.43%' },
        { symbol: 'AAPL', company: 'Apple Inc', price: '145.30', change: '-0.54', percentChange: '-0.37%' },
        { symbol: 'MSFT', company: 'Microsoft Corp', price: '289.67', change: '+1.23', percentChange: '+0.43%' },
        { symbol: 'AAPL', company: 'Apple Inc', price: '145.30', change: '-0.54', percentChange: '-0.37%' },
        { symbol: 'MSFT', company: 'Microsoft Corp', price: '289.67', change: '+1.23', percentChange: '+0.43%' },
        // ... more stocks
    ];

    const handleStockHover = (stock) => {
        setSelectedStock(stock);
    };

    const renderStockButton = (stock, index) => (
        <div 
            key={index}
            className="stock-button-popular" 
            onMouseEnter={() => handleStockHover(stock)}
            onMouseLeave={() => setSelectedStock(null)}
        >
            <div className="stock-logo"></div>
            <div className="stock-info-wrapper">
                <div className="company-name">{stock.company}</div>
                <div className="stock-price">{stock.price} USD</div>
            </div>
            <div className="stock-change-group">
                <div className={`stock-change ${parseFloat(stock.change) > 0 ? 'stock-change-positive' : 'stock-change-negative'}`}>
                    {stock.change}
                </div>
                <div className={`percent-change ${parseFloat(stock.percentChange) > 0 ? 'stock-change-positive' : 'stock-change-negative'}`}>
                    {stock.percentChange}
                </div>
            </div>
        </div>
    );

    const renderTopMoversRow = (mover, index) => (
        <div className="stock-button-table-top" key={index}>
            <span>{mover.symbol}</span>
            <span>{mover.price} USD</span>
            <span>{mover.change}</span>
            <span>{mover.percentChange}</span>
        </div>
    );

    return (
        <div className="stocks-container">
            {/* Popular Stocks Section */}
            <div className="popular-stocks-section">
                <h2>POPULAR STOCKS</h2>
                <div className="popular-stocks">
                    {stockInfo.map((stock, index) => renderStockButton(stock, index))}
                </div>
            </div>

            {/* Top Movers Section */}
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
        </div>
    );
}

export default Stocks;
