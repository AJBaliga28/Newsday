const User = require("../models/User");

exports.getUserProfile = async (req, res) => {
  const userId = req.user.id; // Retrieved from the JWT token

  try {
    const user = await User.findById(userId).select("-password"); // Exclude password
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Error fetching user profile", error });
  }
};

exports.updateUserProfile = async (req, res) => {
  const userId = req.user.id;
  const { bio, location, timezone, interests } = req.body;
  console.log(req.body);
  try {
    const user = await User.findByIdAndUpdate(
      userId,
      {
        bio,
        location,
        timezone,
        interests,
      },
      {
        new: true,
        runValidators: true,
      }
    ).select("-password");

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({
      message: "Error updating user profile",
      error,
    });
  }
};
