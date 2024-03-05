import React, { useState, useEffect, useRef } from 'react';
import './MarketSummary.css';
import '../Utility.css';
import { renderTableRow, fetchSpecificIndexes } from '../Utility';
import { createChart } from 'lightweight-charts';
import axios from 'axios';

function MarketSummary() {
    const apiBaseUrl = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8000/api';
    const [activeStock, setActiveStock] = useState(null);
    const [indexes, setIndexes] = useState([]);
    const chartRef = useRef(null);
    const seriesRef = useRef([]);
    const specificSymbols = ['AMZN', 'GOOGL', 'AAPL', 'META', 'NFLX'];
    const colors = ['#FF9900', '#2BA24C', '#000000', '#1178F2', '#D91921'];

    const fetchData = async () => {
        const updatedIndexes = await fetchSpecificIndexes(apiBaseUrl, specificSymbols);
        setIndexes(updatedIndexes);
    };

    useEffect(() => {
        fetchData();
        const interval = setInterval(fetchData, 60000);
        if (!chartRef.current) {
            buildChart();
        }
        return () => clearInterval(interval);
    }, []);

    const handleMouseEnter = (index) => {
        setActiveStock(indexes[index]);
        seriesRef.current.forEach((series, idx) => {
            if (idx === index) {
                series.applyOptions({
                    lineWidth: 8,
                    topColor: `${colors[index]}99`, // Increase opacity for the hovered stock
                });
            } else {
                series.applyOptions({
                    lineWidth: 1,
                    topColor: `${colors[idx]}1A`, // Reduce opacity for the other stocks (1A is ~10% opacity)
                });
            }
        });
    };
    
    const handleMouseLeave = () => {
        setActiveStock(null);
        seriesRef.current.forEach((series, idx) => {
            series.applyOptions({
                lineWidth: 3,
                topColor: `${colors[idx]}33`, // Revert to original opacity for the area fill
            });
        });
    };

    const buildChart = async () => {
        const chartOptions = {
            layout: { textColor: 'black', background: { type: 'solid', color: 'white' } },
        };
        const container = document.getElementsByClassName('home-stock-chart')[0];
        if (!container || chartRef.current) return;
        const chart = createChart(container, chartOptions);
        chartRef.current = chart;
        chart.timeScale().applyOptions({
            timeVisible: true,
            secondsVisible: true,
            fixRightEdge: true,
            height: 500,
            ticksVisible: true
        });
        specificSymbols.forEach((symbol, index) => {
            const series = chart.addAreaSeries({ 
                lineColor: colors[index],
                topColor: `${colors[index]}33`, // Lighter shade for the area fill (33 is the opacity in hex)
                bottomColor: `${colors[index]}00`, // Transparent at the bottom
                lineWidth: 3,
            });
            seriesRef.current.push(series);
            fetchDataForSeries(apiBaseUrl, symbol, series);
        });
        await Promise.all(specificSymbols.map(symbol => fetchDataForSeries(apiBaseUrl, symbol, seriesRef.current[specificSymbols.indexOf(symbol)])));
        chart.timeScale().fitContent(); // Adjust the time scale to fit the data
    
        // Zoom in to the last 30 data points
        const logicalRange = chart.timeScale().getVisibleLogicalRange();
        if (logicalRange) {
            const zoomRange = { from: logicalRange.to - 30, to: logicalRange.to };
            chart.timeScale().setVisibleLogicalRange(zoomRange);
        }
    };

    const fetchDataForSeries = async (apiBaseUrl, symbol, series) => {
        const response = await axios.get(`${apiBaseUrl}/stock/chart/line/intraday/${symbol}/`);
        const data = response.data.map(item => item.fields);
        const chartData = data.map(datapoint => {
            const datetime = Date.parse(datapoint.date) / 1000;
            const change = parseFloat(datapoint.open) - parseFloat(datapoint.close);
            return { time: datetime, value: change };
        });
        series.setData(chartData);
    };

    return (
        <div className="market-container">
            <div className="home-flex-table">
                <h1>MARKET SUMMARY</h1>
                <h2>{activeStock ? `${activeStock.symbol} | WED, FEB 7 2024 - 7:00 PM EST` : 'FAANG | WED, FEB 7 2024 - 7:00 PM EST'}</h2>
                <div className="home-table">
                    <div className="home-table-header">
                        <span>SYMBOL</span>
                        <span>LAST</span>
                        <span>CHG</span>
                        <span>%CHG</span>
                    </div>
                    {indexes.map((stock, index) => (
                        <div
                            key={index}
                            onMouseEnter={() => handleMouseEnter(index)}
                            onMouseLeave={handleMouseLeave}
                        >
                            {renderTableRow(stock)}
                        </div>
                    ))}
                </div>
            </div>
            <div className="home-flex-component">
                <div className={`home-stock-chart ${activeStock ? 'active' : ''}`}>
                </div>
            </div>
        </div>
    );
}

export default MarketSummary;
