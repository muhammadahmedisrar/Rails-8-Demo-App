import React from 'react';
import { Box, Container, Typography, Button, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { SentimentVeryDissatisfied as SadFaceIcon, Home as HomeIcon } from '@mui/icons-material';

const NotFound: React.FC = () => {
  const navigate = useNavigate();

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
            <Box
              sx={{
                textAlign: 'center',
                py: 8,
                px: 6,
                borderRadius: 2,
                backgroundColor: 'white',
              }}
            >
              <SadFaceIcon 
                sx={{ 
                  fontSize: 64,
                  color: 'primary.main',
                  mb: 4
                }} 
              />
              
              <Typography
                variant="h1"
                sx={{
                  fontSize: '6rem',
                  fontWeight: 700,
                  color: 'primary.main',
                  lineHeight: 1,
                  mb: 2
                }}
              >
                404
              </Typography>

              <Typography
                variant="h5"
                sx={{
                  mb: 2,
                  fontWeight: 600,
                  color: 'text.primary'
                }}
              >
                Page Not Found
              </Typography>

              <Typography
                variant="body1"
                sx={{
                  mb: 4,
                  color: 'text.secondary'
                }}
              >
                Oops! The page you're looking for doesn't exist or has been moved.
              </Typography>

              <Button
                variant="contained"
                startIcon={<HomeIcon />}
                onClick={() => navigate('/')}
                sx={{
                  textTransform: 'none',
                  px: 4,
                  py: 1.5,
                  borderRadius: 2,
                  backgroundColor: 'primary.main',
                  '&:hover': {
                    backgroundColor: 'primary.dark',
                  }
                }}
              >
                Back to Home
              </Button>
            </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default NotFound;