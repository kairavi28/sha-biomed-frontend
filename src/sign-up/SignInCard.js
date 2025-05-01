import React, { useState } from 'react';
import axios from 'axios';
import {
  FormControl,
  Button,
  FormControlLabel,
  FormLabel,
  TextField,
  IconButton,
  InputAdornment,
  Box,
  Card as MuiCard,
  Checkbox,
  Divider,
  Typography,
} from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import ForgotPassword from './ForgotPassword';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import logo from '../assets/images/logo.png';
import { useMsal } from "@azure/msal-react";

const Card = styled(MuiCard)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignSelf: 'center',
  width: '100%',
  padding: theme.spacing(3),
  margin: theme.spacing(2),
  gap: theme.spacing(2),
  boxShadow:
    'hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px',
  [theme.breakpoints.up('sm')]: {
    width: '450px',
    margin: 'auto',
  },
  ...theme.applyStyles?.('dark', {
    boxShadow:
      'hsla(220, 30%, 5%, 0.5) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.08) 0px 15px 35px -5px',
  }),
}));

export default function SignInCard() {
  const [emailError, setEmailError] = useState(false);
  const [emailErrorMessage, setEmailErrorMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [password, setPassword] = useState('');
  const [passwordErrorMessage, setPasswordErrorMessage] = useState('');
  const [open, setOpen] = useState(false);
  const { instance } = useMsal();
  const API_BASE_URL = process.env.REACT_APP_API_URL;
  const navigate = useNavigate();

  const handleMicrosoftLogin = async () => {
    try {
      const loginResponse = await instance.loginPopup({ scopes: ["User.Read"] });
      const responseObj = await axios.post(`${API_BASE_URL}/user/microsoft-signin`, loginResponse.account, {
        headers: { "Content-Type": "application/json" },
      });
      sessionStorage.setItem("userData", JSON.stringify(responseObj.data.user));
      if (responseObj) {
        window.location.href = "/home";
      } else {
        alert("Error while logging in");
      }
    } catch (error) {
      console.error("Login Failed:", error);
    }
  };

  const handleClickOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const handlePasswordChange = (e) => setPassword(e.target.value);
  const togglePasswordVisibility = () => setShowPassword((prev) => !prev);

  const validateInputs = () => {
    const email = document.getElementById('email');
    const password = document.getElementById('password');
    let isValid = true;

    if (!email.value || !/\S+@\S+\.\S+/.test(email.value)) {
      setEmailError(true);
      setEmailErrorMessage('Please enter a valid email address.');
      isValid = false;
    } else {
      setEmailError(false);
      setEmailErrorMessage('');
    }

    if (!password.value || password.value.length < 6) {
      setPasswordError(true);
      setPasswordErrorMessage('Password must be at least 6 characters long.');
      isValid = false;
    } else {
      setPasswordError(false);
      setPasswordErrorMessage('');
    }

    return isValid;
  };

  const getUserLocation = () => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        return reject(new Error('Geolocation is not supported'));
      }
      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        (error) => {
          reject(error);
        }
      );
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (emailError || passwordError) return;
  
    const data = new FormData(event.currentTarget);
    const formData = {
      email: data.get('email'),
      password: data.get('password'),
    };
  
    try {
      const response = await axios.post(`${API_BASE_URL}/user/login`, JSON.stringify(formData), {
        headers: { 'Content-Type': 'application/json' },
      });
  
      sessionStorage.setItem('userData', JSON.stringify(response.data));
  
      // Try to get location and store it
      try {
        const location = await getUserLocation();
        await axios.post(`${API_BASE_URL}/user/location`, {
          userId: response.data.id, // make sure to send ID or auth token
          ...location,
        });
      } catch (locError) {
        console.warn('Could not fetch user location:', locError.message);
      }
  
      navigate('/home');
    } catch (error) {
      const { status, data } = error.response || {};
      if (status === 400) alert("Invalid Password or Email");
      else if (status === 401) alert("Unauthorized access.");
      else alert(data?.message || "An error occurred. Try again.");
    }
  };

  return (
    <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center', px: 2 }}>
      <Card variant="outlined">
        <Box sx={{ display: { xs: 'flex', md: 'none' }, justifyContent: 'center' }}>
          <img
            src={logo}
            alt="Logo"
            style={{ maxWidth: '100%', height: 'auto', marginBottom: '16px' }}
          />
        </Box>

        <Typography
          component="h1"
          variant="h5"
          sx={{
            width: '100%',
            fontSize: 'clamp(1.5rem, 6vw, 2rem)',
            textAlign: 'center',
          }}
        >
          Sign In
        </Typography>

        <Box
          component="form"
          onSubmit={handleSubmit}
          noValidate
          sx={{ display: 'flex', flexDirection: 'column', width: '100%', gap: 2 }}
        >
          <FormControl>
            <FormLabel htmlFor="email">Email</FormLabel>
            <TextField
              error={emailError}
              helperText={emailErrorMessage}
              id="email"
              type="email"
              name="email"
              placeholder="your@email.com"
              autoComplete="email"
              required
              fullWidth
              variant="outlined"
              color={emailError ? 'error' : 'primary'}
            />
          </FormControl>

          <FormControl>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <FormLabel htmlFor="password">Password</FormLabel>
              <Link component="button" type="button" onClick={handleClickOpen} variant="body2">
                Forgot your password?
              </Link>
            </Box>

            <TextField
              required
              fullWidth
              name="password"
              placeholder="••••••"
              type={showPassword ? 'text' : 'password'}
              id="password"
              autoComplete="current-password"
              variant="outlined"
              error={passwordError}
              helperText={passwordErrorMessage}
              color={passwordError ? 'error' : 'primary'}
              value={password}
              onChange={handlePasswordChange}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={togglePasswordVisibility} edge="end">
                      {showPassword ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </FormControl>

          <FormControlLabel
            control={<Checkbox value="remember" color="primary" />}
            label="Remember me"
          />

          <ForgotPassword open={open} handleClose={handleClose} />

          <Button type="submit" fullWidth variant="contained" onClick={validateInputs} sx={{ mt: 2 }}>
            Sign in
          </Button>

          <Typography sx={{ textAlign: 'center' }}>
            Don&apos;t have an account?{' '}
            <Link to="/sign-up" variant="body2">
              Sign up
            </Link>
          </Typography>
        </Box>

        <Divider>or</Divider>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Button
            fullWidth
            variant="outlined"
            onClick={handleMicrosoftLogin}
            startIcon={
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg"
                alt="Microsoft Logo"
                width="20"
              />
            }
            sx={{
              textTransform: 'none',
              fontSize: '16px',
              fontWeight: 'bold',
              color: '#333',
              borderColor: '#999',
              '&:hover': {
                borderColor: '#0078D4',
                backgroundColor: 'rgba(0, 120, 212, 0.1)',
              },
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              gap: 1,
              padding: '10px',
            }}
          >
            Sign in with Microsoft
          </Button>
        </Box>
      </Card>
    </Box>
  );
}
