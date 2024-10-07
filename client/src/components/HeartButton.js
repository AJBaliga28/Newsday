import React, { useContext, useState } from "react";
import { IconButton } from "@mui/material";
import { Bookmark, BookmarkBorder } from "@mui/icons-material";
import { SavedItemsContext } from "../context/SavedItemsContext";

const HeartButton = ({ article }) => {
  const { saveArticle, removeArticle, isArticleSaved } =
    useContext(SavedItemsContext);
  const [loading, setLoading] = useState(false);

  const isSaved = isArticleSaved(article.url); // Check if article is saved

  const handleSave = async () => {
    setLoading(true);
    try {
      if (isSaved) {
        await removeArticle(article.url); // Remove article
      } else {
        await saveArticle(article); // Save article
      }
    } catch (err) {
      console.error("Error saving/removing article:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <IconButton onClick={handleSave} disabled={loading}>
      {isSaved ? <Bookmark color="primary" /> : <BookmarkBorder />}
    </IconButton>
  );
};

export default HeartButton;
