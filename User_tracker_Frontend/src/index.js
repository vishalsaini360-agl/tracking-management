// import "./utils/gtagStub"
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./style/global.css";
import { Provider as ReduxProvider } from "react-redux";
import STORE from "./redux/store";
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <ReduxProvider store={STORE}>
    <App />
  </ReduxProvider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals 
