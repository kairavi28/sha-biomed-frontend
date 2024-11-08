import * as React from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Avatar,
  Tooltip,
  Box
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import logo from '../assets/images/logo.png';
import SettingsIcon from '@mui/icons-material/Settings';

const settings = ['Profile', 'Account', 'Dashboard', 'Logout'];

const Navbar = () => {
  const [anchorElUser, setAnchorElUser] = React.useState(null);
  const navigate = useNavigate(); 

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    handleCloseUserMenu();
    navigate('/');
  };

  return (
    <>
      <AppBar position="static" sx={{ backgroundColor: "white", color: "navy" }}>
        <Toolbar sx={{ minHeight: 45 }}>
          
          <Typography variant="h6" sx={{ flexGrow: 1, color: "navy" }}>
            <img src={logo} alt="Logo" style={{ width: '90px', height: 'auto' }} />
          </Typography>
          <Button color="inherit" component={Link} to="/home" sx={{ color: "navy" }}>
            Home
          </Button>
          <Button color="inherit" component={Link} to="/support" sx={{ color: "navy" }}>
            Support
          </Button>
          <Button color="inherit" component={Link} to="/settings" sx={{ color: "navy" }}>
            <SettingsIcon style={{ fontSize: 35 }}/>
          </Button>

          {/* Profile Section */}
          <Box sx={{ flexGrow: 0 }}>
            <Tooltip title="Open settings">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                <Avatar alt="User Profile" src="/static/images/avatar/2.jpg" />
              </IconButton>
            </Tooltip>
            <Menu
              sx={{ mt: '45px' }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              {settings.map((setting) => (
                <MenuItem key={setting} onClick={setting === 'Logout' ? handleLogout : handleCloseUserMenu}>
                  <Typography textAlign="center">{setting}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>
    </>
  );
};

export default Navbar;
