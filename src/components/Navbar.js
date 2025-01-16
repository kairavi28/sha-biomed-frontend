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
  DialogTitle,
  DialogContent,
  TextField,
  Select,
  MenuItem as DropdownItem,
  InputLabel,
  FormControl,
  DialogActions,
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

  // Handle form submission
  const handleSubmit = () => {
    console.log("Form Data Submitted: ", formData);
    // Perform API call or other logic
    axios
      .post("http://localhost:5000/request-quote", formData)
      .then((res) => {
        alert("Quote request submitted successfully!");
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
        alert("Error submitting the request. Please try again.");
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
              onClick={() => navigate("/blogs")}
              sx={{
                color: isActive("/blogs") ? "#C9CC3F" : "#003366",
                fontWeight: isActive("/blogs") ? "bold" : "bold",
                textTransform: "none",
                fontSize: "16px",
                borderBottom: isActive("/blogs") ? "2px solid #C9CC3F" : "none",
                "&:hover": {
                  color: "#ffffff",
                  backgroundColor: "#C9CC3F",
                  borderRadius: "8px",
                },
              }}
            >
              Our Blog
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
          <TextField
            label="First Name"
            name="firstname"
            value={formData.firstname}
            onChange={handleChange}
            fullWidth
            margin="dense"
          />
          <TextField
            label="Last Name"
            name="lastname"
            value={formData.lastname}
            onChange={handleChange}
            fullWidth
            margin="dense"
          />
          <TextField
            label="Company"
            name="company"
            value={formData.company}
            onChange={handleChange}
            fullWidth
            margin="dense"
          />
          <TextField
            label="Phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            fullWidth
            margin="dense"
          />
          <TextField
            label="Email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            fullWidth
            margin="dense"
          />
          <FormControl fullWidth margin="dense">
            <InputLabel>Province</InputLabel>
            <Select
              name="province"
              value={formData.province}
              onChange={handleChange}
            >
              <DropdownItem value="Alberta">Alberta</DropdownItem>
              <DropdownItem value="British Columbia">British Columbia</DropdownItem>
              <DropdownItem value="Manitoba">Manitoba</DropdownItem>
              <DropdownItem value="New Brunswick">New Brunswick</DropdownItem>
              <DropdownItem value="Newfoundland and Labrador">New Foundland and Labrador</DropdownItem>
              <DropdownItem value="Nova Scotia">Nova Scotia</DropdownItem>
              <DropdownItem value="Ontario">Ontario</DropdownItem>
              <DropdownItem value="Prince Edward Island">Prince Edward Island</DropdownItem>
              <DropdownItem value="Quebec">Quebec</DropdownItem>
              <DropdownItem value="Saskatchewan">Saskatchewan</DropdownItem>
              <DropdownItem value="Northwest Territories">Northwest Territories</DropdownItem>
              <DropdownItem value="Nunavut">Nunavut</DropdownItem>
              <DropdownItem value="Yukon">Yukon</DropdownItem>

              {/* Add all Canadian provinces */}
            </Select>
          </FormControl>
          <TextField
            label="Postal Code"
            name="postalCode"
            value={formData.postalCode}
            onChange={handleChange}
            fullWidth
            margin="dense"
          />
          <TextField
            label="Tell us about your service needs"
            name="description"
            value={formData.description}
            onChange={handleChange}
            fullWidth
            margin="dense"
            multiline
            rows={4}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleModalClose} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleSubmit} color="primary" variant="contained">
            Submit Request
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Navbar;
