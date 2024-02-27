import axios from 'axios';
import './Utility.css'

export const renderTableRow = (stock, index) => {
    // Check if stock data is provided
    if (!stock) {
        return (
            <div className="row empty-row" key={index}>
                <span>—</span>
                <span>—</span>
                <span>—</span>
                <span>—</span>
            </div>
        );
    }

    return (
        <div className="row" key={index}>
            <span>{stock.symbol || '—'}</span>
            <span>{stock.price || '—'}</span>
            <span className={stock.change > 0 ? 'stock-change-positive' : 'stock-change-negative'}>
                {stock.change ? (stock.change > 0 ? `+${stock.change}` : stock.change) : '—'}
            </span>
            <span className={stock.percentChange > 0 ? 'stock-change-positive' : 'stock-change-negative'}>
                {stock.percentChange ? `${stock.percentChange}%` : '—'}
            </span>
        </div>
    );
};

export const renderTableRowsWithDataPadding = (data, renderRowFunc) => {
    const rowsToRender = 6;
    const paddedData = [...data];

    // Pad the array with `undefined` to ensure it has 6 items
    for (let i = data.length; i < rowsToRender; i++) {
        paddedData.push(undefined); // Add `undefined` for missing items
    }

    return paddedData.map((item, index) => renderRowFunc(item, index));
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
                const historicalResponse = await axios.get(`${apiBaseUrl}/stock/historical/${symbol}/`);

                // Assuming the first entry in the historical data is the most recent
                const latestHistorical = historicalResponse.data[0]?.fields; // Safely accessing fields
                const latestIntraday = intradayResponse.data[0]?.fields; // Safely accessing fields for intraday data

                if (latestHistorical && latestIntraday) {
                    // Calculate change and percent change
                    const change = parseFloat(latestIntraday.close) - parseFloat(latestHistorical.open);
                    const percentChange = (change / parseFloat(latestHistorical.open)) * 100;

                    const updatedStock = {
                        symbol,
                        ...overviewResponse.data, // Assuming the fields come within a 'fields' object
                        price: latestIntraday.close,
                        change: change.toFixed(2),
                        percentChange: percentChange.toFixed(2),
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
                // Fetch the latest overview data
                const overviewResponse = await axios.get(`${apiBaseUrl}/stock/overview/${symbol}/`);
                // Fetch the latest intraday data
                const intradayResponse = await axios.get(`${apiBaseUrl}/stock/intraday/${symbol}/`);
                // Fetch the historical data
                const historicalResponse = await axios.get(`${apiBaseUrl}/stock/historical/${symbol}/`);

                // Assuming the historical data is sorted by date descending, so the first item is the latest
                const historicalData = historicalResponse.data[0]?.fields; // Safely accessing fields
                const intradayData = intradayResponse.data[0]?.fields; // Safely accessing fields for intraday data

                if (historicalData && intradayData) {
                    // Calculate change and percent change using the latest historical open and latest intraday close
                    const change = parseFloat(intradayData.close) - parseFloat(historicalData.open);
                    const percentChange = (change / parseFloat(historicalData.open)) * 100;

                    const updatedIndex = {
                        symbol,
                        ...overviewResponse.data, // Adjust according to the actual data structure
                        price: intradayData.close,
                        change: change.toFixed(2),
                        percentChange: percentChange.toFixed(2),
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

