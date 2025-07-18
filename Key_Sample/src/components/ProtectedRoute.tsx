import React from 'react';
import { Navigate } from 'react-router-dom';

// Helper function to get cookies
const getCookie = (name: string): string | null => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(";").shift() || null;
  return null;
};

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const accessToken = getCookie("access_token");

  // If no access token, redirect to login
  if (!accessToken) {
    return <Navigate to="/login" replace />;
  }

  // If access token exists, render the children
  // Let the backend handle all authorization (403 responses)
  return <>{children}</>;
};

export default ProtectedRoute;