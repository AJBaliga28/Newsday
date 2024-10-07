import React from "react";
import { Box, Typography, Button, Container } from "@mui/material";
import { Link } from "react-router-dom";

const HomePage = () => {
  return (
    <Container maxWidth="md">
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          height: "80vh",
          textAlign: "center",
        }}
      >
        <Typography variant="h2" gutterBottom>
          Welcome to NewsApp!
        </Typography>
        <Typography variant="h5" color="textSecondary" gutterBottom>
          Get the latest news from around the world, tailored to your interests.
        </Typography>
        <Box mt={4}>
          <Button
            component={Link}
            to="/signup"
            variant="contained"
            color="primary"
            sx={{
              marginRight: 2,
              paddingX: 3,
              paddingY: 1.5,
              fontSize: "1rem",
              backgroundColor: "#1976d2",
              "&:hover": {
                backgroundColor: "#135D66", // Custom hover color
              },
            }}
          >
            Sign Up
          </Button>
          <Button
            component={Link}
            to="/login"
            variant="outlined"
            sx={{
              paddingX: 3,
              paddingY: 1.5,
              fontSize: "1rem",
              color: "#1976d2", // Custom color for outline button
              borderColor: "#1976d2",
              "&:hover": {
                borderColor: "#135D66", // Custom hover border color
                color: "#135D66", // Custom hover text color
              },
            }}
          >
            Log In
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default HomePage;
