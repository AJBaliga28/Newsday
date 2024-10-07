import React, { useState, useEffect } from "react";
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Box,
  Button,
  Menu,
  MenuItem,
  TextField,
} from "@mui/material";
import {
  Search as SearchIcon,
  AccountCircle,
  DarkMode,
  LightMode,
} from "@mui/icons-material";
import { Link, useNavigate } from "react-router-dom";

const categories = [
  "Business",
  "Entertainment",
  "Health",
  "Science",
  "Sports",
  "Technology",
]; // Example categories

const Navbar = ({ darkMode, setDarkMode }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();
  const isMenuOpen = Boolean(anchorEl);

  // Handle account button click
  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleSearchClick = () => {
    setSearchOpen(!searchOpen);
  };

  const handleSearchSubmit = (event) => {
    if (event.key === "Enter") {
      const trimmedQuery = searchQuery.trim();
      if (!trimmedQuery) return;

      navigate(`/search?q=${trimmedQuery}`);
      setSearchQuery("");
      setSearchOpen(false);
    }
  };

  const handleDarkModeToggle = () => {
    setDarkMode(!darkMode);
  };

  // Check if the user is authenticated
  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsAuthenticated(!!token);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
    navigate("/login");
    handleMenuClose();
  };

  return (
    <AppBar position="sticky" top={0}>
      <Toolbar>
        {/* Logo */}
        <Typography
          variant="h6"
          component={Link}
          to="/"
          sx={{ textDecoration: "none", color: "inherit", flexGrow: 1 }}
        >
          Newsday
        </Typography>

        {/* Categories */}
        <Box sx={{ display: { xs: "none", md: "flex" } }}>
          {categories.map((category) => (
            <Button
              key={category}
              component={Link}
              to={`/categories/${category.toLowerCase()}`}
              sx={{ color: "white" }}
            >
              {category}
            </Button>
          ))}
          {/* "Latest" Button */}
          <Button component={Link} to="/latest" sx={{ color: "white" }}>
            Latest
          </Button>
          {/* Personalized Recommendations (visible only if logged in) */}
          {isAuthenticated && (
            <Button
              component={Link}
              to="/recommendations"
              sx={{ color: "white" }}
            >
              Recommendations
            </Button>
          )}
        </Box>

        {/* Search Icon & Input */}
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <IconButton color="inherit" onClick={handleSearchClick}>
            <SearchIcon />
          </IconButton>
          {searchOpen && (
            <TextField
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleSearchSubmit}
              placeholder="Search..."
              variant="outlined"
              size="small"
              sx={{
                ml: 1,
                backgroundColor: darkMode ? "#2A2A35" : "white",
                color: darkMode ? "#F7F7F7" : "#000000",
                borderRadius: 1,
              }}
            />
          )}
        </Box>

        {/* Dark Mode Toggle */}
        <IconButton onClick={handleDarkModeToggle} color="inherit">
          {darkMode ? <LightMode /> : <DarkMode />}
        </IconButton>

        {/* Account Icon */}
        {isAuthenticated ? (
          <>
            <IconButton
              edge="end"
              aria-label="account of current user"
              aria-controls="primary-account-menu"
              aria-haspopup="true"
              onClick={handleMenuOpen}
              color="inherit"
            >
              <AccountCircle />
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              anchorOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              id="primary-account-menu"
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              open={isMenuOpen}
              onClose={handleMenuClose}
            >
              <MenuItem
                component={Link}
                to="/profile"
                onClick={handleMenuClose}
              >
                Profile
              </MenuItem>
              <MenuItem onClick={handleLogout}>Logout</MenuItem>
            </Menu>
          </>
        ) : (
          <>
            <Button component={Link} to="/login" sx={{ color: "white" }}>
              Login
            </Button>
            <Button component={Link} to="/signup" sx={{ color: "white" }}>
              Sign Up
            </Button>
          </>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
