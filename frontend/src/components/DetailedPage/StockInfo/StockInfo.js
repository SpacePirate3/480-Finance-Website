import React, { useState, useEffect } from 'react';
import './StockInfo.css'
import { renderComponent, renderGeneralIncome, 
        renderAbout, renderShareStatistics, 
        renderDividends, fetchSpecificStock,
        renderCompanyName 
} from '../OverviewComponents/OverviewComponents.js';
import { useParams } from 'react-router-dom';

// Function Renders all Stock components
function StockInfo() {
    const [stock, setStockIcome] = useState([]);
    const apiBaseUrl = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8000/api';
    const { stockSymbol } = useParams();
    
    // Trigger to update page's components
    const fetchData = async () => {
        const stockData = await fetchSpecificStock(apiBaseUrl, stockSymbol); // Gets Stock Info
        setStockIcome(stockData);
    };

    useEffect(() => {
        fetchData();
        const interval = setInterval(fetchData, 60000); // Fetch data every minute
        
        return () => clearInterval(interval);
    }, [stockSymbol]);

    // Structures Page's Components
    return (
        <div className="grid-container-overview"> {}
            <div className="component-overview income-section"> {}
                <h1>GENERAL INCOME</h1>
                {renderComponent(stock, renderGeneralIncome)}
            </div>
            <div className="component-overview share-statistics-section"> {}    
                <h1>SHARE STATISTICS</h1>
                {renderComponent(stock, renderShareStatistics)}
            </div>
            <div className="component-overview dividends-section"> {}
                <h1>DIVIDENDS</h1>
                {renderComponent(stock, renderDividends)}
            </div>

        </div>
    );  
}

export default StockInfo;