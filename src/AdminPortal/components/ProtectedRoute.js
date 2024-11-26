
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAdminAuth } from './Auth';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAdminAuth();

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;