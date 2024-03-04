import React, { useState, useEffect } from 'react';
import './StockInfo.css'
import { renderComponent, renderGeneralIncome, 
        renderAbout, renderShareStatistics, 
        renderDividends, fetchSpecificStock,
        renderCompanyName 
} from '../OverviewComponents/OverviewComponents.js';
import { useParams } from 'react-router-dom';

function StockInfo() {
    const [stock, setStockIcome] = useState([]);
    const apiBaseUrl = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8000/api';
    let { stockSymbol } = useParams();
    
    // Trigger to update page's components
    const fetchData = async () => {
        const stockData = await fetchSpecificStock(apiBaseUrl, stockSymbol); // Gets Stock Info
        setStockIcome(stockData);
    };

    useEffect(() => {
        fetchData();
        const interval = setInterval(fetchData, 60000); // Fetch data every minute
        
        return () => clearInterval(interval);
    }, []);

    // Structures Page's Components
    return (
        <div className="flex-container-overview"> {}
            <div className="flex-component-overview income-section"> {}
                <h1>GENERAL INCOME</h1>
                {renderComponent(stock, renderGeneralIncome)}
            </div>
            <div className="flex-component-overview about-section"> {}
                <h1>ABOUT {renderComponent(stock, renderCompanyName)}</h1>
                {renderComponent(stock, renderAbout)}
            </div>
            <div className="flex-component-overview share-statistics-section"> {}    
                <h1>SHARE STATISTICS</h1>
                {renderComponent(stock, renderShareStatistics)}
            </div>
            <div className="flex-component-overview dividends-section"> {}
                <h1>DIVIDENDS</h1>
                {renderComponent(stock, renderDividends)}
            </div>

        </div>
    );  
}

export default StockInfo;