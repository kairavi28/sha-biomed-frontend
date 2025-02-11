import React from 'react';
import { Routes, Route } from 'react-router-dom';
import './App.css';
import SignInSide from './sign-up/SignInSide';
import SignUp from './sign-up/SignUp';
import Navbar from './components/Navbar';
import Dashboard from './components/Dashboard';
import Complaints from './components/Complaints';
import BlogPage from './components/BlogPage';
import Blog from './components/Blog';
import ProfilePage from './components/ProfilePage';
import InstructionPage from './components/InstructionPage';
import InvoiceList from './components/InvoiceList';

function App() {
  return (
    <Routes>
      <Route path="/" element={<SignInSide />} />
      <Route path="/sign-up" element={<SignUp />} />
      <Route element={<LayoutWithNavbar />}>
        <Route path="/home" element={<Dashboard />} />
        <Route path="/services" element={<Complaints />} />
        <Route path="/instruction" element={<InstructionPage />} />
        <Route path="/blogs" element={<BlogPage />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/profile" element={<ProfilePage/>} />
        <Route path="/invoice" element={<InvoiceList/>} />
      </Route>
    </Routes>
  );
}

function LayoutWithNavbar() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/home" element={<Dashboard />} />
        <Route path="/services" element={<Complaints />} />
        <Route path="/blogs" element={<BlogPage />} />
        <Route path="/invoice" element={<InvoiceList/>} />
        <Route path="/" element={<SignInSide/>} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/instruction" element={<InstructionPage />} />
        <Route path="/profile" element={<ProfilePage/>} />
      </Routes>
    </>
  );
}

export default App;
