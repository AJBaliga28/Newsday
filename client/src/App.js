import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { createTheme, ThemeProvider, CssBaseline } from "@mui/material";
import { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import HomePage from "./pages/HomePage";
import SignupPage from "./pages/SignupPage";
import LoginPage from "./pages/LoginPage";
import MainPage from "./pages/MainPage";
import ProfilePage from "./pages/ProfilePage";
import SavedItemsPage from "./pages/SavedItemsPage";
import SearchResultsPage from "./pages/SearchResultsPage";
import CategoryPage from "./pages/CategoryPage";
import RecommendationsPage from "./pages/RecommendationsPage";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check authentication status on component mount
  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsAuthenticated(!!token);
  }, []);

  // Dark and Light Themes
  const darkTheme = createTheme({
    palette: {
      mode: "dark",
      background: { default: "#23232E", paper: "#2A2A35" },
      primary: { main: "#4C5154" },
      secondary: { main: "#6B728E" },
      text: { primary: "#F7F7F7", secondary: "#B3B3B3" },
    },
    components: {
      MuiCssBaseline: {
        styleOverrides: { body: { backgroundColor: "#23232E" } },
      },
      MuiTextField: { styleOverrides: { root: { color: "#F7F7F7" } } },
    },
  });

  const lightTheme = createTheme({
    palette: {
      mode: "light",
      background: { default: "#FFFFFF", paper: "#F5F5F5" },
      primary: { main: "#1976d2" },
      secondary: { main: "#f50057" },
      text: { primary: "#000000", secondary: "#757575" },
    },
    components: {
      MuiCssBaseline: {
        styleOverrides: { body: { backgroundColor: "#FFFFFF" } },
      },
      MuiTextField: { styleOverrides: { root: { color: "#000000" } } },
    },
  });

  const theme = darkMode ? darkTheme : lightTheme;

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        {/* Navbar is displayed on all routes */}
        <Navbar
          darkMode={darkMode}
          setDarkMode={setDarkMode}
          isAuthenticated={isAuthenticated}
        />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/login" element={<LoginPage />} />

          {/* Protected Routes */}
          <Route
            path="/main"
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated}>
                <MainPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated}>
                <ProfilePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile/saved-items"
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated}>
                <SavedItemsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/categories/:categoryname"
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated}>
                <CategoryPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/recommendations"
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated}>
                <RecommendationsPage />
              </ProtectedRoute>
            }
          />
          <Route path="/search" element={<SearchResultsPage />} />
          <Route path="/latest" element={<MainPage />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
