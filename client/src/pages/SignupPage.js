import React, { useState, useContext } from "react";
import { UserContext } from "../context/UserContext";
import { Box, TextField, Button, Typography, Link } from "@mui/material";
import { Link as RouterLink, useNavigate } from "react-router-dom";

const SignupPage = () => {
  const { signup, error, isAuthenticated } = useContext(UserContext);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate(); // Initialize useNavigate

  const handleSubmit = async (e) => {
    e.preventDefault();
    await signup({ username, email, password });
    if (isAuthenticated) {
      alert("Account created successfully.");
      navigate("/login");
    }
  };

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
        <Typography variant="h4" sx={{ justifyContent: "center" }} gutterBottom>
          Sign Up
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Username"
            variant="outlined"
            margin="normal"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
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
            Sign Up
          </Button>
        </form>
        <Typography variant="body2" sx={{ mt: 2, textAlign: "center" }}>
          Already have an account?{" "}
          <Link component={RouterLink} to="/login" color="primary">
            Log in here
          </Link>
        </Typography>
      </Box>
    </Box>
  );
};

export default SignupPage;
