import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthenticationContext.js";

export default function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth();
  const location = useLocation(); // Get the current route

  if (!isAuthenticated) {
    return (
      <Navigate
        to="/login"
        replace
        state={{
          from: location.pathname, // Current route
          message: "You need to log in to access this page.", // Custom message
        }}
      />
    );
  }

  return children;
}
