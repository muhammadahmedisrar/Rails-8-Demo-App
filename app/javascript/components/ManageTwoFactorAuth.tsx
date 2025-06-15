import React, { useState } from 'react';
import axios from 'axios';
import {
  Box,
  Typography,
  Button,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Stack
} from '@mui/material';
import { Security, Lock, LockOpen } from '@mui/icons-material';
import QrCodeModal from './QrCodeModal';
import { useAuth } from '../AuthContext';

const ManageTwoFactorAuth: React.FC = () => {
  const { logout, otpEnabled, setOtpEnabled } = useAuth();
  const [message, setMessage] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [qrCode, setQrCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleEnable2FA = async () => {
    setIsLoading(true);
    try {
      const response = await axios.post('/two_factor_auth/setup');
      console.log('Response from enabling 2FA:', response.data);
      setQrCode(response.data.qr_code);
      setIsModalOpen(true);
      setIsSuccess(true);
      setOtpEnabled(true);
    } catch (error) {
      console.error('Error enabling 2FA:', error);
      setMessage('Failed to enable 2FA. Please try again.');
      setIsSuccess(false);
      setShowAlert(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDisable2FA = async () => {
    setIsLoading(true);
    try {
      const response = await axios.post('/two_factor_auth/disable');
      setMessage(response.data.message);
      setIsSuccess(true);
      setOtpEnabled(false);
    } catch (error) {
      console.error('Error disabling 2FA:', error);
      setMessage('Failed to disable 2FA. Please try again.');
      setIsSuccess(false);
    } finally {
      setIsLoading(false);
      setShowAlert(true);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);
  const getConfrimation = () => {
    setIsConfirmationModalOpen(true);
  }
  const closeConfirmationModal = () => {
    setIsConfirmationModalOpen(false);
  }
  const handleEnable2FAConfirmation = async () => {
    setIsLoading(true);
    try {
      const response = await axios.post('/two_factor_auth/verify');
      setMessage(response.data.message);
      setIsSuccess(true);
      await logout();
      window.location.href = '/login';
    } catch (error) {
      console.error('Error Enabling 2FA:', error);
      setMessage('Failed to Enabling 2FA. Please try again.');
      setIsSuccess(false);
    } finally {
      setIsLoading(false);
      setShowAlert(true);
    }
  }

  return (
    <Box>
      <Stack spacing={3}>
        <Box>
          <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Security /> Two-Factor Authentication (2FA)
          </Typography>
          <Typography variant="body2" color="text.secondary" paragraph>
            Add an extra layer of security to your account by enabling two-factor authentication.
            When enabled, you'll need to enter a code from your authenticator app in addition to your password.
          </Typography>
        </Box>

        <Stack direction="row" spacing={2}>
          {!otpEnabled && (
            <Button
              variant="contained"
              color="primary"
              onClick={handleEnable2FA}
              disabled={isLoading}
              startIcon={isLoading ? <CircularProgress size={20} /> : <Lock />}
            >
              Enable 2FA
            </Button>
          )}
          {otpEnabled && (
            <Button
              variant="outlined"
              color="error"
              onClick={handleDisable2FA}
              disabled={isLoading}
              startIcon={isLoading ? <CircularProgress size={20} /> : <LockOpen />}
            >
              Disable 2FA
            </Button>
          )}
        </Stack>

        {showAlert && (
          <Alert 
            severity={isSuccess ? "success" : "error"}
            onClose={() => setShowAlert(false)}
            sx={{ mt: 2 }}
          >
            {message}
          </Alert>
        )}
      </Stack>

      <Dialog
        open={isModalOpen}
        onClose={closeModal}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          Scan QR Code
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" paragraph sx={{ mt: 1 }}>
            Scan this QR code with your authenticator app to set up two-factor authentication.
          </Typography>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              p: 3,
              bgcolor: 'background.paper',
              borderRadius: 1
            }}
          >
            {qrCode ? (
              <QrCodeModal isOpen={isModalOpen} qrCode={qrCode} />
            ) : (
              <Typography variant="body2" color="text.secondary">No QR Code available</Typography>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeModal} color="primary">
            Close
          </Button>
          <Button onClick={getConfrimation} color="primary">
            ENABLE 2FA
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={isConfirmationModalOpen}
        onClose={closeConfirmationModal}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          Are You Sure?
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" paragraph sx={{ mt: 1 }}>
           Enabling 2FA will log you out and you would need to sign back in. You will be asked an OTP on next login, which you recieve 
           in the authenticator app you have setup.
          </Typography>
          <Typography variant="body2" color="text.secondary" paragraph sx={{ mt: 1 }}>
           Before enabling make sure you have the authenticator app setup properly.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeConfirmationModal} color="primary">
            No
          </Button>
          <Button onClick={handleEnable2FAConfirmation} color="primary">
            Yes
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ManageTwoFactorAuth;