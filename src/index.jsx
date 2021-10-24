import React from "react";
import ReactDOM from "react-dom";
import "mdb-react-ui-kit/dist/css/mdb.min.css";
import "../src/assets/admin/css/style.css";
import App from "./App";
import styled from "styled-components";
import "../node_modules/bootstrap/dist/js/bootstrap.bundle";

const BackGround = styled.div`
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: #a9c9ff;
  background-image: linear-gradient(
    180deg,
    #a9c9ff 0%,
    #ffbbec 100%
  ) !important;
  z-index: -1;
`;

ReactDOM.render(
  <React.StrictMode>
    <BackGround />
    <App />
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();
