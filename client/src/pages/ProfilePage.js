import React, { useState, useEffect, useContext } from "react";
import {
  Box,
  Typography,
  Button,
  Container,
  Snackbar,
  Chip,
} from "@mui/material";
import axios from "axios";
import MuiAlert from "@mui/material/Alert";
import { Link } from "react-router-dom";
import { SavedItemsContext } from "../context/SavedItemsContext"; // Import the context
import { NewsContext } from "../context/NewsContext"; // Import the NewsContext
import TextField from "@mui/material/TextField";
import NewsItem from "../components/NewsItem";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const ProfilePage = () => {
  const {
    savedArticles,
    loading: savedLoading,
    error: savedError,
  } = useContext(SavedItemsContext); // Use context for saved articles

  const [profile, setProfile] = useState({
    username: "",
    email: "",
    bio: "",
    location: "",
    timezone: "",
    interests: [],
  });

  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const api = axios.create({
    baseURL: `${process.env.REACT_APP_API_URL}/api/users`, // Adjust according to your backend
    headers: { "Content-Type": "application/json" },
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await api.get("/profile", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setProfile(response.data);
      } catch (err) {
        setError("Failed to fetch profile. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await api.put(
        "/profile",
        {
          bio: profile.bio,
          location: profile.location,
          timezone: profile.timezone,
          interests: profile.interests,
        },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      setProfile(response.data);
      setSuccess(true);
      setEditMode(false);
    } catch (error) {
      setError("Failed to update profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCloseSnackbar = () => {
    setError("");
    setSuccess(false);
  };

  const handleInterestAdd = (newInterest) => {
    setProfile((prev) => ({
      ...prev,
      interests: [...prev.interests, newInterest],
    }));
  };

  const handleInterestDelete = (interestToDelete) => {
    setProfile((prev) => ({
      ...prev,
      interests: prev.interests.filter(
        (interest) => interest !== interestToDelete
      ),
    }));
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 4 }}>
        <Typography variant="h4" gutterBottom textAlign="center">
          My Profile
        </Typography>
        {loading ? (
          <Typography>Loading...</Typography>
        ) : (
          <>
            {editMode ? (
              <>
                {/* Remove editing for Username and Email */}
                <TextField
                  label="Bio"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  multiline
                  rows={4}
                  value={profile.bio}
                  onChange={(e) =>
                    setProfile({ ...profile, bio: e.target.value })
                  }
                />
                <TextField
                  label="Location"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  value={profile.location}
                  onChange={(e) =>
                    setProfile({ ...profile, location: e.target.value })
                  }
                />
                <TextField
                  label="Timezone"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  value={profile.timezone}
                  onChange={(e) =>
                    setProfile({ ...profile, timezone: e.target.value })
                  }
                />
                <TextField
                  label="Interests"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && e.target.value) {
                      handleInterestAdd(e.target.value);
                      e.target.value = ""; // Clear input after adding
                    }
                  }}
                />
                <Box sx={{ display: "flex", flexWrap: "wrap", mt: 2 }}>
                  {profile.interests.map((interest) => (
                    <Chip
                      key={interest}
                      label={interest}
                      onDelete={() => handleInterestDelete(interest)}
                      sx={{ margin: 0.5 }}
                    />
                  ))}
                </Box>
                <Button
                  variant="contained"
                  color="primary"
                  fullWidth
                  sx={{ mt: 2 }}
                  onClick={handleProfileUpdate}
                >
                  Save Changes
                </Button>
              </>
            ) : (
              <Box>
                {/* Display Username and Email as plain text */}
                <Typography variant="h6">
                  Username: {profile.username}
                </Typography>
                <Typography variant="h6">Email: {profile.email}</Typography>
                <Typography variant="h6">Bio: {profile.bio}</Typography>

                {/* Display Location, Timezone, and Interests in the same line */}
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    mt: 2,
                  }}
                >
                  <Typography variant="h6" sx={{ mr: 2 }}>
                    Location: {profile.location}
                  </Typography>
                  <Typography variant="h6" sx={{ mr: 2 }}>
                    Timezone: {profile.timezone}
                  </Typography>
                  <Typography variant="h6">Interests:</Typography>
                  <Box sx={{ display: "flex", flexWrap: "wrap", ml: 1 }}>
                    {profile.interests.map((interest) => (
                      <Chip
                        key={interest}
                        label={interest}
                        sx={{ margin: 0.5 }}
                      />
                    ))}
                  </Box>
                </Box>

                <Button
                  variant="outlined"
                  color="primary"
                  fullWidth
                  sx={{ mt: 2 }}
                  onClick={() => setEditMode(true)}
                >
                  Edit Profile
                </Button>
              </Box>
            )}
          </>
        )}

        {/* Saved Articles Section */}
        <Box sx={{ mt: 4 }}>
          <Typography variant="h5">Saved Articles</Typography>
          {savedLoading ? (
            <Typography>Loading saved articles...</Typography>
          ) : savedError ? (
            <Typography>Error loading saved articles: {savedError}</Typography>
          ) : savedArticles.length === 0 ? (
            <Typography>No saved articles</Typography>
          ) : (
            <Box>
              {savedArticles.slice(0, 3).map((article, index) => (
                <NewsItem key={index} article={article.article} />
              ))}
              <Button component={Link} to="/profile/saved-items">
                View All Saved Articles
              </Button>
            </Box>
          )}
        </Box>

        {/* Recommendations Section */}
        <Box sx={{ mt: "4" }}>
          <Typography variant="h5">
            Want to see personalized recommendations?
          </Typography>
          <Button
            variant="contained"
            color="primary"
            component={Link}
            to="/recommendations"
            sx={{ mt: 2 }}
          >
            Go to Recommendations
          </Button>
        </Box>
      </Box>

      {/* Snackbar for error and success messages */}
      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity="error"
          sx={{ width: "100%" }}
        >
          {error}
        </Alert>
      </Snackbar>
      <Snackbar
        open={success}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity="success"
          sx={{ width: "100%" }}
        >
          Profile updated successfully!
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default ProfilePage;
