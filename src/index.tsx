import React from "react";
import { BrowserRouter } from "react-router-dom";
import ReactDOM from "react-dom/client";
import App from "./App";

const rootElement = document.getElementById("root")!;
const root = ReactDOM.createRoot(rootElement);

root.render(
  <React.StrictMode>
    /** 메인 주소를 /Wiqi로 합니다 */
    <BrowserRouter basename="/Wiqi">
      <App />
    </BrowserRouter>
  </React.StrictMode>
);