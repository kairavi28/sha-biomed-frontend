import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Container,
  Grid,
  Paper,
  CircularProgress,
  Button,
  TextField,
  Avatar,
  Divider,
  Tabs,
  Tab,
  IconButton,
} from "@mui/material";
import axios from "axios";
import EditIcon from "@mui/icons-material/Edit";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";

function ProfilePage() {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(0);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const userSession = JSON.parse(sessionStorage.getItem("userData"));
  const userId = userSession ? userSession.id : null;

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/user/${userId}`);
        setUserData(response.data);
      } catch (err) {
        setError("Failed to fetch user data.");
      } finally {
        setLoading(false);
      }
    };
    fetchUserData();
  }, [userId]);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleEditProfile = () => {
    setIsEditing(!isEditing);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImageFile(file);
    setUserData({ ...userData, avatar: URL.createObjectURL(file) });
  };

  const handleSave = async () => {
    const formData = new FormData();
    formData.append("firstname", userData.firstname);
    formData.append("lastname", userData.lastname);
    formData.append("email", userData.email);
    if (imageFile) {
      formData.append("avatar", imageFile);
    }

    try {
      await axios.put(`http://localhost:5000/user/${userId}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setIsEditing(false);
      alert("Profile updated successfully");
    } catch (err) {
      setError("Failed to update profile.");
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ background: "#f3f4f6", minHeight: "100vh", py: 4 }}>
      <Container maxWidth="md">
        <Paper elevation={4} sx={{ p: 4, borderRadius: 3 }}>
          <Typography variant="h5" align="center" fontWeight="bold" mb={4}>Profile</Typography>
          {error && <Typography color="error">{error}</Typography>}
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={4} textAlign="center">
              <Avatar src={userData?.avatar} sx={{ width: 250, height: 250, mb: 2 }} />
              {isEditing && (
                <IconButton color="primary" component="label">
                  <CloudUploadIcon />
                  <input type="file" hidden onChange={handleImageChange} />
                </IconButton>
              )}
            </Grid>
            <Grid item xs={12} md={8}>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <TextField
                    label="First Name"
                    name="firstname"
                    value={userData?.firstname || ""}
                    fullWidth
                    disabled={!isEditing}
                    onChange={handleInputChange}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    label="Last Name"
                    name="lastname"
                    value={userData?.lastname || ""}
                    fullWidth
                    disabled={!isEditing}
                    onChange={handleInputChange}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Email"
                    name="email"
                    value={userData?.email || ""}
                    fullWidth
                    disabled={!isEditing}
                    onChange={handleInputChange}
                  />
                </Grid>
              </Grid>
            </Grid>
          </Grid>
          <Box textAlign="center" mt={4}>
            {!isEditing ? (
              <Button variant="outlined" startIcon={<EditIcon />} onClick={handleEditProfile}>
                Edit Profile
              </Button>
            ) : (
              <Button variant="contained" color="primary" onClick={handleSave}>
                Save Changes
              </Button>
            )}
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}

export default ProfilePage;