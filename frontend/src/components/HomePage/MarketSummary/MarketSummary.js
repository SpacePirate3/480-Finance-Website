import React, {useState, useEffect, Component, useRef} from 'react';
import './MarketSummary.css';
import '../Utility.css'
import { renderTableRow, fetchSpecificIndexes } from '../Utility';
import {createChart} from "lightweight-charts";
import axios from "axios";
import {render} from "@testing-library/react";

function MarketSummary () {
    const apiBaseUrl = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8000/api';
    const [activeStock, setActiveStock] = useState(null);
    const [indexes, setIndexes] = useState([]);
    const chartRef = useRef(null); // Use this ref to store the chart instance
    const seriesRef = useRef([]); // Use this ref to store the series
    var series=[];
    const specificSymbols = ['AMZN', 'GOOGL', 'AAPL', 'META', 'NFLX'];

    const fetchData = async () => {
        const updatedIndexes = await fetchSpecificIndexes(apiBaseUrl, specificSymbols);
        setIndexes(updatedIndexes);
    };

    useEffect(() => {
        fetchData();
        const interval = setInterval(fetchData, 60000); // Fetch data every minute
        if (!chartRef.current) { // Check if chart has already been created
            buildChart();
        }
        return () => clearInterval(interval);
    }, []);

    const handleMouseEnter = (stock) => {
        setActiveStock(specificSymbols[stock]);
        alert(stock)
        seriesRef.current[stock].applyOptions({lineWidth: 6})
    };

    const handleMouseLeave = () => {
        setActiveStock(null);
        for (const line of seriesRef.current) {
            line.applyOptions({lineWidth: 3})
        }
    };

    const buildChart = async () => {
        const chartOptions = {
            layout: {textColor: 'black', background: {type: 'solid', color: 'white'}},
        };
        const container = document.getElementsByClassName("stock-chart")[0]
        if (!container || chartRef.current) return; // Prevent duplicate charts
        const apiBaseUrl = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8000/api'; //temporary until .env works
        const chart = createChart(container, chartOptions)
        chartRef.current = chart; // Store the chart instance in the ref
        chart.timeScale().applyOptions({
            timeVisible: true,
            secondsVisible: true,
            fixRightEdge: true,
            height: 500,
            ticksVisible: true
        })
        const colors = ['#FF9900', '#2BA24C', '#000000', '#1178F2', '#D91921']
        const AMZNSeries = chart.addLineSeries({color: colors[0]})
        series.push(AMZNSeries)
        const GOOGLSeries = chart.addLineSeries({color: colors[1]})
        series.push(GOOGLSeries)
        const AAPLSeries = chart.addLineSeries({color: colors[2]})
        series.push(AAPLSeries)
        const METASeries = chart.addLineSeries({color: colors[3]})
        series.push(METASeries)
        const NFLXSeries = chart.addLineSeries({color: colors[4]})
        series.push(NFLXSeries)
        const symbols = ['AMZN', 'GOOGL', 'AAPL', 'META', 'NFLX'];
        for (const symbol of symbols) {
            var response = await axios.get(`${apiBaseUrl}/stock/chart/line/intraday/${symbol}/`)
            var data = response.data.map(item => item.fields)
            var datetime = ""
            for (const datapoint of data) {
                datetime = datetime.concat(datapoint.date.substring(0, 10), ' ', datapoint.date.substring(11, 19))
                var time = Date.parse(datetime) / 1000
                const change = parseFloat(datapoint.open) - parseFloat(datapoint.close)
                switch (symbol) {
                    case 'AMZN':
                        AMZNSeries.update({time: time, value: change})
                        break;
                    case 'GOOGL':
                        GOOGLSeries.update({time: time, value: change})
                        break;
                    case 'AAPL':
                        AAPLSeries.update({time: time, value: change})
                        break;
                    case 'META':
                        METASeries.update({time: time, value: change})
                        break;
                    case 'NFLX':
                        NFLXSeries.update({time: time, value: change})
                        break;
                    default:
                        break;
                }
                datetime = ""
            }
        }
        chart.timeScale().fitContent()
        var scale = chart.timeScale().getVisibleLogicalRange()
        chart.timeScale().setVisibleLogicalRange({from: scale.to - 30, to: scale.to})
    }

    return (
        <div className="market-container">
            <div className="flex-table"> {/* Now on the left but takes up 1/3 space, adjust class naming as needed */}
                <h2>MARKET SUMMARY</h2>
                <h3>{activeStock ? `${activeStock.name} | WED, FEB 7 2024 - 7:00 PM EST` : 'APPLE | WED, FEB 7 2024 - 7:00 PM EST'}</h3>
                <div className="table">
                    <div className="table-header">
                        <span>SYMBOL</span>
                        <span>LAST</span>
                        <span>CHG</span>
                        <span>%CHG</span>
                    </div>
                    {indexes.map(renderTableRow)}
                </div>
            </div>
            <div className="flex-component"> {/* Now on the right but takes up 2/3 space, adjust class naming as needed */}
                <div className={`stock-chart ${activeStock ? 'active' : ''}`}>
                </div>
            </div>
        </div>
    );
}

export default MarketSummary;