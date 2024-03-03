import axios from 'axios';
import './DetailsUtility.css'

// Render General Income Box
export const renderGeneralIncome = (stock) => {
    const renderRow = (label, value) => (
        <div className="row-details">
            <span>{label}</span>
            <span>{value || '—'}</span>
        </div>
    );

    if (!stock) {
        return (
            <div className="row-details empty-row">
                <span>—</span>
            </div>
        );
    }

    return (
        <div className="income-section">
            <h1>GENERAL INCOME</h1>
            <div className="block-container">
                <div className='split-table-container'>
                    <div className='split-table' id='table1'>
                        {renderRow('Market Cap', stock.market_capitalization)}
                        {renderRow('Profit Margin', stock.profit_margin)}
                        {renderRow('Return On Equity (ttm)', stock.return_on_equity_ttm)}
                        {renderRow('Return On Assets (ttm)', stock.return_on_assets_ttm)}
                        {renderRow('EV/EBITDA', stock.ev_to_ebitda)}
                        {renderRow('Gross Profit (ttm)', stock.gross_profit_ttm)}
                        {renderRow('Diluted EPSTTM', stock.diluted_eps_ttm)}
                    </div>
                    <div className='split-table' id='table2'>
                        {renderRow('PE Ratio', stock.pe_ratio)}
                        {renderRow('PEG Ratio', stock.peg_ratio)}
                        {renderRow('EPS', stock.eps)}
                        {renderRow('Trailing PE', stock.trailing_pe)}
                        {renderRow('Forward PE', stock.forward_pe)}
                        {renderRow('Quarterly Revenue', stock.quarterly_revenue_growth_yoy)}
                        {renderRow('Quarterly Earnings', stock.quarterly_earnings_growth_yoy)}
                    </div>
                </div>
            </div>
        </div>
    );
};

// Render About The Company Box
export const renderAbout = (stock) => {
    const renderRow = (label, value) => (
        <div className="company-details">
            <div>{label}</div>
            <div>{value || '—'}</div>
        </div>
    );

    if (!stock) {
        return (
            <div className="row-details empty-row">
                <span>—</span>
            </div>
        );
    }

    return (
        <div className="about-section">
            <h1>GENERAL {stock.name.toUpperCase()}</h1>
            <div className="block-container">
                <div className='split-table-container'>
                    <div className='split-table' id='table1'>
                        {renderRow('Sector', stock.sector)}
                        {renderRow('CIK', stock.cik)}
                    </div>
                    <div className='split-table' id='table2'>
                        {renderRow('Industry', stock.industry)}
                        {renderRow('Headquarters', stock.address)}
                    </div>
                    <div className='split-table' id='table3'>
                        {renderRow('Fiscal Year Ends', stock.fiscal_year_end)}
                        {renderRow('Latest Quarter', stock.latest_quarter)}
                    </div>
                </div>
                <div>
                    <h3>COMPANY</h3>
                    <div>{stock.description}</div>
                </div>
            </div>
        </div>
    );
};

// Render General Income Box
export const renderShareStatistics = (stock) => {
    const renderRow = (label, value) => (
        <div className="row-details">
            <span>{label}</span>
            <span>{value || '—'}</span>
        </div>
    );

    if (!stock) {
        return (
            <div className="row-details empty-row">
                <span>—</span>
            </div>
        );
    }

    return (
        <div className="share-statistics-section">
            <h1>SHARE STATISTICS</h1>
            <div className="block-container">
                <div className='split-table-container'>
                    <div className='split-table' id='table1'>
                        {renderRow('Price To Book Ratio', stock.price_to_book_ratio)}
                        {renderRow('Price To Sales Ratio', stock.price_to_sales_ratio_ttm)}
                        {renderRow('Analyst Target Price', stock.analyst_target_price)}
                        {renderRow('Beta', stock.beta)}
                        {renderRow('Shares Outstanding', stock.shares_outstanding)}
                    </div>
                    <div className='split-table' id='table2'>
                        {renderRow('52 Week High', stock.week_52_high)}
                        {renderRow('52 Week Low', stock.week_52_low)}
                        {renderRow('50 Day Moving Average', stock.day_50_moving_average)}
                        {renderRow('200 Day Moving Average', stock.day_200_moving_average)}
                        {renderRow('Book Value', stock.book_value)}
                    </div>
                </div>
            </div>
        </div>
    );
};

// Render General Dividends Box
export const renderDividends = (stock) => {
    const renderRow = (label, value) => (
        <div className="row-details">
            <span>{label}</span>
            <span>{value || '—'}</span>
        </div>
    );

    if (!stock) {
        return (
            <div className="row-details empty-row">
                <span>—</span>
            </div>
        );
    }

    return (
        <div className="dividends-section">
            <h1>DIVIDENDS</h1>
            <div className="block-container">
                <div className='split-table'>
                    {renderRow('Dividend Per Share', stock.dividend_per_share)}
                    {renderRow('Dividend Yield', stock.dividend_yield)}
                    {renderRow('Payout Ratio', (stock.dividend_per_share / stock.eps * 100).toFixed(2) + ' %')}
                    {renderRow('Dividend Date', stock.dividend_date)}
                    {renderRow('Ex Dividend Date', stock.ex_dividend_date)}
                </div>
            </div>
        </div>
    );
};


