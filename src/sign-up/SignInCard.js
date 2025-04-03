import React, { useState } from 'react';
import axios from 'axios';
import { FormControl, Button, FormControlLabel, FormLabel, TextField, IconButton, InputAdornment } from '@mui/material';
import Box from '@mui/material/Box';
import MuiCard from '@mui/material/Card';
import Checkbox from '@mui/material/Checkbox';
import Divider from '@mui/material/Divider';
import { Link, useNavigate } from 'react-router-dom';
import Typography from '@mui/material/Typography';
import logo from '../assets/images/logo.png';
import { styled } from '@mui/material/styles';
import ForgotPassword from './ForgotPassword';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useMsal } from "@azure/msal-react";
import { InteractionType } from "@azure/msal-browser";

const Card = styled(MuiCard)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignSelf: 'center',
  width: '100%',
  padding: theme.spacing(4),
  gap: theme.spacing(2),
  boxShadow:
    'hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px',
  [theme.breakpoints.up('sm')]: {
    width: '450px',
  },
  ...theme.applyStyles('dark', {
    boxShadow:
      'hsla(220, 30%, 5%, 0.5) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.08) 0px 15px 35px -5px',
  }),
}));

export default function SignInCard() {
  const [emailError, setEmailError] = React.useState(false);
  const [emailErrorMessage, setEmailErrorMessage] = React.useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [passwordError, setPasswordError] = React.useState(false);
  const [password, setPassword] = useState('');
  const [passwordErrorMessage, setPasswordErrorMessage] = React.useState('');
  const [open, setOpen] = React.useState(false);
  const { instance } = useMsal();

  const handleMicrosoftLogin = async () => {
    try {
      const loginResponse = await instance.loginPopup({
        scopes: ["User.Read"], 
      });
      //store in db 
      const responseObj = await axios.post(`https://biomedwaste.net/user/microsoft-signin`, loginResponse.account, {
        headers: { "Content-Type": "application/json" },
      });
      sessionStorage.setItem("userData", JSON.stringify(responseObj.data.user));
      if(responseObj != null) {
        window.location.href = "/home"; 
      } else {
        alert("Error while logging in");
      }
      
    } catch (error) {
      console.error("Login Failed:", error);
    }
  };

  const navigate = useNavigate();

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    // Check for validation errors
    if (emailError || passwordError) {
      return;
    }
    // Extract form data
    const data = new FormData(event.currentTarget);
    const formData = {
      email: data.get('email'),
      password: data.get('password'),
    };

    try {
      // Make API request for login
      const response = await axios.post(`https://biomedwaste.net/user/login`, JSON.stringify(formData), {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      sessionStorage.setItem('userData', JSON.stringify(response.data));

      // Optionally check the stored data
      // Navigate to the home page
      navigate('/home');
    } catch (error) {
      console.error('Error during login:', error);

      // Handle specific error cases
      if (error.response) {
        const { status, data } = error.response;

        if (status === 400) {
          alert("Invalid Password or Email");
        } else if (status === 401) {
          alert("Unauthorized access. Please check your credentials.");
        } else {
          alert(data.message || "An unexpected error occurred. Please try again.");
        }
      } else if (error.request) {
        // Network or server not reachable
        alert("Unable to reach the server. Please check your internet connection.");
      } else {
        // Other unexpected errors
        alert("An error occurred. Please try again later.");
      }
    }
  };


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

  return (
    <Card variant="outlined">
      <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
        <img src={logo} alt="Logo" style={{ width: '500px', height: 'auto' }} />
      </Box>
      <Typography
        component="h1"
        variant="h5"
        sx={{ width: '100%', fontSize: 'clamp(1.8rem, 10vw, 1.8r1em)' }}
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
            autoFocus
            required
            fullWidth
            variant="outlined"
            color={emailError ? 'error' : 'primary'}
            sx={{ ariaLabel: 'email' }}
          />
        </FormControl>
        <FormControl>
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <FormLabel htmlFor="password">Password</FormLabel>
            <Link
              component="button"
              type="button"
              onClick={handleClickOpen}
              variant="body2"
              sx={{ alignSelf: 'baseline' }}
            >
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
            autoFocus
            onChange={handlePasswordChange}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={togglePasswordVisibility}
                    edge="end"
                  >
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
        <Button type="submit" fullWidth variant="contained" onClick={validateInputs}>
          Sign in
        </Button>
        <Typography sx={{ textAlign: 'center' }}>
          Don&apos;t have an account?{' '}
          <span>
            <Link
              to="/sign-up"
              variant="body2"
              sx={{ alignSelf: 'center' }}
            >
              Sign up
            </Link>
          </span>
        </Typography>
      </Box>
      <Divider>or</Divider>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Button
          fullWidth
          variant="outlined"
          onClick={handleMicrosoftLogin}
          startIcon={<img src="https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg" alt="Microsoft Logo" width="20" />}
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
  );
}
