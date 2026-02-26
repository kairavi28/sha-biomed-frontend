import React, { useEffect } from "react";
import { Routes, Route, useLocation, Navigate, Outlet } from "react-router-dom";
import "./App.css";

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
import BusinessInfoForm from "./components/BusinessInfoForm";
import RequestProduct from "./components/RequestProduct";
import QuoteCart from "./components/QuoteCart";
import { QuoteCartProvider } from "./context/QuoteCartContext";
import ResetPassword from "./components/ResetPassword";

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

function ProtectedRoute() {
  const location = useLocation();
  const userData = sessionStorage.getItem("userData");

  if (!userData) {
    return <Navigate to="/" state={{ from: location.pathname }} replace />;
  }

  return (
    <>
      <Navbar />
      <Outlet />
    </>
  );
}

function PublicRoute({ children }) {
  const userData = sessionStorage.getItem("userData");
  const location = useLocation();
  const from = location.state?.from || "/home";

  if (userData) {
    return <Navigate to={from} replace />;
  }

  return children;
}

function App() {
  useEffect(() => {
    if (window.location.hostname === "www.biomedwaste.net") {
      const newUrl = window.location.href.replace("www.", "");
      window.location.replace(newUrl);
    }
  }, []);

  return (
    <QuoteCartProvider>
      <PrivacyProvider>
        <RouteGuard />
        <PrivacyPopup />
        <Routes>
          <Route path="/" element={<PublicRoute><SignInSide /></PublicRoute>} />
          <Route path="/sign-up" element={<PublicRoute><SignUp /></PublicRoute>} />
          <Route path="/auth/callback" element={<AuthCallback />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/home" element={<Dashboard />} />
            <Route path="/services" element={<Complaints />} />
            <Route path="/complaints" element={<Complaints />} />
            <Route path="/instruction" element={<InstructionPage />} />
            <Route path="/blogs" element={<BlogPage />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/invoice" element={<InvoiceList />} />
            <Route path="/waybill" element={<WaybillList />} />
            <Route path="/slider" element={<FeedbackSlider />} />
            <Route path="/cod" element={<Cod />} />
            <Route path="/Business" element={<BusinessInfoForm/>} />
            <Route path="/calltoaction" element={<CallToAction />} />
            <Route path="/request-products" element={<RequestProduct />} />
            <Route path="/cart" element={<QuoteCart />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </PrivacyProvider>
    </QuoteCartProvider>
  );
}

export default App;
