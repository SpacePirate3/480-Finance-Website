/*
Run script in SQL workbench to create StockDatabase
*/
CREATE DATABASE IF NOT EXISTS StockDatabase;

USE StockDatabase;

CREATE TABLE IF NOT EXISTS Stocks (
    symbol VARCHAR(10) PRIMARY KEY,
    name VARCHAR(100)
);

CREATE TABLE IF NOT EXISTS Stock_Data (
    id INT AUTO_INCREMENT PRIMARY KEY,
    symbol VARCHAR(10),
    date DATE,
    open FLOAT,
    high FLOAT,
    low FLOAT,
    close FLOAT,
    volume BIGINT,
    FOREIGN KEY (symbol) REFERENCES Stocks(symbol)
);
