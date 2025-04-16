import React, { createContext, useContext, useState, useEffect } from 'react';

const PrivacyContext = createContext();

export const usePrivacy = () => useContext(PrivacyContext);

export const PrivacyProvider = ({ children }) => {
  const [open, setOpen] = useState(false);
  const [nextRoute, setNextRoute] = useState('/');

  useEffect(() => {
    if (!localStorage.getItem('privacyAccepted')) {
      setOpen(true);
    }
  }, []);

  const showPrivacyPopup = (path) => {
    setNextRoute(path);
    if (!localStorage.getItem('privacyAccepted')) {
      setOpen(true);
    }
  };

  const acceptPrivacy = () => {
    localStorage.setItem('privacyAccepted', 'true');
    setOpen(false);
    return nextRoute;
  };

  return (
    <PrivacyContext.Provider value={{ open, showPrivacyPopup, acceptPrivacy, nextRoute }}>
      {children}
    </PrivacyContext.Provider>
  );
};
