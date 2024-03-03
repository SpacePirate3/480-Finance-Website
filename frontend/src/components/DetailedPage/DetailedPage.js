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

const DetailedPage = () => (
  <div>
      <Header/>
      <DetailComponents/>
  </div>
);

DetailedPage.propTypes = {};

DetailedPage.defaultProps = {};

export default DetailedPage;
