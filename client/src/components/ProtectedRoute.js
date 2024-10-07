import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useContext(UserContext);

  // If still loading, don't render anything
  if (loading) return null;

  // If the user is not authenticated, redirect to login page
  if (!isAuthenticated) {
    alert("Please login!");
    return <Navigate to="/login" />;
  }

  // If authenticated, render the children (protected component)
  return children;
};

export default ProtectedRoute;
