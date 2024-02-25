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
        const specificSymbols = ['SPGI', 'DOW', 'NDAQ'];
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
                height: 500,
                width: 1000
            };
            const container = document.getElementsByClassName("stock-chart")[0]
            const apiBaseUrl = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8000/api'; //temporary until .env works
            const chart = createChart(container, chartOptions)
            chart.timeScale().applyOptions({timeVisible: true, secondsVisible: true})
            const SNPSeries = chart.addLineSeries()
            const DOWSeries = chart.addLineSeries()
            const NDAQSeries = chart.addLineSeries()

            var response = await axios.get(`${apiBaseUrl}/stock/chart/line/DOW/`)
            var data = response.data.map(item => item.fields)
            var datetime = ""
            for (const datapoint of data) {
                datetime = datetime.concat(datapoint.date.substring(0, 10), ' ', datapoint.date.substring(11, 19))
                var time = Date.parse(datetime) / 1000
                const price = parseFloat(datapoint.close)
                DOWSeries.update({time: time, value: price})
                datetime = ""
            }
            var response = await axios.get(`${apiBaseUrl}/stock/chart/line/NDAQ/`)
            var data = response.data.map(item => item.fields)
            var datetime = ""
            for (const datapoint of data) {
                datetime = datetime.concat(datapoint.date.substring(0, 10), ' ', datapoint.date.substring(11, 19))
                var time = Date.parse(datetime) / 1000
                const price = parseFloat(datapoint.close)
                NDAQSeries.update({time: time, value: price})
                datetime = ""
            }
            chart.timeScale().fitContent()
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


