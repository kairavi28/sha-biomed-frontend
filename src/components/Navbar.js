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
  Container,
} from "@mui/material";
import { Settings, AccountCircle, Logout, Person } from "@mui/icons-material";
import { useNavigate, useLocation } from "react-router-dom";
import logo from "../assets/images/logo.png";
import axios from "axios";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation(); // Get current route
  const [anchorEl, setAnchorEl] = useState(null);

  // Handle menu open
  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  // Handle menu close
  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  // Helper function to check if the route is active
  const isActive = (path) => location.pathname === path;

  return (
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
          onClick={() => navigate("/quote")}
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
  );
};

export default Navbar;
