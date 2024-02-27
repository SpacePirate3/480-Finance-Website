import React, {useState, useEffect, Component} from 'react';
import {createChart} from "lightweight-charts";
import axios from "axios";
import {render} from "@testing-library/react";
import {renderTableRow} from "../../HomePage/Utility";
export default DetailedGraph;
function DetailedGraph(symbol) {
        const apiBaseUrl = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8000/api'
        var stock = null
        var chart = null
        var series = null
        useEffect(() => {
            const chartOptions = {
                layout: {textColor: 'black', background: {type: 'solid', color: 'white'}},
            };
            const container = document.getElementsByClassName("stock-chart")[0]
            chart = createChart(container, chartOptions)
            buildChart()
        }, []);
        const buildChart = async (type="line",period= null, version="historical" ) => {
            if (series != null) {
                chart.removeSeries(series)
            }
            if (version ==="intraday") {
                if (type === "line") {
                    var response = await axios.get(`${apiBaseUrl}/stock/chart/line/intraday/${symbol}/`)
                    var data = response.data.map(item => item.fields)
                    lineChart(data)
                } else if (type === "candlestick") {
                    var response = await axios.get(`${apiBaseUrl}/stock/chart/candlestick/intraday/${symbol}/`)
                    candlestickChart(response, period)
                }
            }else if (version ==="historical") {
                if (type === "line") {
                    var response = await axios.get(`${apiBaseUrl}/stock/chart/line/historical/${symbol}/`)
                    var data = response.data.map(item => item.fields)
                    lineChart(data)
                }else if (type === "candlestick") {
                    var response = await axios.get(`${apiBaseUrl}/stock/chart/candlestick/historical/${symbol}/`)
                    candlestickChart(data, period)
                }
            }
            chart.timeScale().fitContent()
            var scale = chart.timeScale().getVisibleLogicalRange()
            chart.timeScale().setVisibleLogicalRange({from: scale.to - 30, to: scale.to})

        }
        const lineChart = (data) => {
            chart.addLineSeries()
            var datetime = ""
            for (const datapoint of data) {
                datetime = datetime.concat(datapoint.date.substring(0, 10), ' ', datapoint.date.substring(11, 19))
                var time = Date.parse(datetime) / 1000
                var price = datapoint.close
                series.update({time:time, value:price})
            }
        }
        const candlestickChart = (data, period) => {
            chart.addCandlestickSeries()
            var datetime = ""
            for (const datapoint of data) {
                datetime = datetime.concat(datapoint[0].substring(0,10), ' ', datapoint[0].substring(11,19))
                var time = Date.parse(datetime) / 1000
                series.update({time:time, high:datapoint[1], low:datapoint[2], open:datapoint[3], close:datapoint[4]})
            }
        }
        const initializeOverview = async() => {
                stock = await axios.get(`${apiBaseUrl}/stock/overview/${symbol}/`)
        }
             return (
            <div className="market-summary">
                <div className="graph-area">
                    <h2>MARKET SUMMARY</h2>
                    <h3>{stock ? `${stock.name} | WED, FEB 7 2024 - 7:00 PM EST` : 'WED, FEB 7 2024 - 7:00 PM EST'}</h3>
                    <div className={`stock-chart ${stock ? 'active' : ''}`}>
                        {stock ? stock.name : 'Graph Placeholder'}
                    </div>
                </div>
            </div>);
}
