import React, { useState } from 'react';
import axios from 'axios';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import CssBaseline from '@mui/material/CssBaseline';
import { FormControl, FormControlLabel, FormLabel, TextField, IconButton, InputAdornment, Snackbar, Alert } from '@mui/material';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import MuiCard from '@mui/material/Card';
import { createTheme, ThemeProvider, styled } from '@mui/material/styles';
import logo from '../assets/images/logo.png';
import TemplateFrame from './TemplateFrame';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { Link, useNavigate } from 'react-router-dom';

const Card = styled(MuiCard)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignSelf: 'center',
  width: '100%',
  padding: theme.spacing(4),
  gap: theme.spacing(2),
  margin: 'auto',
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

const SignUpContainer = styled(Stack)(({ theme }) => ({
  minHeight: '100%',
  padding: theme.spacing(2),
  [theme.breakpoints.up('sm')]: {
    padding: theme.spacing(4),
  },
  backgroundImage:
    'radial-gradient(ellipse at 50% 50%, hsl(210, 100%, 97%), hsl(0, 0%, 100%))',
  backgroundRepeat: 'no-repeat',
  ...theme.applyStyles('dark', {
    backgroundImage:
      'radial-gradient(at 50% 50%, hsla(210, 100%, 16%, 0.5), hsl(220, 30%, 5%))',
  }),
}));

