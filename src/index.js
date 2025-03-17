import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";
import { MsalProvider } from "@azure/msal-react";
import msalInstance from "./msalConfig"; 
import App from "./App";

ReactDOM.render(
  <MsalProvider instance={msalInstance}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </MsalProvider>,
  document.getElementById("root")
);
