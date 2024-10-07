import React, { useEffect, useContext } from "react";
import { Box, Typography } from "@mui/material";
import { NewsContext } from "../context/NewsContext";
import NewsItem from "../components/NewsItem";
import { CircularProgress } from "@mui/material";

const RecommendationPage = () => {
  const { recommendedArticles, loading, error, fetchRecommendedArticles } =
    useContext(NewsContext); // Use context for recommended articles

  useEffect(() => {
    fetchRecommendedArticles(); // Fetch recommended articles on component load
  }, []);

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Recommended Articles
      </Typography>
      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center" }}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Typography>Error loading recommended articles: {error}</Typography>
      ) : recommendedArticles.length === 0 ? (
        <Typography>No recommended articles</Typography>
      ) : (
        <Box>
          {recommendedArticles.map((article, index) => (
            <NewsItem key={index} article={article} />
          ))}
        </Box>
      )}
    </Box>
  );
};

export default RecommendationPage;
