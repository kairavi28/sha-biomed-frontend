import React from "react";
import ReactDOM from "react-dom";
import { PublicClientApplication } from "@azure/msal-browser";
import { MsalProvider } from "@azure/msal-react";
import { BrowserRouter } from "react-router-dom";
import ScrollToTop from "./components/ScrollToTop";
import App from "./App";

const msalConfig = {
  auth: {
    clientId: `bba349cc-ea7f-454b-b50c-8e5567009324`, 
    authority: `https://login.microsoftonline.com/8e46f333-ee3f-4f9b-aab9-36ab81142f78`, 
    redirectUri: `https://biomedwaste.net/auth/callback`,
     //redirectUri: `http://localhost:3000/auth/callback`,
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
      <ScrollToTop />
      <App />
      </BrowserRouter>
    </MsalProvider>,
    document.getElementById("root")
  );
});
