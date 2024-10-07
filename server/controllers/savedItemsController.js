const SavedItem = require("../models/SavedItem");

exports.getSavedItems = async (req, res) => {
  const userId = req.user.id; // Retrieved from the JWT token

  try {
    const savedItems = await SavedItem.find({ userId }).populate("userId");
    // console.log("savedItems: ", savedItems);
    res.status(200).json(savedItems);
  } catch (error) {
    res.status(500).json({ message: "Error fetching saved items", error });
  }
};

exports.saveItem = async (req, res) => {
  const userId = req.user.id; // Retrieved from the JWT token
  const { article } = req.body;

  const savedItem = new SavedItem({ userId, article });
  // console.log(savedItem);
  try {
    await savedItem.save();
    res.status(201).json(savedItem);
  } catch (error) {
    res.status(500).json({ message: "Error saving item", error });
  }
};

// exports.removeItem = async (req, res) => {
//   const userId = req.user.id; // Retrieved from the JWT token
//   const { id } = req.params;

//   try {
//     await SavedItem.findOneAndDelete({ _id: id, userId });
//     res.status(200).json({ message: "Item removed successfully" });
//   } catch (error) {
//     res.status(500).json({ message: "Error removing item", error });
//   }
// };
// ----------
// exports.removeItem = async (req, res) => {
//   const userId = req.user.id; // Retrieved from the JWT token
//   const { url } = req.params; // Get the article's URL from the request parameters
//   console.log(url);
//   // Decode the URL
//   const decodedUrl = decodeURIComponent(url);

//   try {
//     // Now use the decoded URL to find and delete the item
//     await SavedItem.findOneAndDelete({ url: decodedUrl, userId });
//     res.status(200).json({ message: "Item removed successfully" });
//   } catch (error) {
//     res.status(500).json({ message: "Error removing item", error });
//   }
// };

exports.removeItem = async (req, res) => {
  const userId = req.user.id;
  const { url } = req.params;
  const decodedUrl = decodeURIComponent(url);
  // console.log(decodedUrl);
  try {
    const deletedItem = await SavedItem.findOneAndDelete({
      "article.url": decodedUrl,
      userId,
    });

    if (!deletedItem) {
      // console.log("Not found.");
      res.status(404).json({ message: "Item not found" });
    } else {
      // console.log("Deleted.");
      res.status(200).json({ message: "Item removed successfully" });
    }
  } catch (error) {
    // console.log("Some other error", error);
    res.status(500).json({ message: "Error removing item", error });
  }
};
