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
import { AccountCircle, Logout, Person } from "@mui/icons-material";
import { useNavigate, useLocation } from "react-router-dom";
import logo from "../assets/images/logo.png";
import axios from "axios";
import ReceiptIcon from '@mui/icons-material/Receipt'
import FileCopyIcon from '@mui/icons-material/FileCopy';;

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation(); // Get current route
  const [anchorEl, setAnchorEl] = useState(null);
  const [anchorElResources, setAnchorElResources] = useState(null);
  const [openModal, setOpenModal] = useState(false); // State for modal open/close
  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    company: "",
    phone: "",
    email: "",
    province: "Saskatchewan",
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

  // Handle Resources menu open/close
  const handleResourceMenuOpen = (event) => setAnchorElResources(event.currentTarget);
  const handleResourceMenuClose = () => setAnchorElResources(null);

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
      .post("https://biomedwaste.net/quote/add", formData)
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
        position="sticky"
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
            {/* Buttons */}
            <Button
              onClick={() => navigate("/services")}
              sx={{
                color: isActive("/services") ? "#C9CC3F" : "#003366",
                fontWeight: isActive("/services") ? "bold" : "bold",
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
            <Button
              onClick={() => navigate("/instruction")}
              sx={{
                color: isActive("/instruction") ? "#C9CC3F" : "#003366",
                fontWeight: isActive("/instruction") ? "bold" : "bold",
                textTransform: "none",
                fontSize: "16px",
                borderBottom: isActive("/instruction") ? "2px solid #C9CC3F" : "none",
                "&:hover": {
                  color: "#ffffff",
                  backgroundColor: "#C9CC3F",
                  borderRadius: "8px",
                },
              }}
            >
              Waste Packaging Guide
            </Button>
            {/* Resources Tab */}
            <Button
              onClick={handleResourceMenuOpen}
              sx={{
                color: isActive("/waybill") || isActive("/invoice") || isActive("/cod") ? "#C9CC3F" : "#003366",
                fontWeight: (isActive("/waybill") || isActive("/invoice") || isActive("/cod")) ? "bold" : "bold",
                textTransform: "none",
                fontSize: "16px",
                borderBottom: (isActive("/waybill") || isActive("/invoice") || isActive("/cod")) ? "2px solid #C9CC3F" : "none",
                "&:hover": {
                  color: "#ffffff",
                  backgroundColor: "#C9CC3F",
                  borderRadius: "8px",
                },
              }}
            >
              Resources
            </Button>

            <Menu
              anchorEl={anchorElResources}
              open={Boolean(anchorElResources)}
              onClose={handleResourceMenuClose}
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
                onClick={() => { navigate("/waybill"); handleResourceMenuClose(); }}
                sx={{
                  display: "flex", gap: 1,
                  backgroundColor: isActive("/waybill") ? "#C9CC3F" : "transparent",
                  color: isActive("/waybill") ? "#ffffff" : "inherit",
                  "&:hover": {
                    backgroundColor: isActive("/waybill") ? "#C9CC3F" : "#f0f0f0",
                  }
                }}
              >
                <ReceiptIcon fontSize="small" />
                <Typography variant="inherit">Waybill</Typography>
              </MenuItem>

              <MenuItem
                onClick={() => { navigate("/invoice"); handleResourceMenuClose(); }}
                sx={{
                  display: "flex", gap: 1,
                  backgroundColor: isActive("/invoice") ? "#C9CC3F" : "transparent",
                  color: isActive("/invoice") ? "#ffffff" : "inherit",
                  "&:hover": {
                    backgroundColor: isActive("/invoice") ? "#C9CC3F" : "#f0f0f0",
                  }
                }}
              >
                <FileCopyIcon fontSize="small" />
                <Typography variant="inherit">Invoices</Typography>
              </MenuItem>

              <Divider />

              <MenuItem
                onClick={() => { navigate("/cod"); handleResourceMenuClose(); }}
                sx={{
                  display: "flex", gap: 1,
                  backgroundColor: isActive("/cod") ? "#C9CC3F" : "transparent",
                  color: isActive("/cod") ? "#ffffff" : "inherit",
                  "&:hover": {
                    backgroundColor: isActive("/cod") ? "#C9CC3F" : "#f0f0f0",
                  }
                }}
              >
                <FileCopyIcon fontSize="small" />
                <Typography variant="inherit">Certificate of Destruction</Typography>
              </MenuItem>
            </Menu>

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
                    .post("https://biomedwaste.net/logout", {}, { withCredentials: true }) // Ensure credentials are included
                    .then(() => {
                      sessionStorage.clear(); // Clear sessionStorage if used
                      localStorage.clear(); // Clear localStorage if used
                      navigate("/"); // Redirect to login/home
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
      <Dialog
        open={openModal}
        onClose={handleModalClose}
        fullWidth
        maxWidth="sm"
        sx={{
          "& .MuiPaper-root": {
            borderRadius: "12px",
            boxShadow: "0 8px 16px rgba(0, 0, 0, 0.2)",
            padding: "16px",
          },
        }}
      >
        <DialogTitle
          sx={{
            fontSize: "1.5rem",
            fontWeight: "bold",
            color: "#003366",
            textAlign: "center",
            borderBottom: "1px solid #f0f0f0",
            marginBottom: "16px",
          }}
        >
          Request Free Quote
        </DialogTitle>
        <DialogContent>
          <Box
            component="form"
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: "16px",
              paddingX: "8px",
            }}
          >
            <TextField
              label="First Name"
              name="firstname"
              value={formData.firstname}
              onChange={handleChange}
              fullWidth
              variant="outlined"
            />
            <TextField
              label="Last Name"
              name="lastname"
              value={formData.lastname}
              onChange={handleChange}
              fullWidth
              variant="outlined"
            />
            <TextField
              label="Company"
              name="company"
              value={formData.company}
              onChange={handleChange}
              fullWidth
              variant="outlined"
            />
            <TextField
              label="Phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              fullWidth
              variant="outlined"
            />
            <TextField
              label="Email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              fullWidth
              variant="outlined"
            />
            <FormControl fullWidth>
              <InputLabel>Province</InputLabel>
              <Select
                name="province"
                value={formData.province}
                onChange={handleChange}
                variant="outlined"
              >
                <DropdownItem value="Alberta">Alberta</DropdownItem>
                <DropdownItem value="British Columbia">British Columbia</DropdownItem>
                <DropdownItem value="Manitoba">Manitoba</DropdownItem>
                <DropdownItem value="New Brunswick">New Brunswick</DropdownItem>
                <DropdownItem value="Newfoundland and Labrador">Newfoundland and Labrador</DropdownItem>
                <DropdownItem value="Nova Scotia">Nova Scotia</DropdownItem>
                <DropdownItem value="Ontario">Ontario</DropdownItem>
                <DropdownItem value="Prince Edward Island">Prince Edward Island</DropdownItem>
                <DropdownItem value="Quebec">Quebec</DropdownItem>
                <DropdownItem value="Saskatchewan">Saskatchewan</DropdownItem>
                <DropdownItem value="Northwest Territories">Northwest Territories</DropdownItem>
                <DropdownItem value="Nunavut">Nunavut</DropdownItem>
                <DropdownItem value="Yukon">Yukon</DropdownItem>
              </Select>
            </FormControl>
            <TextField
              label="Postal Code"
              name="postalCode"
              value={formData.postalCode}
              onChange={handleChange}
              fullWidth
              variant="outlined"
            />
            <TextField
              label="Tell us about your service needs"
              name="description"
              value={formData.description}
              onChange={handleChange}
              fullWidth
              multiline
              rows={4}
              variant="outlined"
            />
          </Box>
        </DialogContent>
        <DialogActions
          sx={{
            display: "flex",
            justifyContent: "space-between",
            padding: "16px",
            borderTop: "1px solid #f0f0f0",
          }}
        >
          <Button
            onClick={handleModalClose}
            variant="outlined"
            sx={{
              borderColor: "#C9CC3F",
              color: "#003366",
              textTransform: "none",
              "&:hover": {
                backgroundColor: "#F3F4F6",
                borderColor: "#A9AC2B",
              },
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            sx={{
              backgroundColor: "#C9CC3F",
              color: "#ffffff",
              textTransform: "none",
              "&:hover": {
                backgroundColor: "#A9AC2B",
              },
            }}
          >
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
