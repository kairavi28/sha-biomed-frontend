import React from "react";
import ReactDOM from "react-dom";
import { PublicClientApplication } from "@azure/msal-browser";
import { MsalProvider } from "@azure/msal-react";
import { BrowserRouter } from "react-router-dom";
import App from "./App";

const msalConfig = {
  auth: {
    clientId: process.env.REACT_APP_CLIENT_ID, 
    authority: `https://login.microsoftonline.com/${process.env.REACT_APP_TENANT_ID}`, 
    redirectUri: process.env.REACT_APP_REDIRECT_URI,
  },
  cache: {
    cacheLocation: "sessionStorage",
    storeAuthStateInCookie: true,
  },
};

const msalInstance = new PublicClientApplication(msalConfig);

// Initialize before rendering
msalInstance.initialize().then(() => {
  ReactDOM.render(
    <MsalProvider instance={msalInstance}>
      <BrowserRouter>
      <App />
      </BrowserRouter>
    </MsalProvider>,
    document.getElementById("root")
  );
});
