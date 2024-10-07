import React, { createContext, useState, useEffect } from "react";
import axios from "axios";

// Create a context to hold user-related data and functions
export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const api = axios.create({
    baseURL: "http://localhost:5000/api/auth", // Adjust according to your backend
    headers: { "Content-Type": "application/json" },
  });

  // Check user session on component mount
  useEffect(() => {
    const token = localStorage.getItem("token");
    let storedUser = null;
    if (token) {
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      setIsAuthenticated(true);
      try {
        const storedUserString = localStorage.getItem("user");
        if (storedUserString) {
          storedUser = JSON.parse(storedUserString);
        }
      } catch (error) {
        console.error("Error parsing stored user data:", error);
        localStorage.removeItem("user"); // Remove invalid data
      }
      if (storedUser) {
        setUser(storedUser);
      }
    }
    setLoading(false);
  }, []);

  // Login function
  const login = async (credentials) => {
    try {
      const response = await api.post("/login", credentials);
      const { token, user } = response.data;
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      setUser(user);
      setIsAuthenticated(true);
    } catch (error) {
      console.error("Login error:", error);
      setError("Invalid email or password"); // Set an appropriate error message
    }
  };

  // Signup function
  const signup = async (data) => {
    try {
      const response = await api.post("/register", data);
      const { token, user } = response.data;
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      setUser(user);
      setIsAuthenticated(true);
    } catch (error) {
      console.error("Signup error:", error);
      setError("Error during signup."); // Set an appropriate error message
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    setIsAuthenticated(false);
    delete api.defaults.headers.common["Authorization"];
  };

  return (
    <UserContext.Provider
      value={{
        user,
        isAuthenticated,
        loading,
        error,
        login,
        signup,
        logout,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
