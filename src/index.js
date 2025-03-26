import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";
import { MsalProvider } from "@azure/msal-react";
import msalInstance from "./msalConfig"; // ✅ Make sure the path is correct
import App from "./App";

// Initialize MSAL instance

ReactDOM.render(
  <MsalProvider instance={msalInstance}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </MsalProvider>,
  document.getElementById("root")
);
