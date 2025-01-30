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
} from "@mui/material";
import axios from "axios";
import EditIcon from "@mui/icons-material/Edit";

function ProfilePage() {
  const [userData, setUserData] = useState(null);
  const [recentActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(0);
  const [error, setError] = useState();
  const userSession = JSON.parse(sessionStorage.getItem('userData'));
  console.log('Profile-page', userSession); 
  const userId = userSession ? userSession.id : null;

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(`http://35.182.166.248/api/user/${userId}`);
        setUserData(response.data);
      } catch (err) {
        if (err.response) {
          setError(err.response.data.message || "Error fetching user data");
        } else {
          setError("Network error or server not reachable");
        }
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
    alert("Edit Profile functionality coming soon!");
  };

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
        sx={{ background: "#f3f4f6" }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{
      background: "linear-gradient(to bottom, white, #b3e0ff, #b3e6b3)",
      minHeight: "100vh",
      pb: 1,
      justifyContent: "center",
      alignItems: "center",
      overflowX: 'hidden'
    }}>
      <Container maxWidth="lg"
        sx={{
          // background: "",
          borderRadius: 4,
          boxShadow: "0px 10px 20px rgba(0, 0, 0, 0.1)",
          py: 4,
          px: 4,
        }}>
        <Typography
          variant="h5"
          align="center"
          fontWeight="bold"
          sx={{
            mb: 6,
            color: "#333",
            textTransform: "uppercase",
            letterSpacing: 1.5,
          }}
        >
          Welcome, {userData?.name}
        </Typography>
        {/* User Information */}
        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <Paper
              elevation={4}
              sx={{
                p: 3,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                borderRadius: 3,
              }}
            >
              <Avatar
                src={userData?.avatar}
                alt={userData?.name}
                sx={{ width: 120, height: 120, mb: 2 }}
              />
              <Typography variant="h6" fontWeight="bold">
                {userData?.name}
              </Typography>
              <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
                {userData?.email}
              </Typography>
              <Button
                variant="outlined"
                startIcon={<EditIcon />}
                onClick={handleEditProfile}
              >
                Edit Profile
              </Button>
            </Paper>
          </Grid>

          <Grid item xs={12} md={8}>
            <Paper elevation={4} sx={{ p: 3, borderRadius: 3 }}>
              <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
                Personal Details
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <TextField
                    label="Full Name"
                    value={userData?.name}
                    fullWidth
                    InputProps={{ readOnly: true }}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    label="Email"
                    value={userData?.email}
                    fullWidth
                    InputProps={{ readOnly: true }}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    label="Phone Number"
                    value={userData?.phone || "N/A"}
                    fullWidth
                    InputProps={{ readOnly: true }}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    label="Facility"
                    value={userData?.facility || "N/A"}
                    fullWidth
                    InputProps={{ readOnly: true }}
                  />
                </Grid>
              </Grid>
            </Paper>
          </Grid>
        </Grid>

        {/* Tabs for Recent Activities and Settings */}
        <Box sx={{ mt: 4 }}>
          <Paper elevation={4} sx={{ borderRadius: 3 }}>
            <Tabs
              value={activeTab}
              onChange={handleTabChange}
              variant="fullWidth"
              indicatorColor="primary"
              textColor="primary"
            >
              <Tab label="Recent Activities" />
              <Tab label="Settings" />
            </Tabs>
          </Paper>

          {activeTab === 0 && (
            <Paper
              elevation={4}
              sx={{ p: 3, mt: 2, borderRadius: 3, backgroundColor: "#fff" }}
            >
              <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
                Recent Activities
              </Typography>
              {recentActivities.length > 0 ? (
                <Grid container spacing={2}>
                  {recentActivities.map((activity) => (
                    <Grid item xs={12} key={activity.id}>
                      <Paper
                        elevation={2}
                        sx={{
                          p: 2,
                          borderRadius: 2,
                          backgroundColor: "#f9f9f9",
                        }}
                      >
                        <Typography variant="body1" fontWeight="bold">
                          {activity.title}
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                          {activity.description}
                        </Typography>
                        <Typography
                          variant="caption"
                          color="textSecondary"
                          sx={{ mt: 1 }}
                        >
                          {new Date(activity.date).toLocaleString()}
                        </Typography>
                      </Paper>
                    </Grid>
                  ))}
                </Grid>
              ) : (
                <Typography variant="body2" color="textSecondary">
                  No recent activities to show.
                </Typography>
              )}
            </Paper>
          )}

          {activeTab === 1 && (
            <Paper
              elevation={4}
              sx={{ p: 3, mt: 2, borderRadius: 3, backgroundColor: "#fff" }}
            >
              <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
                Settings
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Settings functionality coming soon!
              </Typography>
            </Paper>
          )}
        </Box>
      </Container>
    </Box>
  );
}

export default ProfilePage;
