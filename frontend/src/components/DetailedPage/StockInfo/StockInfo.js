import React, { useState, useEffect } from 'react';
import '../DetailsUtility/DetailsUtility.css'
import './StockInfo.css'
import { renderTable, renderGeneralIncome, 
        renderAbout, renderShareStatistics, 
        renderDividends, renderShorts, 
        fetchSpecificStock 
} from '../DetailsUtility/DetailsUtility.js';
import { useParams } from 'react-router-dom';

function StockInfo() {
    const [stock, setStockIcome] = useState([]);
    const apiBaseUrl = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8000/api';
    let { stockSymbol } = useParams();
    
    // Trigger to update page's components
    const fetchData = async () => {
        const stockData = await fetchSpecificStock(apiBaseUrl, stockSymbol); // Gets General Income
        setStockIcome(stockData);
    };

    useEffect(() => {
        fetchData();
        const interval = setInterval(fetchData, 60000); // Fetch data every minute
        
        return () => clearInterval(interval);
    }, []);

    // Structures Page's Components
    return (
        
        <div className="flex-container-details"> {}
            <div className="flex-component"> {}
                {renderTable(stock, renderGeneralIncome)}
            </div>
            <div className="flex-component"> {} 
                {renderTable(stock, renderAbout)}
            </div>
            <div className="flex-component"> {}    
                {renderTable(stock, renderShareStatistics)}
            </div>
            <div className="flex-component"> {}
                {renderTable(stock, renderDividends)}
            </div>
        </div>
    );  
}

export default StockInfo;