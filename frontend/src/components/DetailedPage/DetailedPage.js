import Header from "../Header/Header";
import DetailedGraph from "./Graph/DetailedGraph";
import {
  BrowserRouter as Router,
  Link,
  Route,
  Routes,
  useParams,
} from "react-router-dom";

import React from "react";

export default DetailedPage
function DetailedPage() {

  const{stockSymbol} = useParams()
  return (
    <div>
      Hello?? {stockSymbol}
      <Header />
    </div>
  );
}