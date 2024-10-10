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
  Drawer,
  List,
  ListItem,
  ListItemText,
  Divider,
  Box
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import MenuIcon from "@mui/icons-material/Menu";
import logo from '../assets/images/logo.png';
import SettingsIcon from '@mui/icons-material/Settings';

const settings = ['Profile', 'Account', 'Dashboard', 'Logout'];
const pages = ['Home', 'Expenses', 'Stats'];

const Navbar = () => {
  const [anchorElUser, setAnchorElUser] = React.useState(null);
  const [drawerOpen, setDrawerOpen] = React.useState(false);
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

  const toggleDrawer = (open) => () => {
    setDrawerOpen(open);
  };

  const list = () => (
    <div
      role="presentation"
      onClick={toggleDrawer(false)}
      onKeyDown={toggleDrawer(false)}
      style={{ width: 250 }}
    >
      <Divider />
      <List>
        {pages.map((text) => (
          <ListItem button key={text} component={Link} to={`/${text.toLowerCase()}`}>
            <ListItemText primary={text} />
          </ListItem>
        ))}
      </List>
      <Divider />
      <List>
        {settings.map((setting) => (
          <ListItem
            button
            key={setting}
            onClick={setting === 'Logout' ? handleLogout : handleCloseUserMenu}
          >
            <ListItemText primary={setting} />
          </ListItem>
        ))}
      </List>
    </div>
  );

  return (
    <>
      <AppBar position="static" sx={{ backgroundColor: "white", color: "navy" }}>
        <Toolbar sx={{ minHeight: 45 }}>
          <IconButton edge="start" color="inherit" aria-label="menu" onClick={toggleDrawer(true)}>
            <MenuIcon sx={{ color: "navy" }} />
          </IconButton>
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

      {/* Drawer Component */}
      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={toggleDrawer(false)}
      >
        {list()}
      </Drawer>
    </>
  );
};

export default Navbar;
