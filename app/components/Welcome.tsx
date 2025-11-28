"use client";
import React from 'react';
import { Box, Typography, Button, Stack } from '@mui/material';
import Image from 'next/image';
import btcIcon from '../public/icons/btc.png'; 
import ethIcon from '../public/icons/eth.png'; 
import dotIcon from '../public/icons/dot.png';
import { TrendingUp, TrendingDown, Bolt } from '@mui/icons-material';

interface CoinCardProps {
  icon: typeof btcIcon;
  name: string;
  symbol: string;
  change: number;
  delay: number;
}

const CoinCard: React.FC<CoinCardProps> = ({ icon, name, symbol, change, delay }) => {
  const isPositive = change > 0;
  
  return (
    <Box 
      sx={{ 
        background: 'rgba(30, 41, 59, 0.5)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        border: '1px solid rgba(148, 163, 184, 0.1)',
        padding: '24px',
        borderRadius: '20px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        height: '180px',
        width: '150px',
        position: 'relative',
        overflow: 'hidden',
        cursor: 'pointer',
        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
        animation: `fadeInUp 0.6s ease-out ${delay}ms forwards`,
        opacity: 0,
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '3px',
          background: isPositive 
            ? 'linear-gradient(90deg, #10b981, #22d3ee)' 
            : 'linear-gradient(90deg, #ef4444, #f97316)',
          opacity: 0,
          transition: 'opacity 0.3s ease',
        },
        '&:hover': {
          transform: 'translateY(-12px) scale(1.02)',
          border: '1px solid rgba(34, 211, 238, 0.3)',
          boxShadow: isPositive 
            ? '0 25px 50px rgba(16, 185, 129, 0.2)' 
            : '0 25px 50px rgba(239, 68, 68, 0.2)',
        },
        '&:hover::before': {
          opacity: 1,
        },
      }}
    >
      {/* Glow effect */}
      <Box
        sx={{
          position: 'absolute',
          top: -50,
          right: -50,
          width: 100,
          height: 100,
          borderRadius: '50%',
          background: isPositive 
            ? 'radial-gradient(circle, rgba(16, 185, 129, 0.15), transparent 70%)' 
            : 'radial-gradient(circle, rgba(239, 68, 68, 0.15), transparent 70%)',
          pointerEvents: 'none',
        }}
      />
      
      <Box sx={{ position: 'relative', zIndex: 1 }}>
        <Box
          sx={{
            width: 48,
            height: 48,
            borderRadius: '14px',
            background: 'rgba(15, 23, 42, 0.6)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 2,
            border: '1px solid rgba(148, 163, 184, 0.1)',
          }}
        >
          <Image src={icon} alt={name} style={{ width: '32px', height: '32px' }} />
        </Box>
        <Typography 
          sx={{ 
            color: 'var(--text-primary)', 
            fontWeight: 700, 
            fontSize: '1.1rem',
            letterSpacing: '-0.01em',
          }}
        >
          {symbol}
        </Typography>
        <Typography 
          sx={{ 
            color: 'var(--text-muted)', 
            fontSize: '0.8rem',
            marginTop: 0.5,
          }}
        >
          {name}
        </Typography>
      </Box>
      
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
        {isPositive ? (
          <TrendingUp sx={{ color: '#10b981', fontSize: 18 }} />
        ) : (
          <TrendingDown sx={{ color: '#ef4444', fontSize: 18 }} />
        )}
        <Typography 
          sx={{ 
            color: isPositive ? '#10b981' : '#ef4444',
            fontWeight: 700,
            fontSize: '1rem',
            fontFamily: 'var(--font-geist-mono)',
            textShadow: isPositive 
              ? '0 0 10px rgba(16, 185, 129, 0.5)' 
              : '0 0 10px rgba(239, 68, 68, 0.5)',
          }}
        >
          {isPositive ? '+' : ''}{change.toFixed(2)}%
        </Typography>
      </Box>
    </Box>
  );
};

