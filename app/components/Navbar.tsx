"use client";
import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { AccountCircleOutlined, TrendingUp } from '@mui/icons-material';

const Navbar: React.FC = () => {
  return (
    <AppBar 
      position="sticky" 
      sx={{ 
        background: 'rgba(10, 14, 26, 0.8)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(148, 163, 184, 0.1)',
        boxShadow: 'none',
      }}
    >
      <Toolbar sx={{ 
        maxWidth: '1400px', 
        width: '100%', 
        margin: '0 auto',
        padding: '8px 24px',
      }}>
        {/* Logo */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexGrow: 1 }}>
          <Box
            sx={{
              width: 40,
              height: 40,
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #22d3ee 0%, #a855f7 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 20px rgba(34, 211, 238, 0.3)',
            }}
          >
            <TrendingUp sx={{ color: '#0a0e1a', fontSize: 24 }} />
          </Box>
          <Typography 
            variant="h5" 
            sx={{ 
              fontWeight: 800,
              background: 'linear-gradient(135deg, #22d3ee 0%, #a855f7 50%, #ec4899 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              letterSpacing: '-0.02em',
            }}
          >
            Quantex
          </Typography>
        </Box>

        {/* Navigation Links */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, mr: 4 }}>
          {['Markets', 'Trade', 'Portfolio', 'Learn'].map((item) => (
            <Typography
              key={item}
              sx={{
                color: 'var(--text-secondary)',
                cursor: 'pointer',
                fontWeight: 500,
                fontSize: '0.95rem',
                transition: 'all 0.2s ease',
                position: 'relative',
                '&:hover': {
                  color: 'var(--text-primary)',
                },
                '&::after': {
                  content: '""',
                  position: 'absolute',
                  bottom: -4,
                  left: 0,
                  width: '0%',
                  height: '2px',
                  background: 'linear-gradient(90deg, #22d3ee, #a855f7)',
                  transition: 'width 0.3s ease',
                },
                '&:hover::after': {
                  width: '100%',
                },
              }}
            >
              {item}
            </Typography>
          ))}
        </Box>

        {/* Auth Buttons */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Button 
            sx={{ 
              color: 'var(--text-secondary)',
              fontWeight: 600,
              textTransform: 'none',
              fontSize: '0.95rem',
              transition: 'all 0.2s ease',
              '&:hover': {
                color: 'var(--text-primary)',
                background: 'transparent',
              },
            }}
          >
            Log In
          </Button>
          <Button 
            sx={{ 
              background: 'linear-gradient(135deg, #22d3ee 0%, #a855f7 100%)',
              color: '#0a0e1a',
              fontWeight: 700,
              textTransform: 'none',
              fontSize: '0.95rem',
              borderRadius: '50px',
              padding: '8px 24px',
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'scale(1.05)',
                boxShadow: '0 0 30px rgba(34, 211, 238, 0.4)',
              },
            }}
          >
            Sign Up
          </Button>
          <Box
            sx={{
              width: 40,
              height: 40,
              borderRadius: '50%',
              border: '2px solid rgba(34, 211, 238, 0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              ml: 1,
              '&:hover': {
                borderColor: '#22d3ee',
                boxShadow: '0 0 20px rgba(34, 211, 238, 0.3)',
              },
            }}
          >
            <AccountCircleOutlined sx={{ color: '#22d3ee', fontSize: 24 }} />
          </Box>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
