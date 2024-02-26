import axios from 'axios';
import './Utility.css'
import React from "react";
export const renderTableRow = (stock, index) => {
    return (
            <div className="row" key={index}>
                <span>{stock.symbol}</span>
                <span>{stock.price}</span>
                <span className={stock.change > 0 ? 'stock-change-positive' : 'stock-change-negative'}>
                    {stock.change > 0 ? `+${stock.change}` : stock.change}
                </span>
                <span className={stock.percentChange > 0 ? 'stock-change-positive' : 'stock-change-negative'}>
                    {stock.percentChange}%
                </span>
            </div>
    );
};

export const fetchAllStockData = async (apiBaseUrl) => {
    try {
        const response = await axios.get(`${apiBaseUrl}/stock/list/`);
        const stockSymbols = response.data;
        const updatedStocks = [];

        for (const symbol of stockSymbols) {
            try {
                const overviewResponse = await axios.get(`${apiBaseUrl}/stock/overview/${symbol}/`);
                const intradayResponse = await axios.get(`${apiBaseUrl}/stock/intraday/${symbol}/`);
                const intradayData = intradayResponse.data.map(item => item.fields);
                const latestIntraday = intradayData[0];
                const change = latestIntraday.close - intradayData[intradayData.length - 1].open;
                const percentChange = (change / intradayData[intradayData.length - 1].open) * 100;
                const updatedStock = {
                    symbol,
                    ...overviewResponse.data, // Assuming the fields come within a 'fields' object
                    price: latestIntraday.close,
                    change: change.toFixed(2),
                    percentChange: percentChange.toFixed(2)
                };
                updatedStocks.push(updatedStock);
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
                const overviewResponse = await axios.get(`${apiBaseUrl}/stock/overview/${symbol}/`);
                const intradayResponse = await axios.get(`${apiBaseUrl}/stock/intraday/${symbol}/`);
                const intradayData = intradayResponse.data.map(item => item.fields);
                const latestIntraday = intradayData[0];
                const change = latestIntraday.close - intradayData[intradayData.length - 1].open;
                const percentChange = (change / intradayData[intradayData.length - 1].open) * 100;
                const updatedIndex = {
                    symbol,
                    ...overviewResponse.data, // Assuming the fields come within a 'fields' object
                    price: latestIntraday.close,
                    change: change.toFixed(2),
                    percentChange: percentChange.toFixed(2)
                };
                updatedIndexes.push(updatedIndex);
            } catch (error) {
                console.error(`Error updating stock ${symbol}:`, error);
            }
        }

        return updatedIndexes;
    } catch (error) {
        console.error('Error fetching stock list:', error);
        return [];
    }
};
