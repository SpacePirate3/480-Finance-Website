import React from "react";
import Header from "../Header/Header";
import DetailedGraph from "./Graph/DetailedGraph";
import DetailComponents from "./StockInfo/StockInfo";
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
    <div>
      <Header />
      <DetailedGraph
      symbol = {stockSymbol}/>
      <DetailComponents/>
    </div>
  );
}
