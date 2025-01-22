import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Button,
  Box,
  IconButton,
  Menu,
  MenuItem,
  Typography,
  Divider,
  Dialog,
  Snackbar,
  DialogTitle,
  DialogContent,
  TextField,
  Select,
  MenuItem as DropdownItem,
  InputLabel,
  FormControl,
  DialogActions,
  Alert,
} from "@mui/material";
import { Settings, AccountCircle, Logout, Person } from "@mui/icons-material";
import { useNavigate, useLocation } from "react-router-dom";
import logo from "../assets/images/logo.png";
import axios from "axios";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation(); // Get current route
  const [anchorEl, setAnchorEl] = useState(null);
  const [openModal, setOpenModal] = useState(false); // State for modal open/close
  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    company: "",
    phone: "",
    email: "",
    province: "",
    postalCode: "",
    description: "",
  });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success", // can be "success", "error", "warning", "info"
  });

  // Handle menu open
  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  // Handle menu close
  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  // Handle modal open/close
  const handleModalOpen = () => setOpenModal(true);
  const handleModalClose = () => setOpenModal(false);

  // Handle form field changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle Snackbar close
  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  // Handle form submission
  const handleSubmit = () => {
    axios
      .post("http://localhost:5000/api/quote", formData)
      .then((res) => {
        setSnackbar({
          open: true,
          message: "Quote request submitted successfully!",
          severity: "success",
        });
        setOpenModal(false);
        setFormData({
          firstname: "",
          lastname: "",
          company: "",
          phone: "",
          email: "",
          province: "",
          postalCode: "",
          description: "",
        });
      })
      .catch((err) => {
        setSnackbar({
          open: true,
          message: "Error submitting the request. Please try again.",
          severity: "error",
        });
      });
  };

  // Helper function to check if the route is active
  const isActive = (path) => location.pathname === path;

  return (
    <>
      <AppBar
        position="static"
        sx={{
          backgroundColor: "#ffffff",
          color: "#003366",
          boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
          borderBottom: "3px solid #C9CC3F",
        }}
      >
        {/* Contact Info Row */}
        <Box
          sx={{
            backgroundColor: "#F3F4F6",
            padding: "8px 0",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            paddingX: 2,
          }}
        >
          <Typography
            variant="body2"
            sx={{ color: "#003366", fontWeight: "bold", display: "flex", alignItems: "center", gap: 1 }}
          >
            <span>📞</span> +1-866-288-3298
          </Typography>
          <Typography
            variant="body2"
            sx={{
              color: "#003366",
              fontWeight: "bold",
              display: "flex",
              alignItems: "center",
              gap: 1,
            }}
          >
            <span>📧</span> support@biomedwaste.com
          </Typography>
          <Button
            onClick={() => handleModalOpen()}
            variant="contained"
            sx={{
              backgroundColor: "#C9CC3F",
              color: "#003366",
              fontWeight: "bold",
              textTransform: "none",
              "&:hover": {
                backgroundColor: "#A9AC2B",
              },
            }}
          >
            Request Free Quote
          </Button>
        </Box>

        {/* Main Navbar Row */}
        <Toolbar
          sx={{
            display: "flex",
            justifyContent: "space-between",
            paddingX: 2,
          }}
        >
          {/* Logo */}
          <Box component="div" sx={{ cursor: "pointer" }} onClick={() => navigate("/home")}>
            <img src={logo} alt="Logo" style={{ width: "120px", height: "auto" }} />
          </Box>

          {/* Menu Items */}
          <Box display="flex" alignItems="center" gap={4}>
            <Button
              onClick={() => navigate("/services")}
              sx={{
                color: isActive("/services") ? "#C9CC3F" : "#003366",
                fontWeight: "bold",
                textTransform: "none",
                fontSize: "16px",
                borderBottom: isActive("/services") ? "2px solid #C9CC3F" : "none",
                "&:hover": {
                  color: "#ffffff",
                  backgroundColor: "#C9CC3F",
                  borderRadius: "8px",
                },
              }}
            >
              Complaint Services
            </Button>
            {/* Profile Icon with Dropdown Menu */}
            <IconButton
              onClick={handleMenuOpen}
              sx={{
                color: "#003366",
                "&:hover": {
                  color: "#ffffff",
                  backgroundColor: "#C9CC3F",
                  borderRadius: "50%",
                },
              }}
            >
              <AccountCircle fontSize="large" />
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
              sx={{
                mt: "5px",
                "& .MuiPaper-root": {
                  borderRadius: "8px",
                  boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
                  minWidth: "180px",
                },
              }}
            >
              <MenuItem
                onClick={() => {
                  handleMenuClose();
                  navigate("/profile");
                }}
                sx={{ display: "flex", gap: 1 }}
              >
                <Person fontSize="small" />
                <Typography variant="inherit">Profile</Typography>
              </MenuItem>
              <Divider />
              <MenuItem
                onClick={() => {
                  handleMenuClose();
                  axios
                    .post("http://localhost:5000/logout")
                    .then(() => {
                      navigate("/");
                    })
                    .catch(() => {
                      alert("There was an error logging out.");
                    });
                }}
                sx={{ display: "flex", gap: 1 }}
              >
                <Logout fontSize="small" />
                <Typography variant="inherit">Logout</Typography>
              </MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Modal for Request Quote */}
      <Dialog open={openModal} onClose={handleModalClose} fullWidth maxWidth="sm">
        <DialogTitle>Request Free Quote</DialogTitle>
        <DialogContent>
          {/* Form Fields */}
          <Box component="form" sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <TextField name="firstname" label="First Name" value={formData.firstname} onChange={handleChange} fullWidth />
            <TextField name="lastname" label="Last Name" value={formData.lastname} onChange={handleChange} fullWidth />
            <TextField name="company" label="Company" value={formData.company} onChange={handleChange} fullWidth />
            <TextField name="phone" label="Phone" value={formData.phone} onChange={handleChange} fullWidth />
            <TextField name="email" label="Email" value={formData.email} onChange={handleChange} fullWidth />
            <FormControl fullWidth>
              <InputLabel>Province</InputLabel>
              <Select name="province" value={formData.province} onChange={handleChange}>
                <DropdownItem value="Ontario">Ontario</DropdownItem>
                {/* Add other provinces */}
              </Select>
            </FormControl>
            <TextField name="postalCode" label="Postal Code" value={formData.postalCode} onChange={handleChange} fullWidth />
            <TextField
              name="description"
              label="Tell us about your service needs"
              value={formData.description}
              onChange={handleChange}
              fullWidth
              multiline
              rows={4}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleModalClose}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained" color="primary">
            Submit
          </Button>
        </DialogActions>
      </Dialog>

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
    </>
  );
};

export default Navbar;
