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
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip } from "@mui/material";
import axios from "axios";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import PersonIcon from "@mui/icons-material/Person";
import HourglassEmptyIcon from "@mui/icons-material/HourglassEmpty";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import Autocomplete from "@mui/material/Autocomplete";
import Footer from "./Footer";
import { motion } from "framer-motion";

function ProfilePage() {
  const [userData, setUserData] = useState(null);
  const API_BASE_URL = process.env.REACT_APP_API_URL || "https://biomedwaste.net/api";
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [localAvatarPreview, setLocalAvatarPreview] = useState(null);
  const fileInputRef = React.useRef(null);
  const [availableFacilities, setAvailableFacilities] = useState([]);
  const [selectedFacilities, setSelectedFacilities] = useState([]);
  const [pendingFacilities, setPendingFacilities] = useState([]);
  const userSession = JSON.parse(sessionStorage.getItem("userData"));
  const userId = userSession?.id ? userSession.id : userSession?._id;
  const [dialogOpen, setDialogOpen] = useState(false);
  const [complaints, setComplaints] = useState([]);
  const [dialogMessage, setDialogMessage] = useState("");
  const [filteredComplaints, setFilteredComplaints] = useState([]);

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  useEffect(() => {
    const approvedFacilities = sessionStorage.getItem('facilityApproved');
    if (approvedFacilities) {
      const facilities = JSON.parse(approvedFacilities);
      setSnackbar({
        open: true,
        message: `Facility "${facilities.join(", ")}" has been approved!`,
        severity: "success",
      });
      sessionStorage.removeItem('facilityApproved');
    }
    
    const savedAvatar = localStorage.getItem(`avatar_${userId}`);
    if (savedAvatar) {
      setLocalAvatarPreview(savedAvatar);
    }
  }, [userId]);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/user/${userId}`);
        setUserData(response.data);
        if (response.data?.facilities) {
          const approvedFacilities = response.data.facilities
            .filter(facility => facility.approved)
            .map(facility => facility.name);
          const pending = response.data.facilities
            .filter(facility => !facility.approved)
            .map(facility => facility.name);
          setSelectedFacilities(approvedFacilities);
          setPendingFacilities(pending);
        }
      } catch (err) {
        setError("Failed to fetch user data.");
      } finally {
        setLoading(false);
      }
    };

    const fetchFacilities = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/json/company_name`);
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
  }, [userId, API_BASE_URL]);

  useEffect(() => {
    fetch(`${API_BASE_URL}/client-complaint`)
      .then((response) => response.json())
      .then((data) => {
        setComplaints(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching complaints:", error);
        setLoading(false);
      });
  }, [API_BASE_URL]);

  const handleEditProfile = () => {
    setIsEditing(!isEditing);
  };

  const handleInputChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const previewUrl = URL.createObjectURL(file);
      setLocalAvatarPreview(previewUrl);
      
      const reader = new FileReader();
      reader.onloadend = () => {
        localStorage.setItem(`avatar_${userId}`, reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  useEffect(() => {
    const checkFacilityApproval = async () => {
      const currentUserSession = JSON.parse(sessionStorage.getItem("userData"));
      const currentUserId = currentUserSession?.id ? currentUserSession.id : currentUserSession?._id;

      if (!currentUserId) {
        return;
      }

      try {
        const response = await axios.get(`${API_BASE_URL}/user/${currentUserId}`);
        const newApprovedFacilities = response.data?.facilities
          ?.filter(facility => facility.approved)
          .map(facility => facility.name) || [];
        const newPendingFacilities = response.data?.facilities
          ?.filter(facility => !facility.approved)
          .map(facility => facility.name) || [];

        const previouslyPendingNowApproved = pendingFacilities.filter(
          pendingName => newApprovedFacilities.includes(pendingName)
        );

        if (previouslyPendingNowApproved.length > 0) {
          sessionStorage.setItem('facilityApproved', JSON.stringify(previouslyPendingNowApproved));
          window.location.reload();
          return;
        }

        setUserData(response.data);
        setSelectedFacilities(newApprovedFacilities);
        setPendingFacilities(newPendingFacilities);
      } catch (err) {
        console.error("Error checking facility approval:", err);
      }
    };

    const interval = setInterval(checkFacilityApproval, 30 * 1000);

    return () => clearInterval(interval);
  }, [API_BASE_URL, pendingFacilities]);

  useEffect(() => {
    if (userData && complaints.length > 0) {
      const filtered = complaints.filter(
        (complaint) => complaint.userEmail === userData.email
      );
      setFilteredComplaints(filtered);
    }
  }, [userData, complaints]);

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
      const response = await axios.put(`${API_BASE_URL}/user/edit/${userId}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const updatedResponse = await axios.get(`${API_BASE_URL}/user/${userId}`);
      setUserData(updatedResponse.data);
      setImageFile(null);

      const approvedFacilities = updatedResponse.data?.facilities
        .filter(facility => facility.approved)
        .map(facility => facility.name);
      const pending = updatedResponse.data?.facilities
        .filter(facility => !facility.approved)
        .map(facility => facility.name);

      setSelectedFacilities(approvedFacilities);
      setPendingFacilities(pending);
      setIsEditing(false);
      setSnackbar({
        open: true,
        message: "Profile changes saved successfully",
        severity: "success",
      });

      if (response.data.newlyAddedFacilities && response.data.newlyAddedFacilities.length > 0) {
        const facilityNames = response.data.newlyAddedFacilities;
        for (const facilityName of facilityNames) {
          await axios.post(`${API_BASE_URL}/user/request-facility`, { userId, facilityName }, {
            headers: { "Content-Type": "application/json" },
          });
        }
        setDialogMessage(`Facility "${facilityNames.join(", ")}" has been sent for approval. It will be approved within 24 hours or up to 2 business days.`);
        setDialogOpen(true);
      }
    } catch (err) {
      console.error("Error updating profile:", err);
      const errorMessage = err.response?.data?.message || err.message || "Failed to update profile.";
      setSnackbar({
        open: true,
        message: errorMessage,
        severity: "error",
      });
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
    <Box sx={{ backgroundColor: "#f5f5f5", minHeight: "100vh" }}>
      <Container maxWidth="lg" sx={{ pt: { xs: 14, md: 16 }, pb: 6 }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Paper 
            elevation={0} 
            sx={{ 
              p: { xs: 3, md: 5 }, 
              borderRadius: 2,
              border: '1px solid #e0e0e0',
              mb: 4
            }}
          >
            <Typography 
              variant="h5" 
              fontWeight="bold" 
              color="#0D2477" 
              mb={4}
              sx={{ fontSize: { xs: '1.25rem', md: '1.5rem' } }}
            >
              Profile
            </Typography>

            {error && (
              <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>
            )}

            {pendingFacilities.length > 0 && (
              <Box 
                sx={{ 
                  mb: 4, 
                  p: 2.5, 
                  backgroundColor: '#FFF8E1', 
                  borderRadius: 2,
                  border: '1px solid #FFE082',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: 2
                }}
              >
                <HourglassEmptyIcon sx={{ color: '#F9A825', fontSize: 28, mt: 0.5 }} />
                <Box sx={{ flex: 1 }}>
                  <Typography variant="subtitle1" fontWeight="600" color="#5D4037" mb={1}>
                    Pending Facility Approval
                  </Typography>
                  <Typography variant="body2" color="#795548" mb={2}>
                    The following facility request(s) are awaiting approval. This typically takes 24 hours to 2 business days.
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {pendingFacilities.map((facility, index) => (
                      <Chip
                        key={index}
                        label={facility}
                        icon={<HourglassEmptyIcon sx={{ fontSize: 16 }} />}
                        sx={{
                          backgroundColor: '#FFE082',
                          color: '#5D4037',
                          fontWeight: 500,
                          '& .MuiChip-icon': {
                            color: '#F9A825'
                          }
                        }}
                      />
                    ))}
                  </Box>
                </Box>
              </Box>
            )}

            <Grid container spacing={4} alignItems="flex-start">
              <Grid item xs={12} md={3} sx={{ textAlign: { xs: 'center', md: 'left' } }}>
                <Box sx={{ position: 'relative', display: 'inline-block' }}>
                  <Avatar 
                    src={localAvatarPreview || userData?.avatar} 
                    sx={{ 
                      width: { xs: 150, md: 180 }, 
                      height: { xs: 150, md: 180 }, 
                      backgroundColor: '#e0e0e0',
                      border: '4px solid #f0f0f0'
                    }}
                  >
                    {!localAvatarPreview && !userData?.avatar && (
                      <PersonIcon sx={{ fontSize: { xs: 80, md: 100 }, color: '#bdbdbd' }} />
                    )}
                  </Avatar>
                  {isEditing && (
                    <>
                      <input 
                        type="file" 
                        ref={fileInputRef}
                        style={{ display: 'none' }}
                        onChange={handleImageChange} 
                        accept="image/*" 
                      />
                      <IconButton 
                        color="primary" 
                        onClick={() => fileInputRef.current?.click()}
                        sx={{
                          position: 'absolute',
                          bottom: 0,
                          right: 0,
                          backgroundColor: '#0D2477',
                          color: 'white',
                          '&:hover': { backgroundColor: '#1a3a8f' }
                        }}
                      >
                        <CloudUploadIcon />
                      </IconButton>
                    </>
                  )}
                </Box>
              </Grid>

              <Grid item xs={12} md={9}>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" color="text.secondary" mb={0.5}>
                      First Name
                    </Typography>
                    <TextField
                      name="firstname"
                      value={userData?.firstname || ""}
                      fullWidth
                      disabled={!isEditing}
                      onChange={handleInputChange}
                      variant="outlined"
                      size="small"
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 1,
                          backgroundColor: isEditing ? '#fff' : '#fafafa',
                        }
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" color="text.secondary" mb={0.5}>
                      Last Name
                    </Typography>
                    <TextField
                      name="lastname"
                      value={userData?.lastname || ""}
                      fullWidth
                      disabled={!isEditing}
                      onChange={handleInputChange}
                      variant="outlined"
                      size="small"
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 1,
                          backgroundColor: isEditing ? '#fff' : '#fafafa',
                        }
                      }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="body2" color="text.secondary" mb={0.5}>
                      Email
                    </Typography>
                    <TextField
                      name="email"
                      value={userData?.email || ""}
                      fullWidth
                      disabled={!isEditing}
                      onChange={handleInputChange}
                      variant="outlined"
                      size="small"
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 1,
                          backgroundColor: isEditing ? '#fff' : '#fafafa',
                        }
                      }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="body2" color="text.secondary" mb={0.5}>
                      Facilities
                    </Typography>
                    {isEditing ? (
                      <Autocomplete
                        multiple
                        options={availableFacilities}
                        value={selectedFacilities}
                        onChange={(event, newValue) => {
                          setSelectedFacilities(newValue);
                        }}
                        getOptionLabel={(option) => option}
                        disableCloseOnSelect
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            placeholder="Select facilities"
                            fullWidth
                            variant="outlined"
                            size="small"
                            sx={{
                              '& .MuiOutlinedInput-root': {
                                borderRadius: 1,
                              }
                            }}
                          />
                        )}
                        sx={{
                          '& .MuiAutocomplete-tag': {
                            backgroundColor: '#0D2477',
                            color: 'white',
                            borderRadius: 1,
                          }
                        }}
                        renderOption={(props, option) => {
                          const isApproved = userData?.facilities?.some(
                            (facility) => facility.name === option && facility.approved
                          );
                          const isPending = userData?.facilities?.some(
                            (facility) => facility.name === option && !facility.approved
                          );
                          return (
                            <li
                              {...props}
                              style={{
                                padding: '10px',
                                backgroundColor: isApproved ? '#e8f5e9' : isPending ? '#FFF8E1' : '#fff',
                                borderBottom: '1px solid #eee',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between'
                              }}
                            >
                              <span>{option}</span>
                              {isApproved && (
                                <CheckCircleIcon sx={{ color: '#4caf50', fontSize: 18, ml: 1 }} />
                              )}
                              {isPending && (
                                <HourglassEmptyIcon sx={{ color: '#F9A825', fontSize: 18, ml: 1 }} />
                              )}
                            </li>
                          );
                        }}
                      />
                    ) : (
                      <Box 
                        sx={{ 
                          display: 'flex', 
                          flexWrap: 'wrap', 
                          gap: 1,
                          p: 1.5,
                          backgroundColor: '#fafafa',
                          borderRadius: 1,
                          border: '1px solid #e0e0e0',
                          minHeight: 42
                        }}
                      >
                        {selectedFacilities.length === 0 ? (
                          <Typography variant="body2" color="text.secondary" sx={{ py: 0.5 }}>
                            No facilities assigned
                          </Typography>
                        ) : (
                          selectedFacilities.map((facility, index) => (
                            <Chip
                              key={index}
                              label={facility}
                              icon={<CheckCircleIcon sx={{ fontSize: 16 }} />}
                              sx={{
                                backgroundColor: '#e8f5e9',
                                color: '#2e7d32',
                                fontWeight: 500,
                                '& .MuiChip-icon': {
                                  color: '#4caf50'
                                }
                              }}
                            />
                          ))
                        )}
                      </Box>
                    )}
                  </Grid>
                  <Grid item xs={12} sx={{ mt: 2 }}>
                    {!isEditing ? (
                      <Button 
                        variant="outlined" 
                        onClick={handleEditProfile}
                        sx={{
                          borderColor: '#0D2477',
                          color: '#0D2477',
                          borderRadius: 2,
                          px: 4,
                          py: 1,
                          textTransform: 'none',
                          fontWeight: 500,
                          '&:hover': {
                            borderColor: '#0D2477',
                            backgroundColor: 'rgba(13, 36, 119, 0.04)'
                          }
                        }}
                      >
                        Edit Profile
                      </Button>
                    ) : (
                      <Box sx={{ display: 'flex', gap: 2 }}>
                        <Button 
                          variant="contained" 
                          onClick={handleSave}
                          sx={{
                            backgroundColor: '#0D2477',
                            borderRadius: 2,
                            px: 4,
                            py: 1,
                            textTransform: 'none',
                            fontWeight: 500,
                            '&:hover': {
                              backgroundColor: '#1a3a8f'
                            }
                          }}
                        >
                          Save Changes
                        </Button>
                        <Button 
                          variant="outlined" 
                          onClick={() => setIsEditing(false)}
                          sx={{
                            borderColor: '#666',
                            color: '#666',
                            borderRadius: 2,
                            px: 4,
                            py: 1,
                            textTransform: 'none',
                            fontWeight: 500,
                          }}
                        >
                          Cancel
                        </Button>
                      </Box>
                    )}
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Paper>

          <Paper 
            elevation={0} 
            sx={{ 
              p: { xs: 3, md: 5 }, 
              borderRadius: 2,
              border: '1px solid #e0e0e0'
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
              <AccessTimeIcon sx={{ color: '#0D2477', fontSize: 24 }} />
              <Typography 
                variant="h6" 
                fontWeight="bold" 
                color="#0D2477"
              >
                Complaints
              </Typography>
            </Box>
            <Typography variant="body2" color="text.secondary" mb={3}>
              Here's a list of all the submitted complaints by you.
            </Typography>

            <TableContainer sx={{ borderRadius: 1, overflow: 'hidden' }}>
              <Table>
                <TableHead>
                  <TableRow sx={{ backgroundColor: "#0D2477" }}>
                    <TableCell sx={{ color: 'white', fontWeight: 600, py: 2 }}>Complaints #</TableCell>
                    <TableCell sx={{ color: 'white', fontWeight: 600, py: 2 }}>Complaint Description</TableCell>
                    <TableCell sx={{ color: 'white', fontWeight: 600, py: 2 }}>Submitted on Date</TableCell>
                    <TableCell sx={{ color: 'white', fontWeight: 600, py: 2 }}>Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredComplaints.length > 0 ? (
                    filteredComplaints.map((complaint, index) => (
                      <TableRow
                        key={index}
                        sx={{ 
                          "&:hover": { backgroundColor: "#f9f9f9" },
                          borderBottom: '1px solid #eee'
                        }}
                      >
                        <TableCell sx={{ py: 2 }}>{index + 1}</TableCell>
                        <TableCell sx={{ py: 2 }}>{complaint.description}</TableCell>
                        <TableCell sx={{ py: 2 }}>
                          {new Date(complaint.createdAt).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "numeric",
                            day: "numeric"
                          })}
                        </TableCell>
                        <TableCell sx={{ py: 2 }}>
                          <Chip
                            label={complaint.status === "resolved" ? "Resolved" : "Pending"}
                            size="small"
                            sx={{
                              backgroundColor: complaint.status === "resolved" ? '#4caf50' : '#D9DE38',
                              color: complaint.status === "resolved" ? 'white' : '#333',
                              fontWeight: 500,
                              borderRadius: 1,
                              px: 1
                            }}
                          />
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={4} align="center" sx={{ py: 4, color: 'text.secondary' }}>
                        No complaints found.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </motion.div>
      </Container>

      <Footer />

      <Dialog 
        open={dialogOpen} 
        onClose={() => setDialogOpen(false)}
        PaperProps={{
          sx: {
            borderRadius: 2,
            p: 1
          }
        }}
      >
        <DialogTitle sx={{ color: '#0D2477', fontWeight: 600 }}>
          Facility Approval Request Sent
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
            <HourglassEmptyIcon sx={{ color: '#F9A825', fontSize: 40 }} />
            <DialogContentText sx={{ m: 0 }}>{dialogMessage}</DialogContentText>
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button 
            onClick={() => setDialogOpen(false)} 
            variant="contained"
            sx={{
              backgroundColor: '#0D2477',
              '&:hover': { backgroundColor: '#1a3a8f' },
              textTransform: 'none',
              px: 4
            }}
          >
            Got it
          </Button>
        </DialogActions>
      </Dialog>

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
