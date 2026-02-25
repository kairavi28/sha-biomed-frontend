import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  CircularProgress,
  Alert,
  Box,
} from '@mui/material';
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || "https://biomedwaste.net/api";

function ForgotPassword({ open, handleClose }) {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null);
  const [error, setError] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      setError('Please enter a valid email address.');
      return;
    }

    setLoading(true);
    setError('');
    setStatus(null);

    try {
      await axios.post(`${API_BASE_URL}/user/forgot-password`, { email });
      setStatus('success');
      setEmail('');
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDialogClose = () => {
    setEmail('');
    setStatus(null);
    setError('');
    setLoading(false);
    handleClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleDialogClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          p: 1,
        },
      }}
    >
      <DialogTitle sx={{ fontWeight: 600, color: '#1a2744' }}>
        Reset Password
      </DialogTitle>
      <DialogContent>
        {status === 'success' ? (
          <Box sx={{ py: 2 }}>
            <Alert severity="success" sx={{ borderRadius: 2 }}>
              If an account with that email exists, we've sent a password reset link. Please check your inbox and spam folder.
            </Alert>
          </Box>
        ) : (
          <>
            <DialogContentText sx={{ mb: 2, color: '#555' }}>
              Enter your account's email address and we'll send you a link to reset your password.
            </DialogContentText>
            {error && (
              <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>
                {error}
              </Alert>
            )}
            <TextField
              autoFocus
              required
              fullWidth
              id="reset-email"
              name="email"
              label="Email address"
              placeholder="your@email.com"
              type="email"
              variant="outlined"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '8px',
                  '&.Mui-focused fieldset': {
                    borderColor: '#0D2477',
                  },
                },
              }}
            />
          </>
        )}
      </DialogContent>
      <DialogActions sx={{ pb: 2, px: 3 }}>
        <Button
          onClick={handleDialogClose}
          sx={{
            textTransform: 'none',
            color: '#666',
            borderRadius: 2,
          }}
        >
          {status === 'success' ? 'Close' : 'Cancel'}
        </Button>
        {status !== 'success' && (
          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={loading || !email.trim()}
            sx={{
              textTransform: 'none',
              borderRadius: 2,
              backgroundColor: '#D9DE38',
              color: '#1a2744',
              fontWeight: 600,
              '&:hover': {
                backgroundColor: '#c5ca2f',
              },
              '&.Mui-disabled': {
                backgroundColor: '#e8e8e8',
              },
            }}
          >
            {loading ? <CircularProgress size={22} sx={{ color: '#1a2744' }} /> : 'Send Reset Link'}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
}

ForgotPassword.propTypes = {
  handleClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
};

export default ForgotPassword;