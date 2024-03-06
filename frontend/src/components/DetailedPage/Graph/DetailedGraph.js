import React, {useState, useEffect, Component} from 'react';
import {createChart} from "lightweight-charts";
import axios from "axios";
import {render} from "@testing-library/react";
import {renderTableRow} from "../../HomePage/Utility";
import './DetailedGraph.css';
export default DetailedGraph;
function DetailedGraph({symbol = 'AMZN'}) {
        const apiBaseUrl = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8000/api'
        var stock = null
        var chart = null
        var series = null
        var currentPeriod
        var currentType
        var currentVersion
        useEffect(() => {
            const chartOptions = {
                layout: {textColor: 'black', background: {type: 'solid', color: 'white'}, ticksVisible: true, fixRightEdge: true},
            };
            const container = document.getElementsByClassName("stock-chart")[0]
            chart = createChart(container, chartOptions)
            buildChart()
            stock = initializeOverview()
        }, []);

        const buildChart = async (type="line",period= null, version="historical" ) => {

            if (series != null) {
                chart.removeSeries(series)
            }
            currentPeriod = period
            if (version ==="intraday") {
                currentVersion = "intraday"
                if (type === "line") {
                    currentType = "line"
                    var response = await axios.get(`${apiBaseUrl}/stock/chart/line/intraday/${symbol}/`)
                    var data = response.data.map(item => item.fields)
                    lineChart(data)
                    chart.timeScale().applyOptions({
                        timeVisible: true,
                        secondsVisible: true,
                    });
                } else if (type === "candlestick") {
                    currentType = "candlestick"
                    if (period === null) {
                        period = "1"
                    }
                    var response = await axios.get(`${apiBaseUrl}/stock/chart/candlestick/intraday/${symbol}/${period}/`)
                    candlestickChart(response.data, period)
                    chart.timeScale().applyOptions({
                        timeVisible: true,
                        secondsVisible: true,
                    });
                }
            }else if (version ==="historical") {
                currentVersion = "historical"
                if (type === "line") {
                    currentType = "line"
                    var response = await axios.get(`${apiBaseUrl}/stock/chart/line/historical/${symbol}/`)
                    var data = response.data.map(item => item.fields)
                    lineChart(data)
                    chart.timeScale().applyOptions({
                        timeVisible: false,
                        secondsVisible: false,
                    });
                }else if (type === "candlestick") {
                    currentType = "candlestick"
                    if (period === null) {
                        period = "1"
                    }
                    var response = await axios.get(`${apiBaseUrl}/stock/chart/candlestick/historical/${symbol}/${period}/`)
                    candlestickChart(response.data, period)
                    chart.timeScale().applyOptions({
                        timeVisible: false,
                        secondsVisible: false,
                    });
                }
            }
            chart.timeScale().fitContent()
            var scale = chart.timeScale().getVisibleLogicalRange()
            chart.timeScale().setVisibleLogicalRange({from: scale.to - 30, to: scale.to})

        }
        const lineChart = (data) => {
            series = chart.addLineSeries()
            var datetime = ""
            for (const datapoint of data) {
                datetime = datetime.concat(datapoint.date.substring(0, 10), ' ', datapoint.date.substring(11, 19))
                var time = Date.parse(datetime) / 1000
                var price = parseFloat(datapoint.close)
                series.update({time:time, value:price})
                datetime = ""
            }
        }
        const candlestickChart = (data, period) => {
            series = chart.addCandlestickSeries()
            var datetime = ""
            for (const datapoint of data) {
                var time = Date.parse(datapoint[0]) / 1000
                series.update({time:time, high:parseFloat(datapoint[1]), low:parseFloat(datapoint[2]), open:parseFloat(datapoint[3]), close:parseFloat(datapoint[4])})
                datetime = ""
            }
        }
        const initializeOverview = async() => {
                const stock = await axios.get(`${apiBaseUrl}/stock/overview/simple/${symbol}/`)
                let container = document.getElementById("header")
                let string = `${stock.data.name} | ${stock.data.symbol}`
                let txt = document.createTextNode(string)
                container.appendChild(txt)
                container = document.getElementById("date")
                string = Date().toString()
                txt = document.createTextNode(string)
                container.appendChild(txt)
        }
             return (
            <div className="graph-container">
                <div className="graph-area">
                    <h2 id ="header"></h2>
                    <h3 id="date"></h3>
                    <div className="stock-chart">
                    </div>
                </div>
                <div className="ButtonSelectors">
                    <div className="ButtonHeaders">
                        <h3>Graph Type</h3>
                        <h3>Time Frame</h3>
                        <h3>Intraday Periods</h3>
                        <h3>Daily Periods</h3>
                    </div>
                    <div className="Buttons">
                    <div className="TypeButtons">
                        <button onClick={() => buildChart("line", null, currentVersion)}>Line Graph</button>
                        <button onClick={() => buildChart("candlestick", currentPeriod, currentVersion)}>Candlestick
                        </button>
                    </div>
                    <div className="TimeButtons">
                        <button onClick={() => buildChart(currentType, "1", "intraday")}>Intraday</button>
                        <button onClick={() => buildChart(currentType, "1", "historical")}>Daily</button>
                    </div>
                    <div className="IntradayPeriods">
                        <button onClick={() => buildChart(currentType, "1", "intraday")}>Minute</button>
                        <button onClick={() => buildChart(currentType, "60", "intraday")}>1 Hour</button>
                        <button onClick={() => buildChart(currentType, "360", "intraday")}>6 Hour</button>
                    </div>
                    <div className="HistoricalPeriods">
                        <button onClick={() => buildChart(currentType, "1", "historical")}>Day</button>
                        <button onClick={() => buildChart(currentType, "7", "historical")}>Week</button>
                        <button onClick={() => buildChart(currentType, "30", "historical")}>Month</button>
                    </div>
                    </div>
                </div>

            </div>);
}
