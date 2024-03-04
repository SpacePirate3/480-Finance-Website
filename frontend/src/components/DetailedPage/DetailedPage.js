import React from "react";
import Header from "../Header/Header";
import DetailedGraph from "./Graph/DetailedGraph";
import StockInfo from "./StockInfo/StockInfo";
import {
  BrowserRouter as Router,
  Link,
  Route,
  Routes,
  useParams,
} from "react-router-dom";

export default DetailedPage
function DetailedPage() {

  const{stockSymbol} = useParams()
  return (
    <div className="DetailedPage">
      <Header/>
      <DetailedGraph
      symbol = {stockSymbol}/>
      <StockInfo/>
    </div>
  );
}
