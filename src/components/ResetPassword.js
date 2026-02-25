import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Box,
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Alert,
  CircularProgress,
  IconButton,
  InputAdornment,
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import LockResetIcon from '@mui/icons-material/LockReset';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { motion } from 'framer-motion';
import logo from '../assets/images/logo.png';

const API_BASE_URL = process.env.REACT_APP_API_URL || "https://biomedwaste.net/api";

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    try {
      await axios.post(`${API_BASE_URL}/user/reset-password`, { token, password });
      setSuccess(true);
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred. The reset link may have expired.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #0D2477 0%, #1a2744 50%, #0D2477 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: 2,
      }}
    >
      <Container maxWidth="sm">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Paper
            elevation={0}
            sx={{
              borderRadius: 3,
              p: { xs: 3, sm: 5 },
              textAlign: 'center',
              boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
            }}
          >
            <Box sx={{ mb: 3 }}>
              <img
                src={logo}
                alt="Biomed Logo"
                style={{ height: 50, marginBottom: 16 }}
              />
            </Box>

            {success ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
              >
                <CheckCircleOutlineIcon
                  sx={{ fontSize: 64, color: '#2E7D32', mb: 2 }}
                />
                <Typography
                  variant="h5"
                  sx={{ fontWeight: 700, color: '#1a2744', mb: 1 }}
                >
                  Password Reset Successfully
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ color: '#666', mb: 3 }}
                >
                  Your password has been updated. You can now sign in with your new password.
                </Typography>
                <Button
                  variant="contained"
                  fullWidth
                  onClick={() => navigate('/')}
                  sx={{
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
                  Go to Sign In
                </Button>
              </motion.div>
            ) : (
              <>
                <LockResetIcon
                  sx={{ fontSize: 48, color: '#0D2477', mb: 1 }}
                />
                <Typography
                  variant="h5"
                  sx={{ fontWeight: 700, color: '#1a2744', mb: 0.5 }}
                >
                  Set New Password
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ color: '#666', mb: 3 }}
                >
                  Enter your new password below. It must be at least 6 characters long.
                </Typography>

                {error && (
                  <Alert severity="error" sx={{ mb: 2, borderRadius: 2, textAlign: 'left' }}>
                    {error}
                  </Alert>
                )}

                <Box component="form" onSubmit={handleSubmit}>
                  <TextField
                    fullWidth
                    label="New Password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    sx={{
                      mb: 2,
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '8px',
                        backgroundColor: '#f8f9fa',
                        '&.Mui-focused fieldset': { borderColor: '#0D2477' },
                      },
                    }}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton onClick={() => setShowPassword(!showPassword)} edge="end" size="small">
                            {showPassword ? <Visibility fontSize="small" /> : <VisibilityOff fontSize="small" />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                  <TextField
                    fullWidth
                    label="Confirm Password"
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    sx={{
                      mb: 3,
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '8px',
                        backgroundColor: '#f8f9fa',
                        '&.Mui-focused fieldset': { borderColor: '#0D2477' },
                      },
                    }}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton onClick={() => setShowConfirmPassword(!showConfirmPassword)} edge="end" size="small">
                            {showConfirmPassword ? <Visibility fontSize="small" /> : <VisibilityOff fontSize="small" />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                  <Button
                    type="submit"
                    variant="contained"
                    fullWidth
                    disabled={loading || !password || !confirmPassword}
                    sx={{
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
                      '&.Mui-disabled': {
                        backgroundColor: '#e8e8e8',
                      },
                    }}
                  >
                    {loading ? <CircularProgress size={24} sx={{ color: '#1a2744' }} /> : 'Reset Password'}
                  </Button>
                </Box>

                <Typography sx={{ mt: 2, fontSize: '0.85rem', color: '#666' }}>
                  Remember your password?{' '}
                  <Box
                    component="span"
                    onClick={() => navigate('/')}
                    sx={{
                      color: '#0D2477',
                      fontWeight: 600,
                      cursor: 'pointer',
                      '&:hover': { textDecoration: 'underline' },
                    }}
                  >
                    Sign In
                  </Box>
                </Typography>
              </>
            )}
          </Paper>
        </motion.div>
      </Container>
    </Box>
  );
};

export default ResetPassword;
