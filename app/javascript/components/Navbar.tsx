import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Container,
  useTheme,
} from '@mui/material';
import { Link, useLocation } from 'react-router-dom';
import { Home, Settings, Logout } from '@mui/icons-material';
import { useAuth } from '../AuthContext';

const Navbar: React.FC = () => {
  const { logout } = useAuth();
  const location = useLocation();
  const theme = useTheme();

  const isActive = (path: string) => location.pathname === path;

  const handleLogout = async () => {
    await logout();
    window.location.href = '/login';
  };

  const navItems = [
    { path: '/', label: 'Dashboard', icon: <Home fontSize="small" /> },
    { path: '/settings', label: 'Settings', icon: <Settings fontSize="small" /> },
  ];

  return (
    <AppBar 
      position="static" 
      elevation={0}
      sx={{
        backgroundColor: 'white',
        borderBottom: `1px solid ${theme.palette.divider}`,
      }}
    >
      <Container maxWidth="lg">
        <Toolbar disableGutters sx={{ minHeight: '64px' }}>
          <Typography 
            variant="h6" 
            component="div"
            sx={{ 
              flexGrow: 1,
              color: theme.palette.primary.main,
              fontWeight: 700,
              letterSpacing: '-0.5px'
            }}
          >
            Demo
          </Typography>
          
          <Box sx={{ display: 'flex', gap: 1 }}>
            {navItems.map(({ path, label, icon }) => (
              <Button
                key={path}
                component={Link}
                to={path}
                startIcon={icon}
                sx={{
                  px: 2,
                  py: 1,
                  borderRadius: 1,
                  textTransform: 'none',
                  color: isActive(path) ? 'primary.main' : 'text.secondary',
                  backgroundColor: isActive(path) ? 'primary.lighter' : 'transparent',
                  '&:hover': {
                    backgroundColor: isActive(path) 
                      ? 'primary.lighter'
                      : 'action.hover',
                  },
                  fontWeight: isActive(path) ? 600 : 400,
                }}
              >
                {label}
              </Button>
            ))}
            
            <Button
              onClick={handleLogout}
              startIcon={<Logout fontSize="small" />}
              sx={{
                ml: 1,
                px: 2,
                py: 1,
                borderRadius: 1,
                textTransform: 'none',
                color: 'error.main',
                '&:hover': {
                  backgroundColor: 'error.lighter',
                },
              }}
            >
              Logout
            </Button>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Navbar;