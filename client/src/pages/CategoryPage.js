import React, { useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import { NewsContext } from "../context/NewsContext";
import NewsItem from "../components/NewsItem";
import { Box, Typography, CircularProgress, Container } from "@mui/material";

const CategoryPage = () => {
  const { categoryname } = useParams(); // Extract category name from URL
  const { articles, loading, error, fetchNewsByCategory, setArticles } =
    useContext(NewsContext);

  useEffect(() => {
    setArticles([]);
    fetchNewsByCategory(categoryname);
  }, [categoryname]); // Refetch category news when category changes

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
        {categoryname.charAt(0).toUpperCase() + categoryname.slice(1)} News
      </Typography>
      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        {articles && articles.length > 0 ? (
          articles.map((article, index) => (
            <NewsItem key={index} article={article} />
          ))
        ) : (
          <Typography variant="h6" textAlign="center">
            No news available for this category.
          </Typography>
        )}
      </Box>
    </Container>
  );
};

export default CategoryPage;
