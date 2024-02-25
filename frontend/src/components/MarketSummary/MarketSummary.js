import React, {Component, useState} from 'react';
import './MarketSummary.css';
import {createChart} from 'lightweight-charts'
import axios from 'axios'
class MarketSummary extends Component {
    constructor() {
        super();
        this.state = {
            activeStock: null
        }
        this.setActiveStock = this.setActiveStock.bind(this);

    }
    setActiveStock(symbol) {
        this.setState({activeStock: symbol})
    }
    render() {


        const handleMouseEnter = (stock) => {
            this.setActiveStock(stock);
        };

        const handleMouseLeave = () => {
            this.setActiveStock(null);
        };

        return (
            <div className="market-summary">
                <div className="graph-area">
                    <h2>MARKET SUMMARY</h2>
                    <h3>{this.activeStock ? `${this.activeStock.name} | WED, FEB 7 2024 - 7:00 PM EST` : 'APPLE | WED, FEB 7 2024 - 7:00 PM EST'}</h3>
                    <div className={`stock-chart ${this.activeStock ? 'active' : ''}`}>
                        {/* Placeholder for your stock chart component */}
                        {this.activeStock ? this.activeStock.name : 'Graph Placeholder'}
                    </div>
                </div>
                <div className="stock-menu-market">
                    {/* You would dynamically generate these rows based on your data */}
                    <div className="summary-container">
                        <div className="stock-table-header">
                            <span>NAME</span>
                            <span>LAST</span>
                            <span>CHG</span>
                            <span>%CHG</span>
                        </div>
                        <div className="stock-button-table-summary"
                             onMouseEnter={() => handleMouseEnter({name: 'S&P Global Inc. (SPGI)'})}
                             onMouseLeave={handleMouseLeave}>
                            <span>SPGI</span>
                            <span>293.45 USD</span>
                            <span>+24.34</span>
                            <span>+12.12%</span>
                        </div>
                        <div className="stock-button-table-summary"
                             onMouseEnter={() => handleMouseEnter({name: 'Dow Inc. (DOW)'})}
                             onMouseLeave={handleMouseLeave}>
                            <span>DOW</span>
                            <span>293.45 USD</span>
                            <span>+24.34</span>
                            <span>+12.12%</span>
                        </div>
                        <div className="stock-button-table-summary"
                             onMouseEnter={() => handleMouseEnter({name: 'NASDAQ Inc. (NDAQ)'})}
                             onMouseLeave={handleMouseLeave}>
                            <span>NDAQ</span>
                            <span>293.45 USD</span>
                            <span>+24.34</span>
                            <span>+12.12%</span>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
    componentDidMount() {
        buildChart()
    }
}
const buildChart = async () => {
    const chartOptions = { layout: { textColor: 'black', background: { type: 'solid', color: 'white' } }, height:500};
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
        datetime = datetime.concat(datapoint.date.substring(0,10), ' ',datapoint.date.substring(11,19))
        var time = Date.parse(datetime)/1000
        const price = parseFloat(datapoint.close)
        DOWSeries.update({time:time, value:price})
        datetime = ""
    }
    var response = await axios.get(`${apiBaseUrl}/stock/chart/line/NDAQ/`)
    var data = response.data.map(item => item.fields)
    var datetime = ""
    for (const datapoint of data) {
        datetime = datetime.concat(datapoint.date.substring(0,10), ' ',datapoint.date.substring(11,19))
        var time = Date.parse(datetime)/1000
        const price = parseFloat(datapoint.close)
        NDAQSeries.update({time:time, value:price})
        datetime = ""
    }
    chart.timeScale().fitContent()
}



export default MarketSummary;
