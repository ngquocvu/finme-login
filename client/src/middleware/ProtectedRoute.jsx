import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuthStore } from "../store/store";

//The route check if user is already logged in,
//if yes, go to profile page, if no and don't have username, redirect to home page,
//if have username, continue the process on current page
const ProtectedRoute = ({ children }) => {
  const location = useLocation();
  const username = useAuthStore((state) => state.auth.username);
  const token = localStorage.getItem("token");
  if (token) return <Navigate to="/profile" />;
  if (location.pathname !== "/" && !username) {
    return <Navigate to="/" />;
  }
  return children;
};

export default ProtectedRoute;