const WelcomeSection: React.FC = () => {
  return (
    <Box 
      sx={{ 
        padding: '60px 40px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        maxWidth: '1400px',
        margin: '0 auto',
        minHeight: '400px',
        position: 'relative',
      }}
    >
      {/* Left Content */}
      <Box 
        sx={{ 
          textAlign: 'left',
          maxWidth: '550px',
          animation: 'slideInLeft 0.8s ease-out forwards',
        }}
      >
        {/* Badge */}
        <Box
          sx={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 1,
            background: 'rgba(34, 211, 238, 0.1)',
            border: '1px solid rgba(34, 211, 238, 0.2)',
            borderRadius: '50px',
            padding: '6px 16px',
            marginBottom: 3,
          }}
        >
          <Bolt sx={{ color: '#22d3ee', fontSize: 16 }} />
          <Typography sx={{ color: '#22d3ee', fontSize: '0.85rem', fontWeight: 600 }}>
            Canada's #1 Crypto Platform
          </Typography>
        </Box>
        
        <Typography 
          variant="h2" 
          sx={{
            fontWeight: 800,
            fontSize: { xs: '2.5rem', md: '3.5rem' },
            lineHeight: 1.1,
            marginBottom: 2,
            letterSpacing: '-0.03em',
          }}
        >
          Welcome to{' '}
          <Box
            component="span"
            sx={{
              background: 'linear-gradient(135deg, #22d3ee 0%, #a855f7 50%, #ec4899 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            Quantex
          </Box>
        </Typography>
        
        <Typography 
          variant="h5" 
          sx={{
            fontWeight: 500,
            color: 'var(--text-secondary)',
            marginBottom: 4,
            lineHeight: 1.6,
          }}
        >
          Trade crypto with confidence. Low fees, instant deposits, and top-tier security for Canadian traders.
        </Typography>
        
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          <Button 
            sx={{ 
              background: 'linear-gradient(135deg, #22d3ee 0%, #a855f7 100%)',
              color: '#0a0e1a',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              fontSize: '0.9rem',
              borderRadius: '50px',
              padding: '14px 36px',
              transition: 'all 0.3s ease',
              position: 'relative',
              overflow: 'hidden',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: '-100%',
                width: '100%',
                height: '100%',
                background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)',
                transition: 'left 0.5s ease',
              },
              '&:hover::before': {
                left: '100%',
              },
              '&:hover': {
                transform: 'scale(1.05)',
                boxShadow: '0 15px 40px rgba(34, 211, 238, 0.4)',
              },
            }}
          >
            Start Trading
          </Button>
          
          <Button 
            sx={{ 
              background: 'transparent',
              color: 'var(--text-secondary)',
              fontWeight: 600,
              textTransform: 'none',
              fontSize: '0.95rem',
              borderRadius: '50px',
              padding: '14px 24px',
              border: '1px solid rgba(148, 163, 184, 0.2)',
              transition: 'all 0.3s ease',
              '&:hover': {
                borderColor: 'var(--accent-primary)',
                color: 'var(--text-primary)',
                background: 'rgba(34, 211, 238, 0.05)',
              },
            }}
          >
            Learn More →
          </Button>
        </Box>

        {/* Stats */}
        <Box sx={{ display: 'flex', gap: 5, marginTop: 5 }}>
          {[
            { value: '$2B+', label: 'Trading Volume' },
            { value: '500K+', label: 'Active Users' },
            { value: '70+', label: 'Cryptocurrencies' },
          ].map((stat, i) => (
            <Box key={i}>
              <Typography 
                sx={{ 
                  fontWeight: 800, 
                  fontSize: '1.5rem',
                  background: 'linear-gradient(135deg, #22d3ee 0%, #a855f7 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                {stat.value}
              </Typography>
              <Typography sx={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                {stat.label}
              </Typography>
            </Box>
          ))}
        </Box>
      </Box>

      {/* Right side - Crypto cards */}
      <Stack direction="row" spacing={3} sx={{ position: 'relative' }}>
        {/* Decorative blur */}
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 300,
            height: 300,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(168, 85, 247, 0.15), transparent 70%)',
            filter: 'blur(40px)',
            pointerEvents: 'none',
          }}
        />
        
        <CoinCard 
          icon={btcIcon} 
          name="Bitcoin" 
          symbol="BTC" 
          change={123.45} 
          delay={100}
        />
        <CoinCard 
          icon={ethIcon} 
          name="Ethereum" 
          symbol="ETH" 
          change={-2.76} 
          delay={200}
        />
        <CoinCard 
          icon={dotIcon} 
          name="Polkadot" 
          symbol="DOT" 
          change={14.43} 
          delay={300}
        />
      </Stack>
    </Box>
  );
};

export default WelcomeSection;