// Render Table
export const renderTable = (data, renderRowFunc) => {
    return Object.values(data).map((item, index) => renderRowFunc(item));
};

// Gets all necessary data for the Details Page 
export const fetchSpecificStock = async (apiBaseUrl, symbol) => {
    try {
        
        const response = await axios.get(`${apiBaseUrl}/stock/list/`);
        const stockSymbols = response.data;
        const stockInfo = [];
        
        if (stockSymbols.includes(symbol)) {
            
            try {
                
                const overviewResponse = await axios.get(`${apiBaseUrl}/stock/overview/${symbol}/`);
                const intradayResponse = await axios.get(`${apiBaseUrl}/stock/intraday/latest/${symbol}/`); // Use the new endpoint
                const historicalResponse = await axios.get(`${apiBaseUrl}/stock/historical/latest/${symbol}/`);
                
                const overviewData =  overviewResponse.data.fields;
                const historicalData = historicalResponse.data.fields;
                const intradayData = intradayResponse.data.fields; // Assuming the endpoint returns a single object now
                
                const change = parseFloat(intradayData.close) - parseFloat(historicalData.open);
                const percentChange = (change / parseFloat(historicalData.open)) * 100;

                const data_obj = {
                    name: overviewData.name,
                    symbol: overviewData.symbol,
                    asset_type: overviewData.asset_type,
                    description: overviewData.description,
                    cik: overviewData.cik,
                    exchange: overviewData.exchange,
                    currency: overviewData.currency,
                    country: overviewData.country,
                    sector: overviewData.sector,
                    industry: overviewData.industry,
                    address: overviewData.address,
                    fiscal_year_end: overviewData.fiscal_year_end,
                    latest_quarter: overviewData.latest_quarter,
                    market_capitalization: formatPrice(overviewData.market_capitalization),
                    ebitda: overviewData.ebitda,
                    pe_ratio: overviewData.pe_ratio,
                    peg_ratio: overviewData.peg_ratio,
                    book_value: overviewData.book_value,
                    dividend_per_share: overviewData.dividend_per_share,
                    dividend_yield: overviewData.dividend_yield,
                    eps: overviewData.eps,
                    revenue_per_share_ttm: overviewData.revenue_per_share_ttm,
                    profit_margin: overviewData.profit_margin,
                    operating_margin_ttm: overviewData.operating_margin_ttm,
                    return_on_assets_ttm: overviewData.return_on_assets_ttm,
                    return_on_equity_ttm: overviewData.return_on_equity_ttm,
                    revenue_ttm: overviewData.revenue_ttm,
                    gross_profit_ttm: formatPrice(overviewData.gross_profit_ttm),
                    diluted_eps_ttm: overviewData.diluted_eps_ttm,
                    quarterly_earnings_growth_yoy: overviewData.quarterly_earnings_growth_yoy,
                    quarterly_revenue_growth_yoy: overviewData.quarterly_revenue_growth_yoy,
                    analyst_target_price: overviewData.analyst_target_price,
                    trailing_pe: overviewData.trailing_pe,
                    forward_pe: overviewData.forward_pe,
                    price_to_sales_ratio_ttm: overviewData.price_to_sales_ratio_ttm,
                    price_to_book_ratio: overviewData.price_to_book_ratio,
                    ev_to_revenue: overviewData.ev_to_revenue,
                    ev_to_ebitda: overviewData.ev_to_ebitda,
                    beta: overviewData.beta,
                    week_52_high: overviewData.week_52_high,
                    week_52_low: overviewData.week_52_low,
                    day_50_moving_average: overviewData.day_50_moving_average,
                    day_200_moving_average: overviewData.day_200_moving_average,
                    shares_outstanding: formatPrice(overviewData.shares_outstanding),
                    dividend_date: overviewData.dividend_date,
                    ex_dividend_date: overviewData.ex_dividend_date,
                    price: intradayData.close,
                    change: change.toFixed(2),
                    percentChange: percentChange.toFixed(2),
                    volume: historicalData.volume
                };

                stockInfo.push(data_obj);
                
            } catch (error) {
                console.error(`Error updating stock ${symbol}:`, error);
            }
        }
        
        return stockInfo;
    } catch (error) {
        console.error('Error fetching specific indexes:', error);
        return [];
    }
};

// Format Volume
export const formatVolume = (volume) => {
    if (volume >= 1e9) {
        return (volume / 1e9).toFixed(3) + 'B';
    } else if (volume >= 1e6) {
        return (volume / 1e6).toFixed(3) + 'M';
    } else {
        return volume.toLocaleString();
    }
};

// Format Market Cap function
function formatPrice(marketCap) {
    const suffixes = ['', 'K', 'M', 'B', 'T'];
    let suffixIndex = 0;
  
    while (marketCap >= 1000 && suffixIndex < suffixes.length - 1) {
      marketCap /= 1000;
      suffixIndex++;
    }
  
    return marketCap.toFixed(1) + ' ' + suffixes[suffixIndex];
}

// Format to Percentage
function formatPercentage(number) {
    if (typeof number !== 'number') {
        throw new Error('Input must be a number');
    }
    return (number * 100).toFixed(2) + '%';
}