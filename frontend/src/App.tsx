import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { HangarView } from './pages/HangarView';
import { Builder } from './pages/Builder';
import { Accessories } from './pages/Accessories';
import { Simulation } from './pages/Simulation';
import { Summary } from './pages/Summary';

const AnimatedRoutes = () => {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/builder" element={<Builder />} />
        <Route path="/accessories" element={<Accessories />} />
        <Route path="/simulation" element={<Simulation />} />
        <Route path="/summary" element={<Summary />} />
      </Routes>
    </AnimatePresence>
  );
};

function App() {
  return (
    <Router>
      <AnimatedRoutes />
    </Router>
  );
}

export default App;