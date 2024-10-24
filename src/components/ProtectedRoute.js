import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ element, isAuthenticated }) => {
    console.log('zzelement', element);
    console.log('zzisAuthenticated', isAuthenticated);
  return isAuthenticated ? (element === "/" ? "/Main" : element) : <Navigate to="/" />;
};

export default ProtectedRoute;
