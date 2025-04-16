import React, { useEffect } from "react";
import { Routes, Route, useLocation, Outlet } from "react-router-dom";
import "./App.css";

// Pages & Components
import SignInSide from "./sign-up/SignInSide";
import SignUp from "./sign-up/SignUp";
import Navbar from "./components/Navbar";
import Dashboard from "./components/Dashboard";
import Complaints from "./components/Complaints";
import BlogPage from "./components/BlogPage";
import Blog from "./components/Blog";
import ProfilePage from "./components/ProfilePage";
import InstructionPage from "./components/InstructionPage";
import InvoiceList from "./components/InvoiceList";
import WaybillList from "./components/WaybillList";
import AuthCallback from "./components/AuthCallback";
import Cod from "./components/Cod";
import FeedbackSlider from "./components/FeedbackSlider";
import CallToAction from "./components/CallToAction";
import { PrivacyProvider, usePrivacy } from './components/PrivacyContext';
import PrivacyPopup from './components/PrivacyPopup';

function RouteGuard() {
  const location = useLocation();
  const { showPrivacyPopup } = usePrivacy();

  useEffect(() => {
    if (!localStorage.getItem('privacyAccepted')) {
      showPrivacyPopup(location.pathname);
    }
  }, [location.pathname, showPrivacyPopup]);

  return null;
}

function LayoutWithNavbar() {
  return (
    <>
      <Navbar />
      <Outlet />
    </>
  );
}

function App() {
  useEffect(() => {
    if (window.location.hostname === "www.biomedwaste.net") {
      const newUrl = window.location.href.replace("www.", "");
      window.location.replace(newUrl);
    }
  }, []);

  return (
    <PrivacyProvider>
      <RouteGuard />
      <PrivacyPopup />
      <Routes>
        <Route path="/" element={<SignInSide />} />
        <Route path="/sign-up" element={<SignUp />} />
        <Route path="/auth/callback" element={<AuthCallback />} />
        <Route element={<LayoutWithNavbar />}>
          <Route path="/home" element={<Dashboard />} />
          <Route path="/services" element={<Complaints />} />
          <Route path="/instruction" element={<InstructionPage />} />
          <Route path="/blogs" element={<BlogPage />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/invoice" element={<InvoiceList />} />
          <Route path="/waybill" element={<WaybillList />} />
          <Route path="/slider" element={<FeedbackSlider />} />
          <Route path="/cod" element={<Cod />} />
          <Route path="/calltoaction" element={<CallToAction />} />
        </Route>
      </Routes>
    </PrivacyProvider>
  );
}

export default App;
