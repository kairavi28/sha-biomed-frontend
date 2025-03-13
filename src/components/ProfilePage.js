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
  Snackbar,
  Alert,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle
} from "@mui/material";
import axios from "axios";
import EditIcon from "@mui/icons-material/Edit";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import Autocomplete from "@mui/material/Autocomplete";

function ProfilePage() {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(0);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [availableFacilities, setAvailableFacilities] = useState([]);
  const [selectedFacilities, setSelectedFacilities] = useState([]);
  const userSession = JSON.parse(sessionStorage.getItem("userData"));
  const userId = userSession ? userSession.id : null;
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMessage, setDialogMessage] = useState("");
  //Snackbar for notifications
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  // Handle Snackbar close
  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/user/${userId}`);
        setUserData(response.data);
  
        if (response.data?.facilities) {
          const approvedFacilities = response.data.facilities
            .filter(facility => facility.approved)
            .map(facility => facility.name);
  
          setSelectedFacilities(approvedFacilities);
        }
      } catch (err) {
        setError("Failed to fetch user data.");
      } finally {
        setLoading(false);
      }
    };
  
    const fetchFacilities = async () => {
      try {
        const response = await axios.get("http://localhost:5000/json/company_name");

        const facilityNames = [...new Set(response.data.map(facility => facility.CompanyName))];
        setAvailableFacilities(facilityNames);
      } catch (err) {
        console.error("Failed to fetch facilities.", err);
      }
    };
    if (userId) {
      fetchUserData();
      fetchFacilities();
    }
  }, [userId]);

  const handleEditProfile = () => {
    setIsEditing(!isEditing);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImageFile(file);
    setUserData({ ...userData, avatar: URL.createObjectURL(file) });
  };

  const handleFacilitiesChange = (event) => {
    setSelectedFacilities(event.target.value);
  };

  useEffect(() => {
    const interval = setInterval(async () => {
      const currentUserSession = JSON.parse(sessionStorage.getItem("userData"));
      const currentUserId = currentUserSession ? currentUserSession.id : null;
      
      if (!currentUserId) {
        console.error("User ID is undefined inside interval");
        return;
      }
  
      try {
        const response = await axios.get(`http://localhost:5000/user/${currentUserId}`);
        const approvedFacilities = response.data?.facilities
          .filter(facility => facility.approved)
          .map(facility => facility.name);
  
        setUserData(response.data);
        setSelectedFacilities(approvedFacilities);
  
        if (response.data?.facilities.some(facility => facility.approved)) {
          window.location.reload();
        }
      } catch (err) {
        console.error("Error checking facility approval:", err);
      }
    }, 3 * 60 * 1000);
  
    return () => clearInterval(interval);
  }, []);
  

  const handleSave = async () => {
    const formData = new FormData();
    formData.append("firstname", userData.firstname);
    formData.append("lastname", userData.lastname);
    formData.append("email", userData.email);
    formData.append("facilities", JSON.stringify(selectedFacilities));
  
    if (imageFile) {
      formData.append("avatar", imageFile);
    }
  
    try {
      // Send update request
      const response = await axios.put(`http://localhost:5000/user/edit/${userId}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
  
      // Fetch updated user data
      const updatedResponse = await axios.get(`http://localhost:5000/user/${userId}`);
      setUserData(updatedResponse.data);
  
      const approvedFacilities = updatedResponse.data?.facilities
        .filter(facility => facility.approved)
        .map(facility => facility.name);
  
      setSelectedFacilities(approvedFacilities);
  
      setIsEditing(false);
      setSnackbar({
        open: true,
        message: "PROFILE CHANGES ARE SAVED SUCCESSFULLY",
        severity: "success",
      });
  
      // Check if any newly added facilities need approval
      if (response.data.newlyAddedFacilities.length > 0) {
        const facilityNames = response.data.newlyAddedFacilities;
  
        // Send approval request for each new facility
        for (const facilityName of facilityNames) {
          await axios.post(`http://localhost:5000/user/request-facility`, { userId, facilityName }, {
            headers: { "Content-Type": "application/json" },
          });
        }
  
        setDialogMessage(`Facility ${facilityNames.join(", ")} has been sent for approval. It will be approved within 24 hours or up to 2 business days.`);
        setDialogOpen(true);
      }
    } catch (err) {
      console.error("Error updating profile:", err);
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
                <Grid item xs={12}>
                  <Typography>Facilities</Typography>
                  <Box sx={{ overflow: "visible" }}>
                    <Autocomplete
                      multiple
                      options={availableFacilities}
                      value={selectedFacilities}
                      onChange={(event, newValue) => {
                        setSelectedFacilities(newValue);
                      }}
                      getOptionLabel={(option) => option}
                      disableCloseOnSelect
                      disabled={!isEditing}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Facilities"
                          placeholder="Select or type facilities"
                          fullWidth
                          variant="outlined"
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              borderRadius: '12px',
                              backgroundColor: '#f9f9f9',
                            },
                            '& .MuiInputLabel-root': {
                              color: '#1976D2',
                            },
                          }}
                        />
                      )}
                      sx={{
                        '& .MuiAutocomplete-tag': {
                          backgroundColor: '#1976D2',
                          color: 'white',
                          fontWeight: 'bold',
                          borderRadius: '8px',
                          padding: '4px 8px',
                        },
                        '& .MuiOutlinedInput-root': {
                          padding: '10px',
                        },
                        '& .MuiAutocomplete-popupIndicator': {
                          color: '#1976D2',
                        },
                        '& .MuiAutocomplete-clearIndicator': {
                          color: '#FF5252',
                        },
                      }}
                      ListboxProps={{
                        style: {
                          maxHeight: '200px',
                          overflowY: 'auto',
                          border: '1px solid #1976D2',
                          borderRadius: '8px',
                          backgroundColor: '#fff',
                        },
                      }}
                      renderOption={(props, option) => {
                        const isApproved = userData?.facilities?.some(
                          (facility) => facility.name === option && facility.approved
                        );

                        return (
                          <li
                            {...props}
                            style={{
                              padding: '10px',
                              backgroundColor: isApproved ? '#e8f5e9' : '#fff', // Light green for approved
                              color: 'black',
                              cursor: 'pointer',
                              borderBottom: '1px solid #dce6f1',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                            }}
                          >
                            {option}
                            {isApproved && (
                              <span style={{ color: 'green', fontWeight: 'bold' }}>✔️</span>
                            )}
                          </li>
                        );
                      }}
                    />

                  </Box>
                  <Box sx={{ overflow: "visible", margin: "10px" }}>
                    {/* <Typography>
                      Approved Facilities: {selectedFacilities.length ? selectedFacilities.join(", ") : "None"}
                    </Typography> */}
                  </Box>
                  <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
                    <DialogTitle>Facility Approval</DialogTitle>
                    <DialogContent>
                      <DialogContentText>{dialogMessage}</DialogContentText>
                    </DialogContent>
                    <DialogActions>
                      <Button onClick={() => setDialogOpen(false)} color="primary">
                        OK
                      </Button>
                    </DialogActions>
                  </Dialog>
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
      {/* Snackbar for Feedback */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbar.severity} sx={{ width: "100%" }}>
          {snackbar.message}
        </Alert>
      </Snackbar>

    </Box>
  );
}

export default ProfilePage;