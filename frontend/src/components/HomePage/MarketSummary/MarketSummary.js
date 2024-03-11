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
    const [currentTime, setCurrentTime] = useState('');
    const [lastUpdateTime, setLastUpdateTime] = useState(''); // State for the last update time
    const specificSymbols = ['AMZN', 'GOOGL', 'AAPL', 'META', 'NFLX'];
    const colors = ['#FF9900', '#2BA24C', '#000000', '#1178F2', '#D91921'];

    const updateTime = () => {
        const now = new Date();
        const options = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit', timeZoneName: 'short' };
        const formattedDateTime = now.toLocaleDateString('en-US', options);
        setCurrentTime(formattedDateTime);
    };

    const fetchData = async () => {
        const updatedIndexes = await fetchSpecificIndexes(apiBaseUrl, specificSymbols);
        setIndexes(updatedIndexes);
    };

    useEffect(() => {
        // Initial setup
        fetchData();
        buildChart();

        // Set intervals for periodic data updates
        const dataFetchInterval = setInterval(fetchData, 60000);
        const timeInterval = setInterval(updateTime, 1000);
        updateTime(); // Initialize immediately

        // Event listeners for responsive chart
        const handleResize = () => {
            if (chartRef.current) {
                const container = document.getElementsByClassName('home-stock-chart')[0];
                const width = container.clientWidth;
                const height = container.clientHeight;
                chartRef.current.resize(width, height);
            }
        };

        window.addEventListener('resize', handleResize);
        handleResize(); // Initial resize

        return () => {
            clearInterval(dataFetchInterval);
            clearInterval(timeInterval);
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    useEffect(() => {
        // Refetch and update chart data periodically
        const chartUpdateInterval = setInterval(fetchDataForAllSeries, 60000);
        return () => clearInterval(chartUpdateInterval);
    }, []);

    const fetchDataForAllSeries = async () => {
        if (!chartRef.current) return; // Ensure chart is initialized
        for (let i = 0; i < specificSymbols.length; i++) {
            await fetchDataForSeries(apiBaseUrl, specificSymbols[i], seriesRef.current[i]);
        }
    };

    const fetchDataForSeries = async (apiBaseUrl, symbol, series) => {
        const response = await axios.get(`${apiBaseUrl}/stock/chart/line/intraday/${symbol}/`);
        const data = response.data.map(item => ({
            time: Date.parse(item.fields.date) / 1000,
            value: parseFloat(item.fields.open) - parseFloat(item.fields.close),
        }));
        series.setData(data);

        // Update last update time
        const now = new Date();
        setLastUpdateTime(now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    };

    const buildChart = () => {
        const container = document.getElementsByClassName('home-stock-chart')[0];
        if (!container || chartRef.current) return;

        const chartOptions = {
            layout: { textColor: 'black', background: { type: 'solid', color: 'white' } },
        };
        const chart = createChart(container, chartOptions);
        chartRef.current = chart;

        specificSymbols.forEach((symbol, index) => {
            const series = chart.addAreaSeries({
                lineColor: colors[index],
                topColor: `${colors[index]}33`,
                bottomColor: `${colors[index]}00`,
                lineWidth: 3,
            });
            seriesRef.current.push(series);
        });

        fetchDataForAllSeries(); // Initial fetch for all series
    };

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

    return (
        <div className="market-container">
            <div className="home-flex-table">
                <h1>MARKET SUMMARY</h1>
                <h2>{activeStock ? `${activeStock.symbol} | ${currentTime}` : `FAANG | ${currentTime}`}</h2>
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
                    {/* Chart container */}
                </div>
                <div className="update-time-label">
                    Last updated: {lastUpdateTime}
                </div>
            </div>
        </div>
    );
}

export default MarketSummary;

