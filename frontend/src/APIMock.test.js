import MockAdapter from 'axios-mock-adapter';
import axios from 'axios';
import { apiObject } from './components/HomePage/Utility';
import App from './components/App';

import { BrowserRouter, MemoryRouter } from 'react-router-dom';
import {
    fireEvent, 
    render,
    waitFor,
  } from "@testing-library/react";

test('Fake Test So THe API Mock File Can Be A Test File And Not Interfere With Real JS Files', () => {
    expect(true).toBe(true);
  });
const apiBaseUrl = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8000/api';
//initially, the mock has not been created
var mockCreated = false;
var mock 
//we need to mock 4 kinds of function calls: /stock/list, /stock/overview/simple/symbol, /stock/historical/latest/symbol, /stock/chart/line/intraday/symbol/ and /stock/intraday/latest/symbol
//so first we make a map mapping each stock symbol we have to a stock_id. 
//we have the createMock function. this will make the mock adapter if it hasn't already been made, and if it has been made, return it
//createMock makes a mock.onGet for each of the stocks, that contains the same data for each stock, except the "stock_id" field, for each of the 4 api call types


const stockStockIdMap = new Map([
    ["META", 1],
    ["AMZN", 2],
    ["AAPL", 3],
    ["NFLX", 4],
    ["GOOGL", 5],
    ["DELL", 6],
    ["INTC", 7],
    ["MSFT", 8],
    ["NVDA", 9],
    ["IBM", 10],
    ["AMD", 11],
    ["HPQ", 12],
    ["TSLA", 13],
    ["TMUS", 14],
    ["VZ", 15],
  ]);

var testingDate = "2024-03-07"
var testingDateTime = "2024-03-07T19:59:00Z"
var testingDateTime2 = "2024-03-07T20:00:00Z"
var testingOpen = "132.80"
var testingHigh = "5498.81"
var testingLow = "5498.80"
var testingClose = "598.81"
var testingVolume = 54985498

function mockStockChartLine(symbol, stockid){
    return [{"model": "app.intradaydata", "pk": stockid, "fields": {"stock_id": stockid, "date": testingDateTime, "open": testingOpen, "high": testingHigh, "low": testingLow, "close": testingClose, "volume": testingVolume}}, 
    {"model": "app.intradaydata", "pk": stockid, "fields": {"stock_id": stockid, "date": testingDateTime2, "open": testingOpen, "high": testingHigh, "low": testingLow, "close": testingClose, "volume": testingVolume}}];
}
function mockOverviewSimple(symbol){
    return {"name":`Name is: ${symbol}', 'symbol':'symbol`}
}
function mockHistoricalLatest(symbol, stockid){
    return {"model": "app.historicaldata", "pk": stockid, "fields": {"stock_id": stockid, "date": testingDate, "open": testingOpen , "high": testingHigh, "low": testingLow, "close": testingClose, "volume": testingVolume}}
}
function mockIntradayLatest(symbol, stockid){
    return {"model": "app.intradaydata", "pk": stockid, "fields": {"stock_id": stockid, "date": testingDateTime, "open": testingOpen , "high": testingHigh, "low": testingLow, "close": testingClose, "volume": testingVolume}}
}


function mockStockList(){
    let result = []
    for(let [key,value] of stockStockIdMap){
        result.push(key);
        
        
    }
    //console.log("result is: ",result);
    return result;
}


export function getMock(){
    if(!mockCreated){
        mock = new MockAdapter(apiObject);
        console.log(("made mock"));
        mock.onGet(`${apiBaseUrl}/stock/list/`).reply(200,mockStockList());
        for(let [key,value] of stockStockIdMap){
            mock.onGet(`${apiBaseUrl}/stock/overview/simple/${key}/`).reply(200, mockOverviewSimple(key));
            mock.onGet(`${apiBaseUrl}/stock/historical/latest/${key}/`).reply(200, mockHistoricalLatest(key,value));;
            mock.onGet(`${apiBaseUrl}/stock/intraday/latest/${key}/`).reply(200, mockIntradayLatest(key,value));
            mock.onGet(`${apiBaseUrl}/stock/chart/line/intraday/${key}/`).reply(200, mockStockChartLine(key,value));

        }
        mockCreated=false;
    }
    
    return mock;
    

}


test("AXIOS mock adapter works", () => {
    let spy = jest.spyOn(apiObject, 'get');
    getMock();
    apiObject.get('http://localhost:8000/api/stock/chart/line/intraday/GOOGL/').then(function (response) {
        //console.log(response.data);
      });
    expect(spy).toHaveBeenCalled();

  });

  window.matchMedia = jest.fn(() => ({ matches: false, addListener: jest.fn(), removeListener: jest.fn() }));
test('renders NVDA link 2 : electric boogaloo', async () => {
  let spy = jest.spyOn(apiObject, 'get');
  getMock();
  //await waitFor(() => {
    //render(<BrowserRouter><App /></BrowserRouter>);
    const linkElement = screen.getByText(/META/i);
    expect(linkElement).toBeInTheDocument();
    //});
  //await waitFor(() => {
    //expect(spy).toHaveBeenCalled();
  //});
});
