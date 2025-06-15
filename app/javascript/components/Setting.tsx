import React from 'react';
import { useTheme } from '../ThemeContext';
import Navbar from './Navbar';
import ManageTwoFactorAuth from './ManageTwoFactorAuth';
import {
  Container,
  Box,
  Typography,
  Paper,
  Divider,
  Switch
} from '@mui/material';

const Setting: React.FC = () => {
  const { isDarkMode, toggleTheme } = useTheme();

  return (
    <Container component="main" maxWidth="md">
      <Navbar />
      <Box
        sx={{
          marginTop: 4,
          marginBottom: 4,
          display: 'flex',
          flexDirection: 'column',
          gap: 3
        }}
      >
        <Typography component="h1" variant="h4" gutterBottom>
          Account Settings
        </Typography>

        <Paper elevation={3} sx={{ p: 4 }}>
          <Typography variant="h6" color="text.primary" gutterBottom>
            Security Settings
          </Typography>
          <Typography variant="body2" color="text.secondary" paragraph>
            Manage your account security settings and two-factor authentication preferences.
          </Typography>
          <Divider sx={{ my: 3 }} />
          <Box display="flex" alignItems="center">
            <Typography variant="body1" sx={{ mr: 2, my: 3}}>
              Dark Mode
            </Typography>
            <Switch checked={isDarkMode} onChange={toggleTheme} />
          </Box>
          <ManageTwoFactorAuth />
        </Paper>
      </Box>
    </Container>
  );
};

export default Setting;