import React, { useState, useContext, useEffect } from "react";
import { UserContext } from "../context/UserContext";
import { Box, TextField, Button, Typography, Link } from "@mui/material";
import { Link as RouterLink, useNavigate } from "react-router-dom";

const LoginPage = () => {
  const { login, error, isAuthenticated } = useContext(UserContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    await login({ email, password });
  };

  // Redirect when authentication status changes
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/main");
    }
  }, [isAuthenticated, navigate]);

  return (
    <Box
      sx={{
        maxWidth: 400,
        mx: "auto",
        height: "100vh", // Full viewport height
        display: "flex",
        alignItems: "center", // Vertical centering
        justifyContent: "center", // Horizontal centering
      }}
    >
      <Box sx={{ width: "100%" }}>
        <Typography variant="h4" gutterBottom>
          Login
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Email"
            variant="outlined"
            margin="normal"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            fullWidth
            label="Password"
            type="password"
            variant="outlined"
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {error && <Typography color="error">{error}</Typography>}
          <Button
            type="submit"
            variant="contained"
            color="primary"
            sx={{ mt: 2, width: "100%", padding: 1.5 }}
          >
            Login
          </Button>
        </form>
        <Typography variant="body2" sx={{ mt: 2, textAlign: "center" }}>
          Don't have an account?{" "}
          <Link component={RouterLink} to="/signup" color="primary">
            Sign up here
          </Link>
        </Typography>
      </Box>
    </Box>
  );
};

export default LoginPage;
