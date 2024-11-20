import React from "react";
import {
  AppBar,
  Toolbar,
  Button,
  Box,
  IconButton,
} from "@mui/material";
import { Settings } from "@mui/icons-material"; 
import { useNavigate } from "react-router-dom";
import logo from "../assets/images/logo.png";

const Navbar = () => {
  const navigate = useNavigate();

  return (
    <AppBar
      position="static"
      sx={{
        backgroundColor: "#ffffff",
        color: "#003366",
        boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
        padding: "10px 0",
      }}
    >
      <Toolbar sx={{ display: "flex", justifyContent: "space-between", paddingX: 2 }}>
        {/* Logo */}
        <Box component="div" sx={{ cursor: "pointer" }} onClick={() => navigate("/home")}>
          <img src={logo} alt="Logo" style={{ width: "120px", height: "auto" }} />
        </Box>

        {/* Menu Items */}
        <Box display="flex" alignItems="center" gap={4}>
          {/* Individual Menu Items without Dropdowns */}
          <Button
            onClick={() => navigate("/solutions")}
            sx={{
              color: "#003366",
              fontWeight: "bold",
              textTransform: "none",
              fontSize: "16px",
              "&:hover": {
                color: "#ffffff",
                backgroundColor: "#0066cc",
              },
            }}
          >
            Our Solutions
          </Button>
          {/* <Button
            onClick={() => navigate("/industries")}
            sx={{
              color: "#003366",
              fontWeight: "bold",
              textTransform: "none",
              fontSize: "16px",
              "&:hover": {
                color: "#ffffff",
                backgroundColor: "#0066cc",
              },
            }}
          >
            Industries We Serve
          </Button> */}
          <Button
            onClick={() => navigate("/services")}
            sx={{
              color: "#003366",
              fontWeight: "bold",
              textTransform: "none",
              fontSize: "16px",
              "&:hover": {
                color: "#ffffff",
                backgroundColor: "#0066cc",
              },
            }}
          >
            Complaint Services
          </Button>

          {/* Settings Icon */}
          <IconButton
            sx={{
              color: "#003366",
              "&:hover": {
                color: "#ffffff",
                backgroundColor: "#0066cc",
              },
            }}
            onClick={() => navigate("/settings")}
          >
            <Settings />
          </IconButton>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
