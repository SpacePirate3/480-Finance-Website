import React, {useState, useEffect, useRef} from 'react';
import {createChart} from "lightweight-charts";
import axios from "axios";
import {render} from "@testing-library/react";
import {renderTableRow} from "../../HomePage/Utility";
import './DetailedGraph.css';
import { renderComponent, renderAbout, fetchSpecificStock } 
from '../OverviewComponents/OverviewComponents.js';
import { apiObject } from '../../HomePage/Utility';
export default DetailedGraph;

function DetailedGraph({symbol = 'AMZN'}) {
    const apiBaseUrl = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8000/api'
    const [about_data, setStockIcome] = useState([]);
    var stock = null
    var currentPeriod
    var currentType
    var currentVersion
    const chartRef = useRef(null); 
    var chart = useRef(null);
    var series = useRef(null);
    useEffect(() => {
        // Fetches Data for Company
        fetchCompanyData();

        // Chart Building
        // Updates Chart
        const chartOptions = {
            layout: {
                textColor: 'black',
                background: {
                    type: 'solid',
                    color: 'white'
                },
                ticksVisible: true,
                fixRightEdge: true
            },
        };
        
        if (chartRef.current) {
            chart.current = createChart(chartRef.current, chartOptions);
            buildChart();
            initializeOverview();
        }

        // Add event listener for window resize
        window.addEventListener('resize', handleResize);

        // Remove event listener on component unmount
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    // Trigger to update page's components
    const fetchCompanyData = async () => {
        const stockData = await fetchSpecificStock(apiBaseUrl, symbol); // Gets Stock Info
        setStockIcome(stockData);
    };

    // Handles the charts size if window size is changed 
    // (I think there is a better way of doing this) 
    const handleResize = () => {
        if (chart) {
           chart.current.resize(document.getElementsByClassName("stock-chart")[0].clientWidth, document.getElementsByClassName("stock-chart")[0].clientHeight);
        }
    };

    
    const buildChart = async ( type="candlestick", period= null, version="historical" ) => {
        // If a Current Chart exist, it is removed
        if (series.current !== null) {
            chart.current.removeSeries(series.current);
        }

        currentPeriod = period

        if (version === "intraday") {
            
            currentVersion = "intraday"
            
            if (type === "line") {
                currentType = "line"
                
                var response = await apiObject.get(`${apiBaseUrl}/stock/chart/line/intraday/${symbol}/`)
                var data = response.data.map(item => item.fields)
                lineChart(data)
               chart.current.timeScale().applyOptions({
                    timeVisible: true,
                    secondsVisible: true,
                });
            } else if (type === "candlestick") {
                currentType = "candlestick"
                if (period === null) {
                    period = "1"
                }
                var response = await apiObject.get(`${apiBaseUrl}/stock/chart/candlestick/intraday/${symbol}/${period}/`)
                candlestickChart(response.data, period)
               chart.current.timeScale().applyOptions({
                    timeVisible: true,
                    secondsVisible: true,
                });
            }
        }else if (version ==="historical") {
            currentVersion = "historical"
            if (type === "line") {
                currentType = "line"
                var response = await apiObject.get(`${apiBaseUrl}/stock/chart/line/historical/${symbol}/`)
                var data = response.data.map(item => item.fields)
                lineChart(data)
               chart.current.timeScale().applyOptions({
                    timeVisible: false,
                    secondsVisible: false,
                });
            }else if (type === "candlestick") {
                currentType = "candlestick"
                if (period === null) {
                    period = "1"
                }
                var response = await apiObject.get(`${apiBaseUrl}/stock/chart/candlestick/historical/${symbol}/${period}/`)
                candlestickChart(response.data, period)
               chart.current.timeScale().applyOptions({
                    timeVisible: false,
                    secondsVisible: false,
                });
            }
        }
       chart.current.timeScale().fitContent()
        var scale =chart.current.timeScale().getVisibleLogicalRange()
       chart.current.timeScale().setVisibleLogicalRange({from: scale.to - 30, to: scale.to})
    };

    const lineChart = (data) => {
        series.current =chart.current.addLineSeries()
        var datetime = ""
        for (const datapoint of data) {
            datetime = datetime.concat(datapoint.date.substring(0, 10), ' ', datapoint.date.substring(11, 19))
            var time = Date.parse(datetime) / 1000
            var price = parseFloat(datapoint.close)
            series.current.update({time:time, value:price})
            datetime = ""
        }
    };

    const candlestickChart = (data, period) => {
        series.current =chart.current.addCandlestickSeries()
        var datetime = ""
        for (const datapoint of data) {
            var time = Date.parse(datapoint[0]) / 1000
            series.current.update({time:time, high:parseFloat(datapoint[1]), low:parseFloat(datapoint[2]), open:parseFloat(datapoint[3]), close:parseFloat(datapoint[4])})
            datetime = ""
        }
    };

    const initializeOverview = async() => {
            const stock = await apiObject.get(`${apiBaseUrl}/stock/overview/simple/${symbol}/`)
            let container = document.getElementById("header")
            let string = `${stock.data.name} | ${stock.data.symbol}`
            let txt = document.createTextNode(string)
            container.appendChild(txt)
            container = document.getElementById("date")
            string = Date().toString()
            txt = document.createTextNode(string)
            container.appendChild(txt)
    };

    return (

        <div className="general-graph-component graph-container">
            <div className='grid-container-graph'>
                <div>
                    <div className="graph-title">
                        <h1 id ="header"></h1>
                        <h2 id ="date"></h2>
                    </div>
                    <div className="graph-container">
                        <div ref={chartRef} className="stock-chart"/>
                        <section className='split-container-button'>
                            <div className="ButtonSelectors split-buttons-box" id='table1'>
                                <button onClick={() => buildChart(currentType, "1", "intraday")}>Minute</button>
                                <button onClick={() => buildChart(currentType, "60", "intraday")}>1 Hour</button>
                                <button onClick={() => buildChart(currentType, "360", "intraday")}>6 Hour</button>
                                <button onClick={() => buildChart(currentType, "1", "historical")}>Day</button>
                                <button onClick={() => buildChart(currentType, "1", "intraday")}>Intraday</button>
                                <button onClick={() => buildChart(currentType, "7", "historical")}>Week</button>
                                <button onClick={() => buildChart(currentType, "30", "historical")}>Month</button>
                            </div>
                            <div className="ButtonSelectors split-buttons-box" id='table2'>
                                <button onClick={() => buildChart("line", null, currentVersion)}>Line Graph</button>
                                <button onClick={() => buildChart("candlestick", currentPeriod, currentVersion)}>Candlestick</button>
                            </div>
                        </section>
                    </div>
                </div>            
                <div>
                    <div className="flex-component-about about-section"> {}
                        <h1>ABOUT THE COMPANY</h1>
                        {renderComponent(about_data, renderAbout)}
                    </div>
                </div>

            </div>
        </div>
    );
}