-- Create the StockData database if it doesn't exist
CREATE DATABASE IF NOT EXISTS StockData;

-- Select the StockData database for use
USE StockData;

-- Drop existing tables if they exist
DROP TABLE IF EXISTS intraday_data;
DROP TABLE IF EXISTS historical_data;
DROP TABLE IF EXISTS stock_overview;

-- Creation of the stock_overview table with expanded fields
CREATE TABLE stock_overview (
    ID INT AUTO_INCREMENT PRIMARY KEY,
    symbol VARCHAR(10) NOT NULL UNIQUE,
    asset_type VARCHAR(50),
    name VARCHAR(255),
    description TEXT,
    cik VARCHAR(10),
    exchange VARCHAR(50),
    currency VARCHAR(10),
    country VARCHAR(50),
    sector VARCHAR(255),
    industry VARCHAR(255),
    address TEXT,
    fiscal_year_end VARCHAR(10),
    latest_quarter DATE,
    market_capitalization BIGINT,
    ebitda BIGINT,
    pe_ratio DECIMAL(10, 2),
    peg_ratio DECIMAL(10, 2),
    book_value DECIMAL(10, 2),
    dividend_per_share DECIMAL(10, 2),
    dividend_yield DECIMAL(10, 4),
    eps DECIMAL(10, 2),
    revenue_per_share_ttm DECIMAL(10, 2),
    profit_margin DECIMAL(10, 4),
    operating_margin_ttm DECIMAL(10, 4),
    return_on_assets_ttm DECIMAL(10, 4),
    return_on_equity_ttm DECIMAL(10, 4),
    revenue_ttm BIGINT,
    gross_profit_ttm BIGINT,
    diluted_eps_ttm DECIMAL(10, 2),
    quarterly_earnings_growth_yoy DECIMAL(10, 4),
    quarterly_revenue_growth_yoy DECIMAL(10, 4),
    analyst_target_price DECIMAL(10, 2),
    trailing_pe DECIMAL(10, 2),
    forward_pe DECIMAL(10, 2),
    price_to_sales_ratio_ttm DECIMAL(10, 4),
    price_to_book_ratio DECIMAL(10, 4),
    ev_to_revenue DECIMAL(10, 4),
    ev_to_ebitda DECIMAL(10, 4),
    beta DECIMAL(10, 4),
    week_52_high DECIMAL(10, 2),
    week_52_low DECIMAL(10, 2),
    day_50_moving_average DECIMAL(10, 2),
    day_200_moving_average DECIMAL(10, 2),
    shares_outstanding BIGINT,
    dividend_date DATE,
    ex_dividend_date DATE
);

-- Creation of the intraday_data table
CREATE TABLE intraday_data (
    ID INT,
    symbol VARCHAR(10) NOT NULL,
    date DATETIME NOT NULL,
    open DECIMAL(10, 2),
    high DECIMAL(10, 2),
    low DECIMAL(10, 2),
    close DECIMAL(10, 2),
    volume BIGINT,
    FOREIGN KEY (ID) REFERENCES stock_overview(ID),
    PRIMARY KEY (ID, date)
);

-- Creation of the historical_data table
CREATE TABLE historical_data (
    ID INT,
    symbol VARCHAR(10) NOT NULL,
    date DATE NOT NULL,
    open DECIMAL(10, 2),
    high DECIMAL(10, 2),
    low DECIMAL(10, 2),
    close DECIMAL(10, 2),
    volume BIGINT,
    FOREIGN KEY (ID) REFERENCES stock_overview(ID),
    PRIMARY KEY (ID, date)
);
