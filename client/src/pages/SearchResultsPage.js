import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import NewsItem from "../components/NewsItem";
import { Box, Typography, CircularProgress, Container } from "@mui/material";
import axios from "axios"; // Use axios for making API calls

const SearchResultsPage = () => {
  const location = useLocation();
  const query = new URLSearchParams(location.search).get("q"); // Get the query from the URL

  // State variables
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch search results directly from the frontend
  useEffect(() => {
    const fetchNews = async () => {
      if (!query) return;
      setLoading(true);
      setError(null);

      try {
        const response = await axios.get(
          `https://newsapi.org/v2/everything?q=${query}&apiKey=ea9af643080e4829bc529c2ab29019f9`
        );

        setArticles(response.data.articles);
      } catch (err) {
        setError("Error fetching search results");
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, [query]);

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
        Search Results for "{query}"
      </Typography>
      {articles.length > 0 ? (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {articles.map((article, index) => (
            <NewsItem key={index} article={article} />
          ))}
        </Box>
      ) : (
        <Typography variant="h6" textAlign="center">
          No results found for your query.
        </Typography>
      )}
    </Container>
  );
};

export default SearchResultsPage;
