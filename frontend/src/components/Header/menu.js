import React, { useState } from 'react';
import { renderTableRow, renderTableRowsWithDataPadding, fetchAllStockData, formatVolume} from '../HomePage/Utility';

import './menu.css'; 

const Menu = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [topMoversOpen, setTopMoversOpen] = useState(true);
    const [topGainersOpen, setTopGainersOpen] = useState(true);
    const [topLosersOpen, setTopLosersOpen] = useState(true);
    const [allStocksOpen, setAllStocksOpen] = useState(true); 

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    const toggleTopMovers = () => {
        setTopMoversOpen(prevState => !prevState);
    };

    const toggleTopGainers = () => {
        setTopGainersOpen(prevState => !prevState);
    };

    const toggleTopLosers = () => {
        setTopLosersOpen(prevState => !prevState);
    };

    // Arrow icon component
    const ArrowIcon = ({ isOpen }) => {
        return (
            <span className={`arrow-icon ${isOpen ? 'open' : ''}`}>
                {isOpen ? <>&#9660;</> : <>&#9658;</>} 
            </span>
        );
    };

    const toggleAllStocks = () => { // Function to toggle all stocks
        setAllStocksOpen(prevState => !prevState);
    };

    // Placeholder stock data for each section
    const topMovers = [
        { symbol: 'AAPL', name: 'Apple Inc.', price: '150.25', change: '2.50', percentChange: '+1.68' },
        { symbol: 'GOOGL', name: 'Alphabet Inc.', price: '2800.30', change: '20.15', percentChange: '+0.72' },
        { symbol: 'MSFT', name: 'Microsoft Corporation', price: '300.45', change: '-1.20', percentChange: '-0.40' },
    ];

    const topGainers = [
        { symbol: 'AMZN', name: 'Amazon.com Inc.', price: '3500.00', change: '50.75', percentChange: '+1.47' },
        { symbol: 'NFLX', name: 'Netflix Inc.', price: '650.20', change: '8.35', percentChange: '+1.30' },
        { symbol: 'TSLA', name: 'Tesla Inc.', price: '850.60', change: '10.25', percentChange: '+1.22%' },
    ];

    const topLosers = [
        { symbol: 'FB', name: 'Meta Platforms Inc.', price: '315.70', change: '-5.25', percentChange: '-1.64' },
        { symbol: 'NVDA', name: 'NVIDIA Corporation', price: '280.45', change: '-3.30', percentChange: '-1.16' },
        { symbol: 'PYPL', name: 'PayPal Holdings Inc.', price: '200.80', change: '-2.15', percentChange: '-1.06' },
    ];

    return (
        <div className={`dropdown-menu ${isOpen ? 'open' : ''}`}>
            <div className={`menu-section ${topMoversOpen ? 'open' : ''}`}>
                <div className="menu-section-header" onClick={toggleTopMovers}>
                    <h3>Top Movers <ArrowIcon isOpen={topMoversOpen} /></h3>
                </div>
                {topMoversOpen && (
                    <div>
                        <div className="table-menu-header">
                            <span>SYMBOL</span>
                            <span>LAST (USD)</span>
                            <span>CHG (USD)</span>
                            <span>%CHG</span>
                        </div>
                        <div className="top-movers-section">
                            <div className="table-menu">
                                {renderTableRowsWithDataPadding(topMovers, renderTableRow, 3)}
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <div className={`menu-section ${topGainersOpen ? 'open' : ''}`}>
    <div className="menu-section-header" onClick={toggleTopGainers}>
        <h3>Top Gainers <ArrowIcon isOpen={topGainersOpen} /></h3>
    </div>
    {topGainersOpen && (
        <div>
            <div className="table-menu-header">
                <span>SYMBOL</span>
                <span>LAST (USD)</span>
                <span>CHG (USD)</span>
                <span>%CHG</span>
            </div>
            <div className="top-gainers-section">
                <div className="table-menu">
                    {renderTableRowsWithDataPadding(topGainers, renderTableRow, 3)}
                </div>
            </div>
        </div>
    )}
</div>


            <div className={`menu-section ${topLosersOpen ? 'open' : ''}`}>
                <div className="menu-section-header" onClick={toggleTopLosers}>
                    <h3>Top Losers <ArrowIcon isOpen={topLosersOpen} /></h3>
                </div>
                {topLosersOpen && (
                    <div>
                        <div className="table-menu-header">
                            <span>SYMBOL</span>
                            <span>LAST (USD)</span>
                            <span>CHG (USD)</span>
                            <span>%CHG</span>
                        </div>
                        <div className="top-losers-section">
                            <div className="table-menu">
                                {renderTableRowsWithDataPadding(topLosers, renderTableRow, 3)}
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <div className={`menu-section ${allStocksOpen ? 'open' : ''}`}>
                <div className="menu-section-header" onClick={toggleAllStocks}>
                    <h3>All Stocks <ArrowIcon isOpen={allStocksOpen} /></h3>
                </div>
                {allStocksOpen && (
                    <div>
                        <div className="table-menu-header">
                            <span>SYMBOL</span>
                            <span>LAST (USD)</span>
                            <span>CHG (USD)</span>
                            <span>%CHG</span>
                        </div>
                        <div className="all-stocks-section">
                            <div className="table-menu">
                            {renderTableRowsWithDataPadding(topLosers, renderTableRow, 12)}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Menu;