export default function SignUp() {
  const API_BASE_URL = process.env.REACT_APP_API_URL;
  const [mode, setMode] = React.useState('light');
  const defaultTheme = createTheme({ palette: { mode } });
  const [firstNameError, setFirstNameError] = React.useState(false);
  const [firstNameErrorMessage, setFirstNameErrorMessage] = React.useState('');
  const [lastNameError, setLastNameError] = React.useState(false);
  const [lastNameErrorMessage, setLastNameErrorMessage] = React.useState('');
  const [emailError, setEmailError] = React.useState(false);
  const [emailErrorMessage, setEmailErrorMessage] = React.useState('');
  //password
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [passwordError, setPasswordError] = React.useState(false);
  const [passwordErrorMessage, setPasswordErrorMessage] = React.useState('');
  //facility
  const [facilities, setFacilities] = React.useState([]);
  const [facilityTypes, setFacilityTypes] = React.useState([]);
  const [selectedFacility, setSelectedFacility] = React.useState('');
  const [selectedFacilityType, setSelectedFacilityType] = React.useState('');
  const [facilityError, setFacilityError] = useState(false);
  const [facilityErrorMessage, setFacilityErrorMessage] = useState('');
  const [facilityTypeError, setFacilityTypeError] = useState(false);
  const [facilityTypeErrorMessage, setFacilityTypeErrorMessage] = useState('');

  //snackbar - notifications
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');

  //text field
  const [otherFacility, setOtherFacility] = React.useState(''); // State for custom facility input
  const navigate = useNavigate();

  React.useEffect(() => {
    // Fetch facility options
    axios.get('/data/facilities.json')
      .then((response) => {
        setFacilities(response.data);
      })
      .catch((error) => {
        console.error('Error fetching facilities:', error);
      });

    // Fetch facility type options
    axios.get('/data/facilityTypes.json')
      .then((response) => {
        setFacilityTypes(response.data);
      })
      .catch((error) => {
        console.error('Error fetching facility types:', error);
      });
  }, []);

  React.useEffect(() => {
    // Check if there is a preferred mode in localStorage
    const savedMode = localStorage.getItem('themeMode');

    if (savedMode) {
      setMode(savedMode);
    } else {
      // If no preference is found, it uses system preference
      const systemPrefersDark = window.matchMedia(
        '(prefers-color-scheme: dark)',
      ).matches;
      setMode(systemPrefersDark ? 'dark' : 'light');
    }
  }, []);

  const toggleColorMode = () => {
    const newMode = mode === 'dark' ? 'light' : 'dark';
    setMode(newMode);
    localStorage.setItem('themeMode', newMode);
  };

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

    if(!firstname) {
      setFirstNameError(true);
      setFirstNameErrorMessage('First Name is Required');
      isValid = false;
    }

    if(!lastname) {
      setLastNameError(true);
      setLastNameErrorMessage('Last Name is Required');
      isValid = false;
    }

    if (!selectedFacility) {
      setFacilityError(true);
      setFacilityErrorMessage('Please select a facility.');
      isValid = false;
    } else {
      setFacilityError(false);
      setFacilityErrorMessage('');
    }

    if (!selectedFacilityType) {
      setFacilityTypeError(true);
      setFacilityTypeErrorMessage('Please select a facility type.');
      isValid = false;
    } else {
      setFacilityTypeError(false);
      setFacilityTypeErrorMessage('');
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
    // Validate form errors
    if (firstNameError || lastNameError || emailError || passwordError) {
      return;
    }
    const facilityValue =
      selectedFacility === 'Other' ? otherFacility : selectedFacility;

    // Extract form data
    const data = new FormData(event.currentTarget);
    const formData = {
      firstname: data.get('firstname'),
      lastname: data.get('lastname'),
      email: data.get('email'),
      password: data.get('password'),
      facilityType: selectedFacilityType,
      facility: facilityValue,
    };

    try {
      const response = await axios.post(`${API_BASE_URL}/user/register`, formData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      setSnackbarMessage('Registration Successful! Please log in');
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
      setTimeout(() => {
        navigate('/');
      }, 3000);
    } catch (error) {
      console.error('Error during registration:', error);

      // Check for API-specific errors
      if (error.response) {
        const { status, data } = error.response;

        // Handle "existing admin" error
        if (status === 409 && data.message === 'Admin already exists') {
          setSnackbarMessage('Admin already exists. Please try logging in.');
        } else if (status === 400) {
          setSnackbarMessage('Invalid input. Please check your details.');
        } else {
          setSnackbarMessage(data.message || 'An error occurred. Please try again.');
        }
      } else if (error.request) {
        // Handle network or server errors
        setSnackbarMessage('Unable to reach the server. Please try again later.');
      } else {
        // Handle unknown errors
        setSnackbarMessage('An unexpected error occurred.');
      }
      // Display error message
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    }
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  return (
    <TemplateFrame
      mode={mode}
      toggleColorMode={toggleColorMode}
    >
      <ThemeProvider theme={defaultTheme}>
        <CssBaseline enableColorScheme />
        <SignUpContainer direction="column" justifyContent="space-between">
          <Card variant="outlined">
            <img src={logo} alt="Logo" style={{ width: '100px', height: 'auto' }} />
            <Typography
              component="h1"
              variant="h4"
              sx={{ width: '100%', fontSize: 'clamp(1.8rem, 10vw, 1.8rem)' }}
            >
              Sign up
            </Typography>
            <Box
              component="form"
              onSubmit={handleSubmit}
              sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
            >
              <FormControl>
                <FormLabel htmlFor="firstname">First Name</FormLabel>
                <TextField
                  required
                  autoComplete="firstname"
                  name="firstname"
                  fullWidth
                  id="firstname"
                  placeholder="first name"
                  error={firstNameError}
                  helperText={firstNameErrorMessage}
                  color={firstNameError ? 'error' : 'primary'}
                />
              </FormControl>
              <FormControl>
                <FormLabel htmlFor="lastname">Last Name</FormLabel>
                <TextField
                  required
                  autoComplete="lastname"
                  name="lastname"
                  fullWidth
                  id="lastname"
                  placeholder="last name"
                  error={lastNameError}
                  helperText={lastNameErrorMessage}
                  color={lastNameError ? 'error' : 'primary'}
                />
              </FormControl>
              <FormControl>
                <FormLabel htmlFor="email">Email</FormLabel>
                <TextField
                  required
                  fullWidth
                  id="email"
                  placeholder="your@email.com"
                  name="email"
                  autoComplete="email"
                  variant="outlined"
                  error={emailError}
                  helperText={emailErrorMessage}
                  color={passwordError ? 'error' : 'primary'}
                />
              </FormControl>

              <FormControl fullWidth required>
                <FormLabel htmlFor="password">Password</FormLabel>
                <TextField
                  required
                  fullWidth
                  name="password"
                  placeholder="••••••"
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  autoComplete="new-password"
                  variant="outlined"
                  error={passwordError}
                  helperText={passwordErrorMessage}
                  color={passwordError ? 'error' : 'primary'}
                  value={password}
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

              {/* <FormControl fullWidth>
                <FormLabel htmlFor="facilityType">Facility Type</FormLabel>
                <TextField
                  select
                  id="facilityType"
                  value={selectedFacilityType}
                  onChange={(event) => setSelectedFacilityType(event.target.value)}
                  SelectProps={{
                    native: true,
                    width: '300px'
                  }}
                  variant="outlined"
                  error={facilityTypeError}
                  helperText={facilityTypeError ? 'Please select a facility type' : ''}
                  color={facilityTypeError ? 'error' : 'primary'}
                >
                  <option value="">Select a Facility Type</option>
                  {facilityTypes.map((type, index) => (
                    <option key={`${type.id}-${index}`} value={type.id}>
                      {type.name}
                    </option>
                  ))}

                </TextField>
              </FormControl>

              <FormControl fullWidth>
                <FormLabel htmlFor="facility">Facility</FormLabel>
                <TextField
                  select
                  id="facility"
                  value={selectedFacility}
                  onChange={(event) => setSelectedFacility(event.target.value)}
                  SelectProps={{
                    native: true,
                  }}
                  variant="outlined"
                  error={facilityError}
                  helperText={facilityErrorMessage}
                  color={facilityError ? 'error' : 'primary'}
                >
                  <option value="">Select a Facility</option>
                  {facilities.map((facility) => (
                    <option key={facility.id} value={facility.name}>
                      {facility.name}
                    </option>
                  ))}
                  <option value="Other">Other</option>
                </TextField>
                {selectedFacility === 'Other' && (
                  <TextField
                    fullWidth
                    id="otherFacility"
                    placeholder="Enter facility name"
                    value={otherFacility}
                    onChange={(event) => setOtherFacility(event.target.value)}
                    variant="outlined"
                    margin="normal"
                  />
                )}
              </FormControl> */}
              <FormControlLabel
                control={<Checkbox value="allowExtraEmails" color="primary" />}
                label="I want to receive updates via email."
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                onClick={validateInputs}
              >
                Sign up
              </Button>
              <Typography sx={{ textAlign: 'center' }}>
                Already have an account?{' '}
                <span>
                  <Link
                    to="/"
                    variant="body2"
                    sx={{ alignSelf: 'center' }}
                  >
                    Sign in
                  </Link>
                </span>
              </Typography>
            </Box>
          </Card>
        </SignUpContainer>
      </ThemeProvider>
      {/* Snackbar for notifications */}
      <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleSnackbarClose}>
        <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </TemplateFrame>
  );
}
