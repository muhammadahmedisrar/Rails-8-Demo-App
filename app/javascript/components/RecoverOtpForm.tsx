import React, { useState } from 'react';
import axios from 'axios';
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Snackbar,
  Alert,
  CircularProgress,
  InputAdornment,
  Paper,
  Divider,
} from '@mui/material';
import { Email, Key } from '@mui/icons-material';

const RecoverOtpForm: React.FC = () => {
  const [recoveryCode, setRecoveryCode] = useState('');
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [showMessage, setShowMessage] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const response = await axios.post('/verify_otp', { recovery_code: recoveryCode });
      setMessage(response.data.message || 'Code verified successfully');
      setIsSuccess(true);
      setTimeout(() => {
        window.location.href = '/';
      }, 1500);
    } catch (error) {
      console.error('Code verification failed:', error);
      setMessage('Invalid code. Please try again.');
      setIsSuccess(false);
    } finally {
      setIsLoading(false);
      setShowMessage(true);
    }
  };

  const sendRecoveryCode = async () => {
    if (!email) return;
    
    setIsLoading(true);
    try {
      const response = await axios.post('/two_factor_auth/recover_otp', { email_address: email });
      setMessage(response.data.message || 'Code sent successfully');
      setIsSuccess(true);
      } catch (error) {
      console.error('Recovery code verification failed:', error);
      setMessage('Issue sending code to email. Please try again.');
      setIsSuccess(false);
      } finally {
      setIsLoading(false);
      setShowMessage(true);
      }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Paper
          elevation={3}
          sx={{
            padding: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            width: '100%',
          }}
        >
          <Typography component="h1" variant="h5" gutterBottom>
            Backup OTP
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3, textAlign: 'center' }}>
            Enter your email address to receive the otp code
          </Typography>

          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Email />
                </InputAdornment>
              ),
            }}
          />

          <Button
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2, height: 48 }}
            onClick={sendRecoveryCode}
            disabled={!email || isLoading}
          >
            {isLoading ? <CircularProgress size={24} /> : 'Send Code to Email'}
          </Button>

          <Box sx={{ width: '100%', my: 2 }}>
            <Divider>
              <Typography variant="body2" color="text.secondary">
                Or enter your otp code
              </Typography>
            </Divider>
          </Box>

          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1, width: '100%' }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="recovery-code"
              label="Recovery Code"
              name="recovery_code"
              autoComplete="one-time-code"
              value={recoveryCode}
              onChange={(e) => setRecoveryCode(e.target.value)}
              inputProps={{
                maxLength: 6
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Key />
                  </InputAdornment>
                ),
              }}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2, height: 48 }}
              disabled={isLoading || !recoveryCode}
            >
              {isLoading ? <CircularProgress size={24} /> : 'Verify Otp Code'}
            </Button>
          </Box>
        </Paper>
      </Box>

      <Snackbar
        open={showMessage}
        autoHideDuration={6000}
        onClose={() => setShowMessage(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert
          severity={isSuccess ? "success" : "error"}
          onClose={() => setShowMessage(false)}
        >
          {message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default RecoverOtpForm;