import React from 'react';
import {
  Container,
  Typography,
  Box,
} from '@mui/material';
import Navbar from './Navbar';

const Dashboard: React.FC = () => {
  return (
    <Container component="main" maxWidth="md">
      <Navbar/>
      <Container maxWidth="lg" style={{marginTop: '10px'}}>
        <Box sx={{ mb: 6 }}>
          <Typography 
            variant="h4" 
            sx={{ 
              fontWeight: 700,
              // color: 'text.primary',
              mb: 1
            }}
          >
            Dashboard
          </Typography>
          <Typography variant="body1">
            Welcome back! Here's what's happening with your projects today.
          </Typography>
        </Box>
      </Container>
    </Container>
  );
};

export default Dashboard;