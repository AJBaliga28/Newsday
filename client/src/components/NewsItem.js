import React from "react";
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Box,
  IconButton,
} from "@mui/material";
import { Share } from "@mui/icons-material";
import HeartButton from "./HeartButton"; // Import HeartButton

const NewsItem = ({ article }) => {
  const handleShare = () => {
    navigator.clipboard.writeText(article.url);
    alert("Article link copied to clipboard!");
  };

  return (
    <Card sx={{ display: "flex", mb: 2 }}>
      {/* Image */}
      {article.urlToImage && (
        <CardMedia
          component="img"
          sx={{ width: 160 }}
          image={article.urlToImage || "/assets/Breaking-Image.jpeg"}
          alt={article.title}
        />
      )}

      {/* Article Content */}
      <Box sx={{ display: "flex", flexDirection: "column", width: "100%" }}>
        <CardContent sx={{ flex: "1 0 auto" }}>
          <Typography variant="h6">{article.title}</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            {article.description}
          </Typography>
          <Typography
            variant="body2"
            color="primary"
            component="a"
            href={article.url}
            target="_blank"
            rel="noopener noreferrer"
          >
            Read Full Article
          </Typography>
        </CardContent>

        {/* Actions (Save & Share) */}
        <Box sx={{ display: "flex", justifyContent: "flex-end", pr: 2, pb: 1 }}>
          <HeartButton article={article} /> {/* Removed onSaveStatusChange */}
          <IconButton onClick={handleShare}>
            <Share />
          </IconButton>
        </Box>
      </Box>
    </Card>
  );
};

export default NewsItem;
