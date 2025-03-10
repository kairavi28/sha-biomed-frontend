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
  MenuItem,
  Select,
  Chip,
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

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/user/${userId}`);
        setUserData(response.data);
        if (response.data?.facilities) {
          setSelectedFacilities(response.data.facilities.map(facility => facility.name));
        }
      } catch (err) {
        setError("Failed to fetch user data.");
      } finally {
        setLoading(false);
      }
    };
  
    const fetchFacilities = async () => {
      try {
        const response = await axios.get("http://localhost:5000/facilities/company_name");
        const facilityNames = [...new Set(response.data.map(facility => facility.Company_Name))];
        setAvailableFacilities(facilityNames);
      } catch (err) {
        console.error("Failed to fetch facilities.", err);
      }
    };
  
    if (userId) {
      fetchUserData();
      fetchFacilities();
    }
  }, [userId]); // only re-fetch when userId changes
  
  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

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

  const handleSave = async () => {
    const formData = new FormData();
    formData.append("firstname", userData.firstname);
    formData.append("lastname", userData.lastname);
    formData.append("email", userData.email);
    formData.append("facilities", JSON.stringify(selectedFacilities));

    // Only append the image file if one was selected
    if (imageFile) {
      formData.append("avatar", imageFile);
    }

    try {
      await axios.put(`http://localhost:5000/user/edit/${userId}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setIsEditing(false);
      alert("Profile updated successfully");
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
                      freeSolo
                      options={availableFacilities}
                      value={selectedFacilities}
                      onChange={(event, newValue) => {
                        setSelectedFacilities(newValue);
                      }}
                      isOptionEqualToValue={(option, value) => option === value}
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
                      renderOption={(props, option, { selected }) => (
                        <li
                          {...props}
                          style={{
                            padding: '10px',
                            backgroundColor: selected ? '#1976D2' : '#fff',
                            color: selected ? 'white' : 'black',
                            cursor: 'pointer',
                            borderBottom: '1px solid #dce6f1',
                          }}
                        >
                          {option}
                        </li>
                      )}
                    />

                  </Box>
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