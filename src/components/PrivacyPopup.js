import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Link
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { usePrivacy } from './PrivacyContext';

const PrivacyPopup = () => {
  const { open, acceptPrivacy } = usePrivacy();
  const navigate = useNavigate();

  const handleAccept = () => {
    const next = acceptPrivacy();
    navigate(next);
  };

  return (
    <Dialog open={open}>
      <DialogTitle>Privacy Policy</DialogTitle>
      <DialogContent>
        <Typography>
          We collect limited personal and non-personal information to improve our services and respond to complaints; your data is never sold and is protected in accordance with Canadian privacy laws.
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleAccept} variant="contained" color="primary">
          I Agree
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default PrivacyPopup;
