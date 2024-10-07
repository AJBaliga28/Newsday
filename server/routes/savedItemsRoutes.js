const express = require("express");
const {
  getSavedItems,
  saveItem,
  removeItem,
} = require("../controllers/savedItemsController");
const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

router.get("/", authMiddleware, getSavedItems);
router.post("/", authMiddleware, saveItem);
router.delete("/:url", authMiddleware, removeItem);

module.exports = router;
