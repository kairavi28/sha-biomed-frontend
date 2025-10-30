import React, { useEffect } from "react";
import { useMsal } from "@azure/msal-react";
import { useNavigate } from "react-router-dom";
import CircularProgress from "@mui/material/CircularProgress";

const AuthCallback = () => {
  const { instance } = useMsal();
  const navigate = useNavigate();

  useEffect(() => {
    const handleAuthRedirect = async () => {
      try {
        const response = await instance.handleRedirectPromise();
        let account = response?.account;
        if (!account) {
          const accounts = instance.getAllAccounts();
          if (accounts.length > 0) {
            account = accounts[0];
          }
        }

        if (account) {
          console.log('account', account)
          sessionStorage.setItem("userData", JSON.stringify(account));
          // window.location.href = "/home";
        } else {
          console.warn("No response received or no account data.");
          // window.location.href = "/";
        }
      } catch (error) {
        console.error("Authentication error:", error);
      }
    };

    handleAuthRedirect();
  }, [instance, navigate]);

  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "80vh" }}>
      <CircularProgress />
    </div>
  );
};

export default AuthCallback;
