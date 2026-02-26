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
  padding: theme.spacing(4),
  gap: theme.spacing(2),
  backgroundColor: '#ffffff',
  borderRadius: '12px',
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
  border: 'none',
  [theme.breakpoints.up('sm')]: {
    width: '420px',
  },
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    backgroundColor: '#f8f9fa',
    borderRadius: '8px',
    '& fieldset': {
      borderColor: '#e0e0e0',
    },
    '&:hover fieldset': {
      borderColor: '#D4A018',
    },
    '&.Mui-focused fieldset': {
      borderColor: '#D4A018',
    },
  },
  '& .MuiInputBase-input': {
    padding: '14px 16px',
  },
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
  const API_BASE_URL = process.env.REACT_APP_API_URL || "https://biomedwaste.net/api";
  const navigate = useNavigate();

  const handleMicrosoftLogin = async () => {
    try {
      const loginResponse = await instance.loginPopup({ scopes: ["User.Read"] });
      if (!loginResponse?.account) {
        console.error("No account info from Microsoft login");
        return;
      }

      const responseObj = await axios.post(`${API_BASE_URL}/user/microsoft-signin`, loginResponse.account, {
        headers: { "Content-Type": "application/json" },
      });

      const user = responseObj.data.user;
      const userWithId = {
        ...user,
        id: user._id || user.id,
      };
      sessionStorage.setItem("userData", JSON.stringify(userWithId));

      try {
        const location = await getUserLocation();
        await axios.post(`${API_BASE_URL}/user/location`, {
          userId: userWithId.id,
          userEmail: userWithId.email,
          ...location,
        });
      } catch (locError) {
        console.warn('Could not fetch user location:', locError.message);
      }
      
      navigate("/home");
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

      try {
        const location = await getUserLocation();
        await axios.post(`${API_BASE_URL}/user/location`, {
          userId: response.data.id,
          userEmail: response.data.email,
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
    <Card variant="outlined">

      <Typography
        component="h1"
        variant="h5"
        sx={{
          width: '100%',
          fontSize: '1.75rem',
          fontWeight: 600,
          textAlign: 'center',
          color: '#1a2744',
          mb: 1,
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
          <FormLabel
            htmlFor="email"
            sx={{ mb: 0.5, color: '#333', fontWeight: 500, fontSize: '0.875rem' }}
          >
            Email
          </FormLabel>
          <StyledTextField
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
            size="small"
          />
        </FormControl>

        <FormControl>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
            <FormLabel
              htmlFor="password"
              sx={{ color: '#333', fontWeight: 500, fontSize: '0.875rem' }}
            >
              Password
            </FormLabel>
            <Typography
              component="button"
              type="button"
              onClick={handleClickOpen}
              sx={{
                background: 'none',
                border: 'none',
                color: '#0D2477',
                cursor: 'pointer',
                fontSize: '0.8rem',
                fontWeight: 500,
                '&:hover': { textDecoration: 'underline' },
              }}
            >
              Forgot your password?
            </Typography>
          </Box>

          <StyledTextField
            required
            fullWidth
            name="password"
            placeholder="••••••"
            type={showPassword ? 'text' : 'password'}
            id="password"
            autoComplete="current-password"
            variant="outlined"
            size="small"
            error={passwordError}
            helperText={passwordErrorMessage}
            value={password}
            onChange={handlePasswordChange}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={togglePasswordVisibility} edge="end" size="small">
                    {showPassword ? <Visibility fontSize="small" /> : <VisibilityOff fontSize="small" />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </FormControl>

        <FormControlLabel
          control={
            <Checkbox
              value="remember"
              sx={{
                color: '#ccc',
                '&.Mui-checked': { color: '#D4A018' },
              }}
            />
          }
          label={<Typography sx={{ fontSize: '0.875rem', color: '#666' }}>Remember me</Typography>}
        />

        <ForgotPassword open={open} handleClose={handleClose} />

        <Button
          type="submit"
          fullWidth
          variant="contained"
          onClick={validateInputs}
          sx={{
            mt: 1,
            py: 1.5,
            backgroundColor: '#D9DE38',
            color: '#1a2744',
            fontWeight: 600,
            fontSize: '1rem',
            textTransform: 'none',
            borderRadius: '8px',
            boxShadow: 'none',
            '&:hover': {
              backgroundColor: '#c5ca2f',
              boxShadow: '0 4px 12px rgba(217, 222, 56, 0.3)',
            },
          }}
        >
          Sign In
        </Button>

        <Typography sx={{ textAlign: 'center', fontSize: '0.875rem', color: '#666' }}>
          Don&apos;t have an account?{' '}
          <Link
            to="/sign-up"
            style={{
              color: '#0D2477',
              fontWeight: 600,
              textDecoration: 'none',
            }}
          >
            Sign Up
          </Link>
        </Typography>
      </Box>

      <Divider sx={{ my: 1, color: '#999', fontSize: '0.8rem' }}>or</Divider>

      <Button
        fullWidth
        variant="outlined"
        onClick={handleMicrosoftLogin}
        startIcon={
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg"
            alt="Microsoft Logo"
            width="18"
          />
        }
        sx={{
          textTransform: 'none',
          fontSize: '0.9rem',
          fontWeight: 500,
          color: '#333',
          borderColor: '#ddd',
          borderRadius: '8px',
          py: 1.2,
          '&:hover': {
            borderColor: '#D4A018',
            backgroundColor: 'rgba(212, 160, 24, 0.05)',
          },
        }}
      >
        Sign in with Microsoft
      </Button>
    </Card>
  );
}
