import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'; // Correct import
import Login from './AdminPortal/pages/LoginPage';
import PumpDetail from './AdminPortal/components/PumpDetail';
import PumpDetails from './AdminPortal/components/PumpDetails';
import Dashboard from './AdminPortal/pages/AdminDashboard';
import PrivateRoute from './AdminPortal/components/PrivateRoute'; // We'll create this next

function App() {
  return (
    <Router> {/* Wrap everything inside Router */}
      <Routes> {/* Use Routes to define all your routes */}
        <Route path="/" element={<Login />} />
        <Route 
          path="/dashboard" 
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          } 
        />
        <Route path="pumpDetail/:pumpId" element={<PumpDetail />} />
        <Route path="pumpDetails/:pumpId" element={<PumpDetails />} />
      </Routes>
    </Router>
  );
}

export default App;
