import React, { useEffect } from "react";
import { useMsal } from "@azure/msal-react";
import { useNavigate } from "react-router-dom";

const AuthCallback = () => {
  const { instance } = useMsal();
  const navigate = useNavigate();

  useEffect(() => {
    const handleAuthRedirect = async () => {
      try {
        const response = await instance.handleRedirectPromise();
        let account = response?.account;
        if (!account) {
          // Check manually if an account exists
          const accounts = instance.getAllAccounts();
          console.log("All accounts:", accounts);
          if (accounts.length > 0) {
            account = accounts[0];
          }
        }

        if (account) {
          console.log("User authenticated:", account);
          sessionStorage.setItem("userData", JSON.stringify(account));
          navigate("/home");
        } else {
          console.warn("No response received or no account data.");
          navigate("/");
        }
      } catch (error) {
        console.error("Authentication error:", error);
        navigate("/");
      }
    };

    handleAuthRedirect();
  }, [instance, navigate]);

  return <div>Processing login...</div>;
};

export default AuthCallback;
