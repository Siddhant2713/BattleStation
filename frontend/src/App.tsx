import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { Builder } from './pages/Builder';
import { Accessories } from './pages/Accessories';
import { Simulation } from './pages/Simulation';
import { Summary } from './pages/Summary';

// Placeholder components for now
const BuilderPlaceholder = () => <div className="text-white">Builder Page</div>;
const AccessoriesPlaceholder = () => <div className="text-white">Accessories Page</div>;
const SimulationPlaceholder = () => <div className="text-white">Simulation Page</div>;
const SummaryPlaceholder = () => <div className="text-white">Summary Page</div>;

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/builder" element={<BuilderPlaceholder />} />
        <Route path="/accessories" element={<AccessoriesPlaceholder />} />
        <Route path="/simulation" element={<SimulationPlaceholder />} />
        <Route path="/summary" element={<SummaryPlaceholder />} />
      </Routes>
    </Router>
  );
}

export default App;