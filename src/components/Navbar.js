import React, { useEffect, useState } from "react";
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
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Collapse,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { AccountCircle, Logout, Person, Search, ShoppingCart, Phone, Email, KeyboardArrowDown, Menu as MenuIcon, Close, ExpandLess, ExpandMore } from "@mui/icons-material";
import CloseIcon from '@mui/icons-material/Close';
import { useNavigate, useLocation } from "react-router-dom";
import logo from "../assets/images/logo.png";
import axios from "axios";
import ReceiptIcon from '@mui/icons-material/Receipt';
import FileCopyIcon from '@mui/icons-material/FileCopy';

const Navbar = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const API_BASE_URL = process.env.REACT_APP_API_URL || "https://biomedwaste.net/api";
  const location = useLocation();
  const [anchorEl, setAnchorEl] = useState(null);
  const [open, setOpen] = useState(false);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [resourcesExpanded, setResourcesExpanded] = useState(false);
  const composeUrl = "https://outlook.office.com/mail/deeplink/compose?to=support@biomedwaste.com";
  const [anchorElResources, setAnchorElResources] = useState(null);
  const [openModal, setOpenModal] = useState(false);
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
    severity: "success",
  });

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const handleOpenOutlook = () => {
    window.open(composeUrl, "_blank", "noopener,noreferrer");
    handleClose();
  };

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleResourceMenuOpen = (event) => setAnchorElResources(event.currentTarget);
  const handleResourceMenuClose = () => setAnchorElResources(null);

  const handleModalOpen = () => setOpenModal(true);
  const handleModalClose = () => setOpenModal(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  useEffect(() => {
    const navbar = document.getElementById("navbar");
    const handleScroll = () => {
      if (window.scrollY > 100) {
        navbar.classList.add("scrolled");
      } else {
        navbar.classList.remove("scrolled");
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSubmit = () => {
    axios
      .post(`${API_BASE_URL}/quote/add`, formData)
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

  const isActive = (path) => location.pathname === path;

  const handleMobileDrawerToggle = () => {
    setMobileDrawerOpen(!mobileDrawerOpen);
  };

  const handleMobileNavClick = (path) => {
    navigate(path);
    setMobileDrawerOpen(false);
  };

  const handleResourcesToggle = () => {
    setResourcesExpanded(!resourcesExpanded);
  };

  // Mobile Drawer Content
  const mobileDrawer = (
    <Box sx={{ width: 280 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", p: 2, borderBottom: "1px solid #e5e7eb" }}>
        <img src={logo} alt="Biomed Logo" style={{ height: "55px", width: "auto" }} />
        <IconButton onClick={handleMobileDrawerToggle}>
          <Close />
        </IconButton>
      </Box>
      <List sx={{ pt: 2 }}>
        <ListItem disablePadding>
          <ListItemButton
            onClick={() => handleMobileNavClick("/services")}
            sx={{
              py: 1.5,
              backgroundColor: isActive("/services") ? "rgba(217, 222, 56, 0.15)" : "transparent",
            }}
          >
            <ListItemText
              primary="Complaint Services"
              sx={{ "& .MuiTypography-root": { color: isActive("/services") ? "#D9DE38" : "#1a2744", fontWeight: 500 } }}
            />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton
            onClick={() => handleMobileNavClick("/instruction")}
            sx={{
              py: 1.5,
              backgroundColor: isActive("/instruction") ? "rgba(217, 222, 56, 0.15)" : "transparent",
            }}
          >
            <ListItemText
              primary="Waste Packaging Guide"
              sx={{ "& .MuiTypography-root": { color: isActive("/instruction") ? "#D9DE38" : "#1a2744", fontWeight: 500 } }}
            />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton onClick={handleResourcesToggle} sx={{ py: 1.5 }}>
            <ListItemText primary="Resources" sx={{ "& .MuiTypography-root": { color: "#1a2744", fontWeight: 500 } }} />
            {resourcesExpanded ? <ExpandLess /> : <ExpandMore />}
          </ListItemButton>
        </ListItem>
        <Collapse in={resourcesExpanded} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            <ListItemButton
              sx={{ pl: 4, py: 1.5, backgroundColor: isActive("/waybill") ? "rgba(217, 222, 56, 0.15)" : "transparent" }}
              onClick={() => handleMobileNavClick("/waybill")}
            >
              <ListItemIcon sx={{ minWidth: 36 }}><ReceiptIcon fontSize="small" /></ListItemIcon>
              <ListItemText primary="Waybill" sx={{ "& .MuiTypography-root": { fontSize: "14px" } }} />
            </ListItemButton>
            <ListItemButton
              sx={{ pl: 4, py: 1.5, backgroundColor: isActive("/invoice") ? "rgba(217, 222, 56, 0.15)" : "transparent" }}
              onClick={() => handleMobileNavClick("/invoice")}
            >
              <ListItemIcon sx={{ minWidth: 36 }}><FileCopyIcon fontSize="small" /></ListItemIcon>
              <ListItemText primary="Invoices" sx={{ "& .MuiTypography-root": { fontSize: "14px" } }} />
            </ListItemButton>
            <ListItemButton
              sx={{ pl: 4, py: 1.5, backgroundColor: isActive("/request-products") ? "rgba(217, 222, 56, 0.15)" : "transparent" }}
              onClick={() => handleMobileNavClick("/request-products")}
            >
              <ListItemIcon sx={{ minWidth: 36 }}><FileCopyIcon fontSize="small" /></ListItemIcon>
              <ListItemText primary="Request Product / Service" sx={{ "& .MuiTypography-root": { fontSize: "14px" } }} />
            </ListItemButton>
            <ListItemButton
              sx={{ pl: 4, py: 1.5, backgroundColor: isActive("/cod") ? "rgba(217, 222, 56, 0.15)" : "transparent" }}
              onClick={() => handleMobileNavClick("/cod")}
            >
              <ListItemIcon sx={{ minWidth: 36 }}><FileCopyIcon fontSize="small" /></ListItemIcon>
              <ListItemText primary="Certificate of Destruction" sx={{ "& .MuiTypography-root": { fontSize: "14px" } }} />
            </ListItemButton>
          </List>
        </Collapse>
        <Divider sx={{ my: 2 }} />
        <ListItem disablePadding>
          <ListItemButton
            onClick={() => handleMobileNavClick("/profile")}
            sx={{ py: 1.5 }}
          >
            <ListItemIcon sx={{ minWidth: 36 }}><Person /></ListItemIcon>
            <ListItemText primary="Profile" sx={{ "& .MuiTypography-root": { fontWeight: 500 } }} />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton
            onClick={() => {
              sessionStorage.clear();
              localStorage.clear();
              navigate("/");
              setMobileDrawerOpen(false);
            }}
            sx={{ py: 1.5 }}
          >
            <ListItemIcon sx={{ minWidth: 36 }}><Logout /></ListItemIcon>
            <ListItemText primary="Logout" sx={{ "& .MuiTypography-root": { fontWeight: 500 } }} />
          </ListItemButton>
        </ListItem>
      </List>
      <Box sx={{ p: 2 }}>
        <Button
          onClick={() => { handleModalOpen(); setMobileDrawerOpen(false); }}
          variant="contained"
          fullWidth
          sx={{
            backgroundColor: "#D9DE38",
            color: "#1a2744",
            fontWeight: 600,
            textTransform: "none",
            borderRadius: "24px",
            py: 1.5,
            "&:hover": {
              backgroundColor: "#c5ca32",
            },
          }}
        >
          Request Free Quote
        </Button>
      </Box>
      <Box sx={{ p: 2, pt: 0 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
          <Phone sx={{ fontSize: 16, color: "#1a2744" }} />
          <Typography variant="body2" sx={{ color: "#1a2744", fontWeight: 500 }}>+1-866-288-3298</Typography>
        </Box>
        <Box
          onClick={() => { handleOpen(); setMobileDrawerOpen(false); }}
          sx={{ display: "flex", alignItems: "center", gap: 1, cursor: "pointer" }}
        >
          <Email sx={{ fontSize: 16, color: "#1a2744" }} />
          <Typography variant="body2" sx={{ color: "#1a2744", fontWeight: 500 }}>support@biomedwaste.com</Typography>
        </Box>
      </Box>
    </Box>
  );

  return (
    <>
      <AppBar
        position="fixed"
        sx={{
          top: 0,
          width: '100%',
          backgroundColor: "#ffffff",
          color: "#1a2744",
          boxShadow: "0 2px 4px rgba(0,0,0,0.08)",
          transition: "all 0.3s ease-in-out",
        }}
        id="navbar"
      >
        {/* Top Contact Bar - Hidden on Mobile */}
        <Box
          sx={{
            backgroundColor: "#ffffff",
            borderBottom: "1px solid #e5e7eb",
            py: 1,
            px: { xs: 2, md: 4 },
            display: { xs: "none", md: "block" },
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              alignItems: "center",
              gap: 3,
              maxWidth: "1200px",
              mx: "auto",
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 0.5,
                color: "#1a2744",
              }}
            >
              <Phone sx={{ fontSize: 16, color: "#1a2744" }} />
              <Typography
                variant="body2"
                sx={{
                  color: "#1a2744",
                  fontWeight: 500,
                  fontSize: "14px",
                }}
              >
                +1-866-288-3298
              </Typography>
            </Box>
            <Box
              onClick={handleOpen}
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 0.5,
                color: "#1a2744",
                cursor: "pointer",
                "&:hover": {
                  color: "#D9DE38",
                },
              }}
            >
              <Email sx={{ fontSize: 16 }} />
              <Typography
                variant="body2"
                sx={{
                  fontWeight: 500,
                  fontSize: "14px",
                }}
              >
                support@biomedwaste.com
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* Main Navbar */}
        <Toolbar
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            px: { xs: 2, md: 4 },
            py: 1,
            maxWidth: "1200px",
            mx: "auto",
            width: "100%",
          }}
        >
          {/* Mobile Hamburger Menu */}
          <IconButton
            onClick={handleMobileDrawerToggle}
            aria-label="Open navigation menu"
            sx={{
              display: { xs: "flex", md: "none" },
              color: "#1a2744",
            }}
          >
            <MenuIcon />
          </IconButton>

          {/* Logo */}
          <Box
            component="div"
            sx={{ cursor: "pointer", display: "flex", alignItems: "center" }}
            onClick={() => navigate("/home")}
          >
            <Box
              component="img"
              src={logo}
              alt="Biomed Logo"
              sx={{ height: { xs: "55px", md: "75px" }, width: "auto" }}
            />
          </Box>

          {/* Navigation Links - Desktop Only */}
          <Box sx={{ display: { xs: "none", md: "flex" }, alignItems: "center", gap: 1 }}>
            <Button
              onClick={() => navigate("/services")}
              sx={{
                color: isActive("/services") ? "#D9DE38" : "#1a2744",
                fontWeight: 500,
                textTransform: "none",
                fontSize: "15px",
                px: 2,
                "&:hover": {
                  backgroundColor: "transparent",
                  color: "#D9DE38",
                },
              }}
            >
              Complaint Services
            </Button>
            <Button
              onClick={() => navigate("/instruction")}
              sx={{
                color: isActive("/instruction") ? "#D9DE38" : "#1a2744",
                fontWeight: 500,
                textTransform: "none",
                fontSize: "15px",
                px: 2,
                "&:hover": {
                  backgroundColor: "transparent",
                  color: "#D9DE38",
                },
              }}
            >
              Waste Packaging Guide
            </Button>
            <Button
              onClick={handleResourceMenuOpen}
              endIcon={<KeyboardArrowDown />}
              sx={{
                color: isActive("/waybill") || isActive("/invoice") || isActive("/cod") ? "#D9DE38" : "#1a2744",
                fontWeight: 500,
                textTransform: "none",
                fontSize: "15px",
                px: 2,
                "&:hover": {
                  backgroundColor: "transparent",
                  color: "#D9DE38",
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
                mt: "8px",
                "& .MuiPaper-root": {
                  borderRadius: "8px",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                  minWidth: "200px",
                },
              }}
            >
              <MenuItem
                onClick={() => { navigate("/waybill"); handleResourceMenuClose(); }}
                sx={{
                  display: "flex",
                  gap: 1,
                  py: 1.5,
                  backgroundColor: isActive("/waybill") ? "#D9DE38" : "transparent",
                  color: isActive("/waybill") ? "#1a2744" : "inherit",
                  "&:hover": {
                    backgroundColor: isActive("/waybill") ? "#D9DE38" : "#f5f5f5",
                  }
                }}
              >
                <ReceiptIcon fontSize="small" />
                <Typography variant="inherit">Waybill</Typography>
              </MenuItem>
              <MenuItem
                onClick={() => { navigate("/invoice"); handleResourceMenuClose(); }}
                sx={{
                  display: "flex",
                  gap: 1,
                  py: 1.5,
                  backgroundColor: isActive("/invoice") ? "#D9DE38" : "transparent",
                  color: isActive("/invoice") ? "#1a2744" : "inherit",
                  "&:hover": {
                    backgroundColor: isActive("/invoice") ? "#D9DE38" : "#f5f5f5",
                  }
                }}
              >
                <FileCopyIcon fontSize="small" />
                <Typography variant="inherit">Invoices</Typography>
              </MenuItem>
              <MenuItem
                onClick={() => { navigate("/request-products"); handleResourceMenuClose(); }}
                sx={{
                  display: "flex",
                  gap: 1,
                  py: 1.5,
                  backgroundColor: isActive("/request-products") ? "#D9DE38" : "transparent",
                  color: isActive("/request-products") ? "#1a2744" : "inherit",
                  "&:hover": {
                    backgroundColor: isActive("/request-products") ? "#D9DE38" : "#f5f5f5",
                  }
                }}
              >
                <FileCopyIcon fontSize="small" />
                <Typography variant="inherit">Request Product / Service</Typography>
              </MenuItem>
              <Divider />
              <MenuItem
                onClick={() => { navigate("/cod"); handleResourceMenuClose(); }}
                sx={{
                  display: "flex",
                  gap: 1,
                  py: 1.5,
                  backgroundColor: isActive("/cod") ? "#D9DE38" : "transparent",
                  color: isActive("/cod") ? "#1a2744" : "inherit",
                  "&:hover": {
                    backgroundColor: isActive("/cod") ? "#D9DE38" : "#f5f5f5",
                  }
                }}
              >
                <FileCopyIcon fontSize="small" />
                <Typography variant="inherit">Certificate of Destruction</Typography>
              </MenuItem>
            </Menu>
          </Box>

          {/* Right Side: Quote Button, Search, Cart, Profile */}
          <Box sx={{ display: "flex", alignItems: "center", gap: { xs: 0.5, md: 1 } }}>
            {/* Desktop Only - Quote Button */}
            <Button
              onClick={handleModalOpen}
              variant="contained"
              sx={{
                display: { xs: "none", md: "flex" },
                backgroundColor: "#D9DE38",
                color: "#1a2744",
                fontWeight: 600,
                textTransform: "none",
                borderRadius: "24px",
                px: 3,
                py: 1,
                "&:hover": {
                  backgroundColor: "#c5ca32",
                },
              }}
            >
              Request Free Quote
            </Button>
            {/* Desktop Only - Search */}
            <IconButton
              sx={{
                display: { xs: "none", md: "flex" },
                color: "#1a2744",
                "&:hover": {
                  color: "#D9DE38",
                },
              }}
            >
              <Search />
            </IconButton>
            {/* Mobile & Desktop - Cart */}
            <IconButton
              sx={{
                color: "#1a2744",
                "&:hover": {
                  color: "#D9DE38",
                },
              }}
            >
              <ShoppingCart />
            </IconButton>
            {/* Desktop Only - Profile */}
            <IconButton
              onClick={handleMenuOpen}
              sx={{
                display: { xs: "none", md: "flex" },
                color: "#1a2744",
                "&:hover": {
                  color: "#D9DE38",
                },
              }}
            >
              <AccountCircle />
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
              sx={{
                mt: "8px",
                "& .MuiPaper-root": {
                  borderRadius: "8px",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                  minWidth: "160px",
                },
              }}
            >
              <MenuItem
                onClick={() => {
                  handleMenuClose();
                  navigate("/profile");
                }}
                sx={{ display: "flex", gap: 1, py: 1.5 }}
              >
                <Person fontSize="small" />
                <Typography variant="inherit">Profile</Typography>
              </MenuItem>
              <Divider />
              <MenuItem
                onClick={async () => {
                  handleMenuClose();
                  try {
                    sessionStorage.clear();
                    localStorage.clear();
                    navigate("/");
                  } catch (err) {
                    console.error("Logout failed:", err);
                    alert("There was an error logging out.");
                  }
                }}
                sx={{ display: "flex", gap: 1, py: 1.5 }}
              >
                <Logout fontSize="small" />
                <Typography variant="inherit">Logout</Typography>
              </MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Mobile Drawer */}
      <Drawer
        anchor="left"
        open={mobileDrawerOpen}
        onClose={handleMobileDrawerToggle}
        sx={{
          display: { xs: "block", md: "none" },
          "& .MuiDrawer-paper": {
            boxSizing: "border-box",
            width: 280,
          },
        }}
      >
        {mobileDrawer}
      </Drawer>

      {/* Email Dialog */}
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          Send an Email
          <IconButton onClick={handleClose}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          <Typography gutterBottom>
            You're about to send an email to <strong>support@biomedwaste.com</strong>.
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Click the button below to open Outlook Web and compose your message.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleOpenOutlook} variant="contained" sx={{ backgroundColor: "#D9DE38", color: "#1a2744", "&:hover": { backgroundColor: "#c5ca32" } }}>
            Open Outlook
          </Button>
          <Button onClick={handleClose} variant="outlined" sx={{ borderColor: "#1a2744", color: "#1a2744" }}>
            Cancel
          </Button>
        </DialogActions>
      </Dialog>

      {/* Quote Request Modal */}
      <Dialog
        open={openModal}
        onClose={handleModalClose}
        fullWidth
        maxWidth="sm"
        sx={{
          "& .MuiPaper-root": {
            borderRadius: "12px",
            boxShadow: "0 8px 24px rgba(0, 0, 0, 0.15)",
            padding: "16px",
          },
        }}
      >
        <DialogTitle
          sx={{
            fontSize: "1.5rem",
            fontWeight: "bold",
            color: "#1a2744",
            textAlign: "center",
            borderBottom: "1px solid #e5e7eb",
            mb: 2,
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
              pt: 1,
            }}
          >
            <TextField label="First Name" name="firstname" value={formData.firstname} onChange={handleChange} fullWidth variant="outlined" />
            <TextField label="Last Name" name="lastname" value={formData.lastname} onChange={handleChange} fullWidth variant="outlined" />
            <TextField label="Company" name="company" value={formData.company} onChange={handleChange} fullWidth variant="outlined" />
            <TextField label="Phone" name="phone" value={formData.phone} onChange={handleChange} fullWidth variant="outlined" />
            <TextField label="Email" name="email" value={formData.email} onChange={handleChange} fullWidth variant="outlined" />
            <FormControl fullWidth>
              <InputLabel>Province</InputLabel>
              <Select name="province" value={formData.province} onChange={handleChange} variant="outlined" label="Province">
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
            <TextField label="Postal Code" name="postalCode" value={formData.postalCode} onChange={handleChange} fullWidth variant="outlined" />
            <TextField label="Tell us about your service needs" name="description" value={formData.description} onChange={handleChange} fullWidth multiline rows={4} variant="outlined" />
          </Box>
        </DialogContent>
        <DialogActions
          sx={{
            display: "flex",
            justifyContent: "space-between",
            padding: "16px",
            borderTop: "1px solid #e5e7eb",
          }}
        >
          <Button
            onClick={handleModalClose}
            variant="outlined"
            sx={{
              borderColor: "#1a2744",
              color: "#1a2744",
              textTransform: "none",
              "&:hover": {
                backgroundColor: "#f5f5f5",
                borderColor: "#1a2744",
              },
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            sx={{
              backgroundColor: "#D9DE38",
              color: "#1a2744",
              fontWeight: 600,
              textTransform: "none",
              "&:hover": {
                backgroundColor: "#c5ca32",
              },
            }}
          >
            Submit
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
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
