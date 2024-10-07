import React, { useState, useContext, useEffect } from "react";
import { NewsContext } from "../context/NewsContext";
import NewsItem from "../components/NewsItem";
import {
  Box,
  CircularProgress,
  Typography,
  Button,
  Container,
} from "@mui/material";

const MainPage = () => {
  const { articles, loading, error, fetchLatestNews } = useContext(NewsContext);
  const [page, setPage] = useState(1); // Page for pagination

  useEffect(() => {
    fetchLatestNews(page); // Fetch news when page changes
  }, [page]);

  const loadMore = () => {
    setPage((prevPage) => prevPage + 1); // Increment page to load more articles
  };

  return (
    <Container maxWidth="md" sx={{ my: 4 }}>
      {/* Title */}
      <Typography variant="h4" align="center" gutterBottom>
        Latest News
      </Typography>

      {/* Show articles */}
      {articles.map((article, index) => (
        <NewsItem key={index} article={article} />
      ))}

      {/* Loading Spinner */}
      {loading && (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
          <CircularProgress />
        </Box>
      )}

      {/* Load More Button */}
      {!loading && (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
          <Button variant="contained" onClick={loadMore} disabled={loading}>
            {loading ? "Loading..." : "Load More"}
          </Button>
        </Box>
      )}

      {/* Error message */}
      {error && (
        <Typography color="error" align="center" sx={{ mt: 2 }}>
          {error}
        </Typography>
      )}
    </Container>
  );
};

export default MainPage;
