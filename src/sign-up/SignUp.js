import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import CssBaseline from '@mui/material/CssBaseline';
import Divider from '@mui/material/Divider';
import { FormControl, FormControlLabel, FormLabel, TextField, Select, MenuItem, IconButton, InputAdornment } from '@mui/material';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import MuiCard from '@mui/material/Card';
import { createTheme, ThemeProvider, styled } from '@mui/material/styles';
import { GoogleIcon, FacebookIcon } from './CustomIcons';
import logo from '../assets/images/logo.png';
import TemplateFrame from './TemplateFrame';
import { Visibility, VisibilityOff } from '@mui/icons-material';


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
  const [mode, setMode] = React.useState('light');
  const defaultTheme = createTheme({ palette: { mode } });
  const [nameError, setNameError] = React.useState(false);
  const [selectedFacility, setSelectedFacility] = React.useState('rgh');
  const [nameErrorMessage, setNameErrorMessage] = React.useState('');
  const [emailError, setEmailError] = React.useState(false);
  const [emailErrorMessage, setEmailErrorMessage] = React.useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [passwordError, setPasswordError] = React.useState(false);
  const [facilityError, setFacilityError] = React.useState(false);
  const [passwordErrorMessage, setPasswordErrorMessage] = React.useState('');
  const [facilityErrorMessage, setFacilityErrorMessage] = React.useState('');

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
    const name = document.getElementById('name');
    const facility = document.getElementById('facility');

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

    if (!name.value || name.value.length < 1) {
      setNameError(true);
      setNameErrorMessage('Name is required.');
      isValid = false;
    } else {
      setNameError(false);
      setNameErrorMessage('');
    }
    
    if (!facility.value || facility.value.length < 1) {
      setFacilityError(true);
      setFacilityErrorMessage('Facility is required');
      isValid = false;
    } else {
      setFacilityError(false);
      setFacilityErrorMessage('');
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
    console.log('submit clicked');
    if (nameError || emailError || passwordError) {
      console.log('Error popped up');
      return;
    }
    const data = new FormData(event.currentTarget);
    const formData = {
      name: data.get('name'),
      email: data.get('email'),
      password: data.get('password'),
      facility: data.get('facility')
    };
    console.log('Form Data:', formData);
    try {
      const response = await axios.post('/api/register', formData, {
        headers: {
          'Content-Type': 'application/json', 
        },
      });
      console.log('Registration successful:', response.data);
    } catch (error) {
      console.error('Error during registration:', error);
    }
  };

  const handleFacilityChange = (event) => {
    const { value } = event.target;
    setSelectedFacility(value);
    console.log('Selected Facility:', value);
    if (value === '') {
      setFacilityError(true);
      setFacilityErrorMessage('Facility is required');
    } else {
      setFacilityError(false);
      setFacilityErrorMessage('');
    }
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
                <FormLabel htmlFor="name">Full name</FormLabel>
                <TextField
                  required
                  autoComplete="name"
                  name="name"
                  fullWidth
                  id="name"
                  placeholder="Jon Snow"
                  error={nameError}
                  helperText={nameErrorMessage}
                  color={nameError ? 'error' : 'primary'}
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
                <FormLabel htmlFor="facility">Facility</FormLabel>
                <Select
                  labelId="facility-label"
                  id="facility"
                  name="facility"
                  value={selectedFacility}
                  onChange={handleFacilityChange}
                  variant="outlined"
                  error={facilityErrorMessage}
                  color={facilityError ? 'error' : 'primary'}
                >
                  <MenuItem value="rgh">Regina General Hospital</MenuItem>
                  <MenuItem value="a1">Access Place</MenuItem>
                  <MenuItem value="a2">Al Ritchie Heritage Community Health Centre</MenuItem>
                  <MenuItem value="a3">Alex Ositis Foundation</MenuItem>
                  <MenuItem value="a4">All Nations' Healing Hospital</MenuItem>
                  <MenuItem value="a5">Angelique Canada Health Centre</MenuItem>
                  <MenuItem value="a6">Arborfield and District Health Care Centre</MenuItem>
                  <MenuItem value="a7">Arcola Health Centre</MenuItem>
                  <MenuItem value="a8">Assiniboia Union Hospital Integrated Facility</MenuItem>
                  <MenuItem value="a9">Athabasca Health Facility</MenuItem>
                  <MenuItem value="b1">Balcarres Integrated Care Centre</MenuItem>
                  <MenuItem value="b2">Battleford District Care Centre</MenuItem>
                  <MenuItem value="b3">Battlefords Family Health Centre</MenuItem>
                  <MenuItem value="b4">Battlefords Union Hospital</MenuItem>
                  <MenuItem value="b5">Beauval Health Centre</MenuItem>
                  <MenuItem value="b6">Beechy Health Centre</MenuItem>
                  <MenuItem value="b7">Bengough Health Centre</MenuItem>
                  <MenuItem value="b8">Bernice Sayese Centre</MenuItem>
                  <MenuItem value="b9">Bethany Pioneer Village</MenuItem>
                  <MenuItem value="b10">Big River Health Centre</MenuItem>
                  <MenuItem value="b11">Biggar & District Health Centre</MenuItem>
                  <MenuItem value="b12">Biggar & District Health Services Foundation Inc.</MenuItem>
                  <MenuItem value="b13">Birch Hills Health Facility</MenuItem>
                  <MenuItem value="b14">Birch View Home</MenuItem>
                  <MenuItem value="b15">Black Lake Clinic (Athabasca Health Authority)</MenuItem>
                  <MenuItem value="b16">Blaine Lake Primary Health Care Clinic</MenuItem>
                  <MenuItem value="b17">Borden Primary Health Centre</MenuItem>
                  <MenuItem value="b18">Border Health Centre</MenuItem>
                  <MenuItem value="b19">Broadview Centennial Lodge</MenuItem>
                  <MenuItem value="b20">Broadview Union Hospital</MenuItem>
                  <MenuItem value="b21">Buffalo Narrows Health Centre</MenuItem>
                  <MenuItem value="c1">Candle Lake Health Centre</MenuItem>
                  <MenuItem value="c2">Canora Gateway Lodge</MenuItem>
                  <MenuItem value="c3">Canora Hospital</MenuItem>
                  <MenuItem value="c4">Carlyle Primary Health Care Centre</MenuItem>
                  <MenuItem value="c4">Carrot River Health Centre</MenuItem>
                  <MenuItem value="c6">Carrot River Medical Clinic</MenuItem>
                  <MenuItem value="c7">Centennial Special Care Home</MenuItem>
                  <MenuItem value="c8">Central Butte and District Health Care Foundation</MenuItem>
                  <MenuItem value="c9">Central Haven Special Care Home</MenuItem>
                  <MenuItem value="c10">Central Parkland Lodge</MenuItem>
                  <MenuItem value="c11">Chateau Providence</MenuItem>
                  <MenuItem value="c12">Circle Drive Special Care Home</MenuItem>
                  <MenuItem value="c13">Community Health Centre at Market Mall</MenuItem>
                  <MenuItem value="c14">Coronach Health Centre</MenuItem>
                  <MenuItem value="c15">Cozy Nest Care Home</MenuItem>
                </Select>
              </FormControl>
              <FormControl fullWidth required>
                <FormLabel htmlFor="password">Password</FormLabel>
                <TextField
                  required
                  fullWidth
                  name="password"
                  placeholder="••••••"
                  type={showPassword ? 'text' : 'password'} // Toggle between 'text' and 'password'
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
            <Divider>
              <Typography sx={{ color: 'text.secondary' }}>or</Typography>
            </Divider>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Button
                fullWidth
                variant="outlined"
                onClick={() => alert('Sign up with Google')}
                startIcon={<GoogleIcon />}
              >
                Sign up with Google
              </Button>
              <Button
                fullWidth
                variant="outlined"
                onClick={() => alert('Sign up with Facebook')}
                startIcon={<FacebookIcon />}
              >
                Sign up with Facebook
              </Button>
            </Box>
          </Card>
        </SignUpContainer>
      </ThemeProvider>
    </TemplateFrame>
  );
}
