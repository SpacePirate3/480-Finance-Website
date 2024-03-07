import axios from 'axios';
import './OverviewComponents.css'

// Render General Income Box
export const renderGeneralIncome = (stock) => {
    // Renders row for table
    const renderRow = (label, value) => (
        <div className="row-seperator">
            <span>{label}</span>
            <span>{value || '—'}</span>
        </div>
    );
    
    // Return Container for Unloaded Items
    if (!stock) {
        return (
            <div className="block-container row-container-empty ">
                <div className="row-seperator">
                    <span>—</span>
                    <span>—</span>
                </div>
            </div>
        );
    }

    // Return Container for Income Section
    return (
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
    );
};


// Render About The Company Box
export const renderAbout = (stock) => {
    // Renders row for table
    const renderRow = (label, value) => (
        <div className="row-seperator">
            <div>{label}</div>
            <div>{value || '—'}</div>
        </div>
    );
    
    // Return Container for Unloaded Items
    if (!stock) {
        return (
            <div className="row-seperator row-container-empty">
                <div className="row-seperator">
                    <span>—</span>
                    <span>—</span>
                </div>
            </div>
        );
    }

    // Return Container for About Section
    return (
        <div className="block-seperator"> 
            <div className=''>{stock.description}</div>
            <div className='split-table description'>
                {renderRow('Sector', stock.sector)}
                {renderRow('CIK', stock.cik)}        
                {renderRow('Industry', stock.industry)}
                {renderRow('Headquarters', stock.address)}
                {renderRow('Primary Exchange', stock.exchange)}
                {renderRow('Fiscal Year Ends', stock.fiscal_year_end)}
                {renderRow('Latest Quarter', stock.latest_quarter)}
            </div>
        </div>
    );
};


// Render Share Statistics Box
export const renderShareStatistics = (stock) => {
    // Renders row for table
    const renderRow = (label, value) => (
        <div className="row-seperator">
            <span>{label}</span>
            <span>{value || '—'}</span>
        </div>
    );

    // Return Container for Unloaded Items
    if (!stock) {
        return (
            <div className="block-container row-container-empty ">
                <div className="row-seperator">
                    <span>—</span>
                    <span>—</span>
                </div>
            </div>
        );
    }

    // Return Container for Share Statistics Section
    return (  
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
    );
};


// Render Dividends Box
export const renderDividends = (stock) => {
    // Renders row for table
    const renderRow = (label, value) => (
        <div className="row-seperator">
            <span>{label}</span>
            <span>{value || '—'}</span>
        </div>
    );
    
    // Return Container for Unloaded Items
    if (!stock) {
        return (
            <div className="block-container row-container-empty ">
                <div className="row-seperator">
                    <span>—</span>
                    <span>—</span>
                </div>
            </div>
        );
    }

    // Return Container for Dividends Section
    return (
        <div className="block-container">
            <div className='split-table'>
                {renderRow('Dividend Per Share', stock.dividend_per_share)}
                {renderRow('Dividend Yield', stock.dividend_yield)}
                {renderRow('Payout Ratio', (stock.dividend_per_share / stock.eps * 100).toFixed(2) + ' %')}
                {renderRow('Dividend Date', stock.dividend_date)}
                {renderRow('Ex Dividend Date', stock.ex_dividend_date)}
            </div>
        </div>
    );
};


// Component renders selected table using input data
export const renderComponent = (data, renderFunction) => {
    const paddedData = [...data];

    // Checks if object is Populated 
    if (data.length < 1) {
        paddedData.push(undefined); // Add `undefined` for missing Obj
    }

    return paddedData.map((item, index) => renderFunction(item));
};

// Gets all necessary data for the Details Page 
export const fetchSpecificStock = async (apiBaseUrl, symbol) => {
    try {
        // Checks if stock is valid
        const response = await axios.get(`${apiBaseUrl}/stock/list/`);
        const stockSymbols = response.data;
        const stockInfo = [];
        
        if (stockSymbols.includes(symbol)) {
            
            try {
                
                // Will calculate neccesary Data
                const overviewResponse = await axios.get(`${apiBaseUrl}/stock/overview/${symbol}/`);
                const overviewData =  overviewResponse.data.fields;

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

// Render Company Name
export const renderCompanyName = (stock) => {
    if (!stock) {
        return "COMPANY";
    }
    return stock.name.toUpperCase();
}
