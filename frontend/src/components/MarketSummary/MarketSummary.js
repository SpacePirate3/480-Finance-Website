import React, { useState } from 'react';
import './MarketSummary.css';

function MarketSummary() {
    const [activeStock, setActiveStock] = useState(null);

    const handleMouseEnter = (stock) => {
        setActiveStock(stock);
    };

    const handleMouseLeave = () => {
        setActiveStock(null);
    };

    return (
        <div className="market-summary">
            <div className="graph-area">
                <h2>MARKET SUMMARY</h2>
                <h3>{activeStock ? `${activeStock.name} | WED, FEB 7 2024 - 7:00 PM EST` : 'APPLE | WED, FEB 7 2024 - 7:00 PM EST'}</h3>
                <div className={`stock-chart ${activeStock ? 'active' : ''}`}>
                    {/* Placeholder for your stock chart component */}
                    {activeStock ? activeStock.name : 'Graph Placeholder'}
                </div>
            </div>
            <div className="stock-menu">
                {/* You would dynamically generate these rows based on your data */}
                <div className="stock-table">
                    <div className="stock-table-header">
                        <span>NAME</span>
                        <span>LAST</span>
                        <span>CHG</span>
                        <span>%CHG</span>
                    </div>
                    <div className="stock-button" onMouseEnter={() => handleMouseEnter({ name: 'S&P Global Inc. (SPGI)' })} onMouseLeave={handleMouseLeave}>
                        <span>SPGI</span>
                        <span>293.45 USD</span>
                        <span>+24.34</span>
                        <span>+12.12%</span>
                    </div>
                    <div className="stock-button" onMouseEnter={() => handleMouseEnter({ name: 'Dow Inc. (DOW)' })} onMouseLeave={handleMouseLeave}>
                        <span>DOW</span>
                        <span>293.45 USD</span>
                        <span>+24.34</span>
                        <span>+12.12%</span>
                    </div>
                    <div className="stock-button" onMouseEnter={() => handleMouseEnter({ name: 'NASDAQ Inc. (NDAQ)' })} onMouseLeave={handleMouseLeave}>
                        <span>NDAQ</span>
                        <span>293.45 USD</span>
                        <span>+24.34</span>
                        <span>+12.12%</span>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default MarketSummary;
