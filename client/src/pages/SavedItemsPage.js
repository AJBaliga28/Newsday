import React, { useEffect, useState, useContext } from "react";
import { Box, Typography, Container, CircularProgress } from "@mui/material";
import NewsItem from "../components/NewsItem";
import axios from "axios";
import { SavedItemsContext } from "../context/SavedItemsContext"; // Import the context

const SavedItems = () => {
  const {
    savedArticles,
    setSavedArticles,
    loading: savedLoading,
    error: savedError,
  } = useContext(SavedItemsContext); // Use context for saved articles
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [displayArticles, setDisplayArticles] = useState([]);
  useEffect(() => {
    // Fetch saved articles
    const fetchSavedItems = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/saved-items",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        console.log(response.data);
        setDisplayArticles(response.data);
        // setSavedArticles(response.data.article);
        console.log("savedArticles: ", savedArticles);
      } catch (err) {
        setError("Failed to fetch saved articles.");
      } finally {
        setLoading(false);
      }
    };

    fetchSavedItems();
  }, []);

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "80vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Typography variant="h6" color="error" textAlign="center">
        {error}
      </Typography>
    );
  }

  return (
    <Container>
      <Typography variant="h4" gutterBottom textAlign="center">
        Saved Articles
      </Typography>
      {savedArticles.length > 0 ? (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {displayArticles.map((article, index) => (
            <NewsItem key={index} article={article.article} />
          ))}
        </Box>
      ) : (
        <Typography variant="h6" textAlign="center">
          No saved articles found.
        </Typography>
      )}
    </Container>
  );
};

export default SavedItems;
