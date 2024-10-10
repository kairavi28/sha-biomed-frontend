import React from 'react';
import { Routes, Route } from 'react-router-dom';
import './App.css';
import SignInSide from './sign-up/SignInSide';
import SignUp from './sign-up/SignUp';
import Navbar from './components/Navbar';
import Dashboard from './components/Dashboard';
import Support from './components/Support';

function App() {
  return (
    <Routes>
      <Route path="/" element={<SignInSide />} />
      <Route path="/sign-up" element={<SignUp />} />
      <Route element={<LayoutWithNavbar />}>
        <Route path="/home" element={<Dashboard />} />
        <Route path="/support" element={<Support />} />
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
        <Route path="/support" element={<Support />} />
      </Routes>
    </>
  );
}

export default App;
