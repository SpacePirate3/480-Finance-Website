import React, { useState, useEffect } from 'react';
import './MarketSummary.css';
import '../Utility.css'
import { renderTableRow, fetchSpecificIndexes } from '../Utility';

function MarketSummary() {
    const [activeStock, setActiveStock] = useState(null);
    const [indexes, setIndexes] = useState([]);
    const apiBaseUrl = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8000/api';

    const fetchData = async () => {
        const specificSymbols = ['SPGI', 'DOW', 'NDAQ'];
        const updatedIndexes = await fetchSpecificIndexes(apiBaseUrl, specificSymbols);
        setIndexes(updatedIndexes);
    };

    useEffect(() => {
        fetchData();
        const interval = setInterval(fetchData, 60000); // Fetch data every minute
        return () => clearInterval(interval);
    }, []);

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
                    {activeStock ? activeStock.name : 'Graph Placeholder'}
                </div>
            </div>
            <div className="indexes-container">
                <div className="indexes-section">
                    <h2>INDEXES</h2>
                    <div className="table">
                        <div className="table-header">
                            <span>SYMBOL</span>
                            <span>LAST</span>
                            <span>CHG</span>
                            <span>%CHG</span>
                        </div>
                        {indexes.map(renderTableRow)}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default MarketSummary;
