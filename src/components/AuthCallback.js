import React, { useEffect } from "react";
import { useMsal } from "@azure/msal-react";
import { useNavigate } from "react-router-dom";

const AuthCallback = () => {
  const { instance } = useMsal();
  const navigate = useNavigate();

  useEffect(() => {
    instance.handleRedirectPromise()
      .then((response) => {
        if (response) {
          console.log("Redirect Login Success:", response);
          sessionStorage.setItem("userData", JSON.stringify(response.account));
          navigate("/home");
        }
      })
      .catch((error) => {
        console.error("Redirect Login Failed:", error);
      });
  }, [instance, navigate]);

  return <div>Processing login...</div>;
};

export default AuthCallback;
