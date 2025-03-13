import React, { useState } from 'react';
import axios from 'axios';
import { FormControl, Button, FormLabel, TextField, IconButton, InputAdornment } from '@mui/material';
import Box from '@mui/material/Box';
import MuiCard from '@mui/material/Card';
import Checkbox from '@mui/material/Checkbox';
import Divider from '@mui/material/Divider';
import { Link, useNavigate } from 'react-router-dom';
import Typography from '@mui/material/Typography';
import logo from '../assets/images/logo.png';
import { styled } from '@mui/material/styles';
import ForgotPassword from './ForgotPassword';
import { GoogleIcon } from './CustomIcons';
import { Visibility, VisibilityOff } from '@mui/icons-material';

const Card = styled(MuiCard)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignSelf: 'center',
  width: '100%',
  padding: theme.spacing(4),
  gap: theme.spacing(2),
  boxShadow: '0px 5px 15px rgba(0,0,0,0.05)',
  [theme.breakpoints.up('sm')]: {
    width: '450px',
  },
}));

export default function SignInCard() {
  const [emailError, setEmailError] = useState(false);
  const [emailErrorMessage, setEmailErrorMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState(false);
  const [passwordErrorMessage, setPasswordErrorMessage] = useState('');
  const [open, setOpen] = useState(false);

  const navigate = useNavigate();

  const handlePasswordChange = (event) => setPassword(event.target.value);
  const togglePasswordVisibility = () => setShowPassword((prev) => !prev);

  const validateInputs = () => {
    const email = document.getElementById('email').value;
    let isValid = true;

    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      setEmailError(true);
      setEmailErrorMessage('Please enter a valid email address.');
      isValid = false;
    } else {
      setEmailError(false);
      setEmailErrorMessage('');
    }

    if (!password || password.length < 6) {
      setPasswordError(true);
      setPasswordErrorMessage('Password must be at least 6 characters long.');
      isValid = false;
    } else {
      setPasswordError(false);
      setPasswordErrorMessage('');
    }

    return isValid;
  };

  const fetchUserData = async (userId) => {
    try {
      const response = await axios.get(`http://localhost:5000/user/${userId}`);

      if (response.data) {
        const { _id, username, facilities } = response.data;
        const approvedFacilities = facilities?.filter(facility => facility.approved).map(facility => facility.name) || [];
        sessionStorage.setItem("userData", JSON.stringify(response.data));
        sessionStorage.setItem("facilityData", JSON.stringify({ id: _id, username, approvedFacilities }));
      }
    } catch (error) {
      console.error("Failed to fetch user data:", error);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validateInputs()) return;

    const data = new FormData(event.currentTarget);
    const formData = { email: data.get('email'), password: data.get('password') };
    try {
      const response = await axios.post(`http://localhost:5000/user/login`, JSON.stringify(formData), {
        headers: { 'Content-Type': 'application/json' },
      });
      if (response.data?.id) {  
        await fetchUserData(response.data.id);
        navigate('/home');
      }
    } catch (error) {
      if (error.response) {
        const { status, data } = error.response;
        alert(status === 400 ? "Invalid Email or Password" : data.message || "An unexpected error occurred.");
      } else {
        alert("Network error. Please try again.");
      }
    }
  };

  return (
    <Card variant="outlined">
      <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
        <img src={logo} alt="Logo" style={{ width: '500px', height: 'auto' }} />
      </Box>
      <Typography component="h1" variant="h5">Sign In</Typography>
      <Box component="form" onSubmit={handleSubmit} noValidate sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <FormControl>
          <FormLabel htmlFor="email">Email</FormLabel>
          <TextField
            error={emailError}
            helperText={emailErrorMessage}
            id="email"
            type="email"
            name="email"
            placeholder="your@email.com"
            required
            fullWidth
            variant="outlined"
          />
        </FormControl>
        <FormControl>
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <FormLabel htmlFor="password">Password</FormLabel>
            <Link component="button" onClick={() => setOpen(true)} variant="body2">Forgot your password?</Link>
          </Box>
          <TextField
            required
            fullWidth
            name="password"
            placeholder="••••••"
            type={showPassword ? 'text' : 'password'}
            id="password"
            variant="outlined"
            error={passwordError}
            helperText={passwordErrorMessage}
            value={password}
            onChange={handlePasswordChange}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={togglePasswordVisibility}>
                    {showPassword ? <Visibility /> : <VisibilityOff />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </FormControl>

        <Checkbox value="remember" color="primary" label="Remember me" />
        <ForgotPassword open={open} handleClose={() => setOpen(false)} />
        <Button type="submit" fullWidth variant="contained">Sign in</Button>
        <Typography sx={{ textAlign: 'center' }}>
          Don't have an account? <Link to="/sign-up">Sign up</Link>
        </Typography>
      </Box>
      <Divider>or</Divider>
      <Button fullWidth variant="outlined" onClick={() => alert('Sign in with Google')} startIcon={<GoogleIcon />}>
        Sign in with Google
      </Button>
    </Card>
  );
}
