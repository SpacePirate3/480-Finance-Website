import axios from 'axios';
import './Utility.css'
import { Link } from "react-router-dom";

export const apiObject = axios.create()
export const renderTableRow = (stock, index) => {
    // Check if stock data is provided
    if (!stock) {
        return (
            <div className="home-row empty-row" key={index}>
                <span>—</span>
                <span>—</span>
                <span>—</span>
                <span>—</span>
            </div>
        );
    }

    return (
        <Link to={`/Details/${stock.symbol}`} style={{textDecoration: 'none', color:'black'}}>
        <div className="home-row" key={index}>
            <span>{stock.symbol || '—'}</span>
            <span>{stock.price || '—'}</span>
            <span className={stock.change > 0 ? 'stock-change-positive' : 'stock-change-negative'}>
                {stock.change ? (stock.change > 0 ? `+${stock.change}` : stock.change) : '—'}
            </span>
            <span className={stock.percentChange > 0 ? 'stock-change-positive' : 'stock-change-negative'}>
                {stock.percentChange ? (stock.percentChange > 0 ? `+${stock.percentChange}%` : `${stock.percentChange}%`) : '—'}
            </span>
        </div>
        </Link>
    );
};
export const renderTableRowsWithDataPadding = (data, renderRowFunc, rows=6) => {
    const rowsToRender = rows;
    const paddedData = [...data];

    // Pad the array with `undefined` to ensure it has 6 items
    for (let i = data.length; i < rowsToRender; i++) {
        paddedData.push(undefined); // Add `undefined` for missing items
    }

    return paddedData.map((item, index) => renderRowFunc(item, index));
};

export const fetchAllStockData = async (apiBaseUrl) => {
    try {
        const response = await apiObject.get(`${apiBaseUrl}/stock/list/`);
        const stockSymbols = response.data;
        const updatedStocks = [];

        for (const symbol of stockSymbols) {
            try {
                const overviewResponse = await apiObject.get(`${apiBaseUrl}/stock/overview/simple/${symbol}/`);
                const intradayResponse = await apiObject.get(`${apiBaseUrl}/stock/intraday/latest/${symbol}/`); // Updated to use the new latest intraday data endpoint
                const historicalResponse = await apiObject.get(`${apiBaseUrl}/stock/historical/latest/${symbol}/`);

                // Assuming both the historical and intraday latest endpoints return a single object directly accessible
                const latestHistorical = historicalResponse.data.fields;
                const latestIntraday = intradayResponse.data.fields; // Adjusted for the expected response structure from the latest intraday endpoint

                if (latestHistorical && latestIntraday) {
                    const change = parseFloat(latestIntraday.close) - parseFloat(latestHistorical.open);
                    const percentChange = (change / parseFloat(latestHistorical.open)) * 100;

                    const updatedStock = {
                        name: overviewResponse.data.name,
                        symbol: overviewResponse.data.symbol,
                        price: latestIntraday.close,
                        change: change.toFixed(2),
                        percentChange: percentChange.toFixed(2),
                        volume: latestHistorical.volume,
                    };
                    updatedStocks.push(updatedStock);
                }
            } catch (error) {
                console.error(`Error updating stock ${symbol}:`, error);
            }
        }

        return updatedStocks;
    } catch (error) {
        console.error('Error fetching stock list:', error);
        return [];
    }
};

export const fetchSpecificIndexes = async (apiBaseUrl, symbols) => {
    try {
        const updatedIndexes = [];

        for (const symbol of symbols) {
            try {
                const overviewResponse = await apiObject.get(`${apiBaseUrl}/stock/overview/simple/${symbol}/`);
                const intradayResponse = await apiObject.get(`${apiBaseUrl}/stock/intraday/latest/${symbol}/`); // Use the new endpoint
                const historicalResponse = await apiObject.get(`${apiBaseUrl}/stock/historical/latest/${symbol}/`);

                const historicalData = historicalResponse.data.fields;
                const intradayData = intradayResponse.data.fields; // Assuming the endpoint returns a single object now

                if (historicalData && intradayData) {
                    const change = parseFloat(intradayData.close) - parseFloat(historicalData.open);
                    const percentChange = (change / parseFloat(historicalData.open)) * 100;

                    const updatedIndex = {
                        name: overviewResponse.data.name,
                        symbol: overviewResponse.data.symbol,
                        price: intradayData.close,
                        open: intradayData.open,
                        change: change.toFixed(2),
                        percentChange: percentChange.toFixed(2),
                        volume: historicalData.volume,
                        time: intradayData.date
                    };

                    updatedIndexes.push(updatedIndex);
                }
            } catch (error) {
                console.error(`Error updating stock ${symbol}:`, error);
            }
        }

        return updatedIndexes;
    } catch (error) {
        console.error('Error fetching specific indexes:', error);
        return [];
    }
};

export const formatVolume = (volume) => {
    if (volume >= 1e9) {
        return (volume / 1e9).toFixed(3) + 'B';
    } else if (volume >= 1e6) {
        return (volume / 1e6).toFixed(3) + 'M';
    } else {
        return volume.toLocaleString();
    }
};
