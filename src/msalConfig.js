import { PublicClientApplication } from "@azure/msal-browser";

const msalConfig = {
  auth: {
    clientId: "bba349cc-ea7f-454b-b50c-8e5567009324", 
    authority: "https://login.microsoftonline.com/common", 
    redirectUri: "http://localhost:3000/auth/callback", 
  },
  cache: {
    cacheLocation: "sessionStorage", 
    storeAuthStateInCookie: true,
  },
};

const msalInstance = new PublicClientApplication(msalConfig);
export default msalInstance;
