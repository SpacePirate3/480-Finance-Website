import React, {useState, useEffect, Component} from 'react';
import './MarketSummary.css';
import '../Utility.css'
import { renderTableRow, fetchSpecificIndexes } from '../Utility';
import {createChart} from "lightweight-charts";
import axios from "axios";
import {render} from "@testing-library/react";
export default MarketSummary;

function MarketSummary () {
    const apiBaseUrl = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8000/api';
    const [activeStock, setActiveStock] = useState(null)
    const [indexes, setIndexes] = useState([])

    const fetchData = async () => {
    const specificSymbols = ['AMZN', 'GOOGL', 'AAPL', 'META', 'NFLX'];
    const updatedIndexes = await fetchSpecificIndexes(apiBaseUrl, specificSymbols);
    setIndexes(updatedIndexes);
}

        useEffect(() => {
            fetchData();
            const interval = setInterval(fetchData, 60000); // Fetch data every minute
            buildChart()
            return () => clearInterval(interval);
        }, []);

        const handleMouseEnter = (stock) => {
            setActiveStock(stock);
        };

        const handleMouseLeave = () => {
            setActiveStock(null);
        };

        const buildChart = async () => {
            const chartOptions = {
                layout: {textColor: 'black', background: {type: 'solid', color: 'white'}},
                height: 500
            };
            const container = document.getElementsByClassName("stock-chart")[0]
            const apiBaseUrl = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8000/api'; //temporary until .env works
            const chart = createChart(container, chartOptions)
            chart.timeScale().applyOptions({timeVisible: true, secondsVisible: true})
            const colors = ['#FF9A00', '#2BA24C', '#FFFFFF', '#1877F2','#E50914' ]
            const AMZNSeries = chart.addLineSeries()
            AMZNSeries.applyOptions({color: colors[0]})
            const GOOGLSeries = chart.addLineSeries()
            GOOGLSeries.applyOptions({color: colors[1]})
            const AAPLSeries = chart.addLineSeries()
            AAPLSeries.applyOptions({color: colors[2]})
            const METASeries = chart.addLineSeries()
            METASeries.applyOptions({color:colors[3]})
            const NFLXSeries = chart.addLineSeries()
            NFLXSeries.applyOptions({color:colors[4]})
            const symbols = ['AMZN', 'GOOGL', 'AAPL', 'META', 'NFLX'];

            for (const symbol of symbols) {
                var response = await axios.get(`${apiBaseUrl}/stock/chart/line/intraday/${symbol}/`)
                var data = response.data.map(item => item.fields)
                var datetime = ""
                for (const datapoint of data) {
                    datetime = datetime.concat(datapoint.date.substring(0, 10), ' ', datapoint.date.substring(11, 19))
                    var time = Date.parse(datetime) / 1000
                    const price = parseFloat(datapoint.close) - parseFloat(datapoint.open)
                    switch(symbol) {
                        case 'AMZN':
                            AMZNSeries.update({time: time, value: price})
                            break;
                        case 'GOOGL':
                            GOOGLSeries.update({time: time, value: price})
                            break;
                        case 'AAPL':
                            AAPLSeries.update({time: time, value: price})
                            break;
                        case 'META':
                            METASeries.update({time: time, value: price})
                            break;
                        case 'NFLX':
                            NFLXSeries.update({time: time, value: price})
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
            <div className="market-summary">
                <div className="graph-area">
                    <h2>MARKET SUMMARY</h2>
                    <h3>{activeStock ? `${activeStock.name} | WED, FEB 7 2024 - 7:00 PM EST` : 'APPLE | WED, FEB 7 2024 - 7:00 PM EST'}</h3>
                    <div className={`stock-chart ${activeStock ? 'active' : ''}`}>
                        {activeStock ? activeStock.name : 'Graph Placeholder'}
                    </div>
                </div>
                <div className="indexes-container">
                    <div className="indexes-section">
                        <h2>INDEXES</h2>
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
                </div>
            </div>);


    }


