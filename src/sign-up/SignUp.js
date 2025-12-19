import React, { useState } from 'react';
import axios from 'axios';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import CssBaseline from '@mui/material/CssBaseline';
import { FormControl, FormControlLabel, FormLabel, TextField, IconButton, InputAdornment, Snackbar, Alert } from '@mui/material';
import Typography from '@mui/material/Typography';
import MuiCard from '@mui/material/Card';
import useMediaQuery from '@mui/material/useMediaQuery';
import { createTheme, ThemeProvider, styled } from '@mui/material/styles';
import logo from '../assets/images/logo.png';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { Link, useNavigate } from 'react-router-dom';
import Content from './Content';

const theme = createTheme({
  palette: {
    primary: {
      main: '#D9DE38',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
  },
});

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
      borderColor: '#D9DE38',
    },
    '&.Mui-focused fieldset': {
      borderColor: '#D9DE38',
    },
  },
  '& .MuiInputBase-input': {
    padding: '14px 16px',
  },
}));

export default function SignUp() {
  const API_BASE_URL = process.env.REACT_APP_API_URL || "https://biomedwaste.net/api";
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [firstNameError, setFirstNameError] = React.useState(false);
  const [firstNameErrorMessage, setFirstNameErrorMessage] = React.useState('');
  const [lastNameError, setLastNameError] = React.useState(false);
  const [lastNameErrorMessage, setLastNameErrorMessage] = React.useState('');
  const [emailError, setEmailError] = React.useState(false);
  const [emailErrorMessage, setEmailErrorMessage] = React.useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [passwordError, setPasswordError] = React.useState(false);
  const [passwordErrorMessage, setPasswordErrorMessage] = React.useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const navigate = useNavigate();

  const validateInputs = () => {
    const email = document.getElementById('email');
    const password = document.getElementById('password');
    const firstname = document.getElementById('firstname');
    const lastname = document.getElementById('lastname');
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

    if (!firstname.value) {
      setFirstNameError(true);
      setFirstNameErrorMessage('First Name is Required');
      isValid = false;
    } else {
      setFirstNameError(false);
      setFirstNameErrorMessage('');
    }

    if (!lastname.value) {
      setLastNameError(true);
      setLastNameErrorMessage('Last Name is Required');
      isValid = false;
    } else {
      setLastNameError(false);
      setLastNameErrorMessage('');
    }

    return isValid;
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (firstNameError || lastNameError || emailError || passwordError) {
      return;
    }

    const data = new FormData(event.currentTarget);
    const formData = {
      firstname: data.get('firstname'),
      lastname: data.get('lastname'),
      email: data.get('email'),
      password: data.get('password'),
    };

    try {
      await axios.post(`${API_BASE_URL}/user/register`, formData, {
        headers: { 'Content-Type': 'application/json' },
      });
      setSnackbarMessage('Registration Successful! Please log in');
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
      setTimeout(() => {
        navigate('/');
      }, 3000);
    } catch (error) {
      console.error('Error during registration:', error);
      if (error.response) {
        const { status, data } = error.response;
        if (status === 409) {
          setSnackbarMessage('User already exists. Please try logging in.');
        } else if (status === 400) {
          setSnackbarMessage('Invalid input. Please check your details.');
        } else {
          setSnackbarMessage(data.message || 'An error occurred. Please try again.');
        }
      } else {
        setSnackbarMessage('Unable to reach the server. Please try again later.');
      }
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    }
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const SignUpForm = () => (
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
        Sign Up
      </Typography>

      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
      >
        <FormControl>
          <FormLabel htmlFor="firstname" sx={{ mb: 0.5, color: '#333', fontWeight: 500, fontSize: '0.875rem' }}>
            First Name
          </FormLabel>
          <StyledTextField
            required
            autoComplete="firstname"
            name="firstname"
            fullWidth
            id="firstname"
            placeholder="First name"
            error={firstNameError}
            helperText={firstNameErrorMessage}
            size="small"
          />
        </FormControl>

        <FormControl>
          <FormLabel htmlFor="lastname" sx={{ mb: 0.5, color: '#333', fontWeight: 500, fontSize: '0.875rem' }}>
            Last Name
          </FormLabel>
          <StyledTextField
            required
            autoComplete="lastname"
            name="lastname"
            fullWidth
            id="lastname"
            placeholder="Last name"
            error={lastNameError}
            helperText={lastNameErrorMessage}
            size="small"
          />
        </FormControl>

        <FormControl>
          <FormLabel htmlFor="email" sx={{ mb: 0.5, color: '#333', fontWeight: 500, fontSize: '0.875rem' }}>
            Email
          </FormLabel>
          <StyledTextField
            required
            fullWidth
            id="email"
            placeholder="your@email.com"
            name="email"
            autoComplete="email"
            error={emailError}
            helperText={emailErrorMessage}
            size="small"
          />
        </FormControl>

        <FormControl>
          <FormLabel htmlFor="password" sx={{ mb: 0.5, color: '#333', fontWeight: 500, fontSize: '0.875rem' }}>
            Password
          </FormLabel>
          <StyledTextField
            required
            fullWidth
            name="password"
            placeholder="••••••"
            type={showPassword ? 'text' : 'password'}
            id="password"
            autoComplete="new-password"
            error={passwordError}
            helperText={passwordErrorMessage}
            value={password}
            onChange={handlePasswordChange}
            size="small"
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
              value="allowExtraEmails"
              sx={{ color: '#ccc', '&.Mui-checked': { color: '#D9DE38' } }}
            />
          }
          label={<Typography sx={{ fontSize: '0.875rem', color: '#666' }}>I want to receive updates via email.</Typography>}
        />

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
          Sign Up
        </Button>

        <Typography sx={{ textAlign: 'center', fontSize: '0.875rem', color: '#666' }}>
          Already have an account?{' '}
          <Link to="/" style={{ color: '#0D2477', fontWeight: 600, textDecoration: 'none' }}>
            Sign In
          </Link>
        </Typography>
      </Box>
    </Card>
  );

  if (isMobile) {
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'flex-start',
            backgroundColor: '#1a2744',
            minHeight: '100vh',
            padding: 0,
            position: 'relative',
            overflow: 'auto',
          }}
        >
          <Box sx={{ pt: 4, pb: 2, textAlign: 'center', zIndex: 1 }}>
            <img src={logo} alt="Biomed Logo" style={{ width: '140px', height: 'auto' }} />
            <Typography
              variant="caption"
              sx={{
                color: '#ABB738',
                display: 'block',
                mt: 0.5,
                fontStyle: 'italic',
                letterSpacing: 1,
                fontSize: '0.75rem',
              }}
            >
              The Biohazard Professionals
            </Typography>
          </Box>

          <Box sx={{ width: '100%', px: 2, zIndex: 1, pb: 4 }}>
            <SignUpForm />
          </Box>
        </Box>
        <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleSnackbarClose}>
          <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: '100%' }}>
            {snackbarMessage}
          </Alert>
        </Snackbar>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box
        sx={{
          display: 'flex',
          minHeight: '100vh',
          flexDirection: 'row',
        }}
      >
        <Box
          sx={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#1a2744',
            padding: 6,
            minHeight: '100vh',
          }}
        >
          <Content />
        </Box>

        <Box
          sx={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#ffffff',
            padding: 4,
            minHeight: '100vh',
            overflow: 'auto',
          }}
        >
          <SignUpForm />
        </Box>
      </Box>
      <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleSnackbarClose}>
        <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </ThemeProvider>
  );
}
