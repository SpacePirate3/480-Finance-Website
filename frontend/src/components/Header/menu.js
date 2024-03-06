import React, {useEffect, useState} from 'react';
import { renderTableRow, renderTableRowsWithDataPadding, fetchAllStockData, formatVolume} from '../HomePage/Utility';

import './menu.css'; 

const Menu = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [topMoversOpen, setTopMoversOpen] = useState(true);
    const [topGainersOpen, setTopGainersOpen] = useState(true);
    const [topLosersOpen, setTopLosersOpen] = useState(true);
    const [allStocksOpen, setAllStocksOpen] = useState(true); 
    const [stocks, setStocks] = useState([]);
    const [topMovers, setTopMovers] = useState([]);
    const [topGainers, setTopGainers] = useState([]);
    const [topLosers, setTopLosers] = useState([]);
    const apiBaseUrl = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8000/api';
    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };
    useEffect(() => {
        fetchData();
        const interval = setInterval(fetchData, 60000); // Fetch data every minute
        return () => clearInterval(interval);
    }, []);
    const updateTopMovers = (updatedStocks) => {

        const movers = updatedStocks
            .sort((a, b) => parseFloat(b.percentChange) - parseFloat(a.percentChange))
            .slice(0, 3);

        setTopMovers(movers);
    };

    const updateTopGainers = (updatedStocks) => {
        const gainers = updatedStocks
            .filter(stock => parseFloat(stock.change) > 0)
            .sort((a, b) => parseFloat(b.percentChange) - parseFloat(a.percentChange))
            .slice(0, 3);

        setTopGainers(gainers);
    };

    const updateTopLosers = (updatedStocks) => {
        const losers = updatedStocks
            .filter(stock => parseFloat(stock.change) < 0)
            .sort((a, b) => parseFloat(a.percentChange) - parseFloat(b.percentChange))
            .slice(0, 3); // Adjust the number of top losers as needed

        setTopLosers(losers);
    };
    const fetchData = async () => {
        const updatedStocks = await fetchAllStockData(apiBaseUrl);
        setStocks(updatedStocks);
        updateTopMovers(updatedStocks);
        updateTopGainers(updatedStocks);
        updateTopLosers(updatedStocks);
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
                            {renderTableRowsWithDataPadding(topLosers, renderTableRow, 15)}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Menu;