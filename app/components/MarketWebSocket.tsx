"use client"; 
import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import { 
  Box, 
  IconButton, 
  InputAdornment, 
  Paper, 
  Switch, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  TextField, 
  Typography,
  Chip,
  Collapse,
  Button,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import StarOutlineIcon from '@mui/icons-material/StarOutline';
import StarIcon from '@mui/icons-material/Star';
import SignalCellularAltIcon from '@mui/icons-material/SignalCellularAlt';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import UnfoldMoreIcon from '@mui/icons-material/UnfoldMore';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { coins } from '../assets/coins';

// Sort types
type SortField = 'coin' | 'price' | 'change' | null;
type SortDirection = 'asc' | 'desc';
import coinImages from '../public/icons/';

interface MarketData {
  symbol: string;
  bid: number;
  ask: number;
  spot: number;
  change: number;
}

// CAD to USD exchange rate
const CAD_TO_USD_RATE = 0.71;

// Mini sparkline chart component
const MiniChart: React.FC<{ isPositive: boolean; seed: number }> = ({ isPositive, seed }) => {
  // Generate pseudo-random chart points based on seed
  const points: number[] = [];
  let value = 50;
  for (let i = 0; i < 20; i++) {
    value += Math.sin(seed * i * 0.5) * 10 + (Math.cos(seed + i) * 5);
    value = Math.max(10, Math.min(90, value));
    points.push(value);
  }
  
  const pathData = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${i * 5} ${100 - p}`).join(' ');
  const color = isPositive ? '#10b981' : '#ef4444';
  
  return (
    <svg width="100" height="40" viewBox="0 0 100 100" preserveAspectRatio="none">
      <defs>
        <linearGradient id={`gradient-${seed}`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={color} stopOpacity="0.3" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path
        d={`${pathData} L 95 100 L 0 100 Z`}
        fill={`url(#gradient-${seed})`}
      />
      <path
        d={pathData}
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

// Larger chart for expanded view
const ExpandedChart: React.FC<{ isPositive: boolean; seed: number }> = ({ isPositive, seed }) => {
  const points: number[] = [];
  let value = 50;
  for (let i = 0; i < 50; i++) {
    value += Math.sin(seed * i * 0.3) * 8 + (Math.cos(seed + i * 0.5) * 4);
    value = Math.max(15, Math.min(85, value));
    points.push(value);
  }
  
  const pathData = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${i * 4} ${100 - p}`).join(' ');
  const color = isPositive ? '#10b981' : '#ef4444';
  
  return (
    <svg width="100%" height="120" viewBox="0 0 200 100" preserveAspectRatio="none">
      <defs>
        <linearGradient id={`gradient-exp-${seed}`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={color} stopOpacity="0.4" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path
        d={`${pathData} L 196 100 L 0 100 Z`}
        fill={`url(#gradient-exp-${seed})`}
      />
      <path
        d={pathData}
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

// Expandable Row Component
interface CoinRowProps {
  data: MarketData;
  index: number;
  showUSD: boolean;
  formatPrice: (price: number) => string;
}

const CoinRow: React.FC<CoinRowProps> = ({ data, index, showUSD, formatPrice }) => {
  const [expanded, setExpanded] = useState(false);
  const [starred, setStarred] = useState(false);
  
  const fullName = data.symbol.split('_')[0].toLowerCase();
  const quoteSymbol = showUSD ? 'USD' : data.symbol.split('_')[1].toUpperCase();
  const baseSymbol = coins[fullName as keyof typeof coins];
  const isPositive = data.change > 0;
  const seed = fullName.charCodeAt(0) + (fullName.charCodeAt(1) || 0);
  
  // Calculate "With $100 get" amount
  const amountFor100 = data.spot > 0 ? (100 / data.spot) : 0;
  
  // Mock data for expanded view
  const marketCap = data.spot * (19000000 + seed * 100000);
  const circulatingSupply = 19000000 + seed * 100000;
  
  return (
    <>
      <TableRow 
        sx={{ 
          transition: 'all 0.2s ease',
          cursor: 'pointer',
          '&:hover': { 
            background: 'rgba(34, 211, 238, 0.03)',
          },
          ...(expanded && {
            background: 'rgba(34, 211, 238, 0.05)',
          }),
        }}
        onClick={() => setExpanded(!expanded)}
      >
        {/* Expand Arrow */}
        <TableCell 
          sx={{ 
            borderBottom: expanded ? 'none' : '1px solid rgba(148, 163, 184, 0.05)',
            padding: '12px 8px 12px 16px',
            width: 40,
          }}
        >
          <IconButton
            size="small"
            sx={{
              color: 'var(--text-muted)',
              transition: 'all 0.3s ease',
              transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)',
            }}
          >
            <KeyboardArrowDownIcon />
          </IconButton>
        </TableCell>
        
        {/* Coin Info */}
        <TableCell 
          sx={{ 
            borderBottom: expanded ? 'none' : '1px solid rgba(148, 163, 184, 0.05)',
            padding: '12px 16px',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box
              sx={{
                width: 48,
                height: 48,
                borderRadius: '50%',
                background: 'linear-gradient(135deg, rgba(34, 211, 238, 0.1), rgba(168, 85, 247, 0.1))',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '1px solid rgba(148, 163, 184, 0.1)',
              }}
            >
              <Image
                src={coinImages[fullName as keyof typeof coinImages]}
                alt={`${baseSymbol} logo`}
                width={32}
                height={32}
              />
            </Box>
            <Box>
              <Typography 
                sx={{ 
                  color: 'var(--text-primary)', 
                  fontWeight: 700,
                  fontSize: '1rem',
                }}
              >
                {baseSymbol?.charAt(0).toUpperCase() + baseSymbol?.slice(1)}
              </Typography>
              <Typography 
                sx={{ 
                  color: 'var(--text-muted)', 
                  fontSize: '0.8rem',
                  textTransform: 'uppercase',
                }}
              >
                {fullName.toUpperCase()} / {quoteSymbol}
              </Typography>
            </Box>
          </Box>
        </TableCell>
        
        {/* Mini Chart */}
        <TableCell 
          sx={{ 
            borderBottom: expanded ? 'none' : '1px solid rgba(148, 163, 184, 0.05)',
            padding: '12px 16px',
          }}
        >
          <Box sx={{ opacity: 0.9 }}>
            <MiniChart isPositive={isPositive} seed={seed} />
          </Box>
        </TableCell>
        
        {/* Live Price */}
        <TableCell 
          sx={{ 
            color: 'var(--text-primary)', 
            borderBottom: expanded ? 'none' : '1px solid rgba(148, 163, 184, 0.05)',
            padding: '12px 16px',
            fontWeight: 600,
            fontFamily: 'var(--font-geist-mono)',
            fontSize: '1rem',
          }}
        >
          {formatPrice(data.spot)}
        </TableCell>
        
        {/* Network */}
        <TableCell 
          sx={{ 
            borderBottom: expanded ? 'none' : '1px solid rgba(148, 163, 184, 0.05)',
            padding: '12px 16px',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <Typography sx={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
              {baseSymbol?.charAt(0).toUpperCase() + baseSymbol?.slice(1)}
            </Typography>
            {index % 3 === 1 && (
              <Typography 
                sx={{ 
                  color: '#22d3ee', 
                  fontSize: '0.8rem',
                  cursor: 'pointer',
                  '&:hover': { textDecoration: 'underline' },
                }}
                onClick={(e) => e.stopPropagation()}
              >
                + more...
              </Typography>
            )}
          </Box>
        </TableCell>
        
        {/* 24h Change */}
        <TableCell 
          sx={{ 
            borderBottom: expanded ? 'none' : '1px solid rgba(148, 163, 184, 0.05)',
            padding: '12px 16px',
          }}
        >
          <Typography 
            sx={{ 
              color: isPositive ? '#10b981' : '#ef4444',
              fontWeight: 700,
              fontFamily: 'var(--font-geist-mono)',
              fontSize: '1rem',
            }}
          >
            {isPositive ? '+' : ''}{data.change.toFixed(2)}%
          </Typography>
        </TableCell>
        
        {/* Star */}
        <TableCell 
          sx={{ 
            borderBottom: expanded ? 'none' : '1px solid rgba(148, 163, 184, 0.05)',
            padding: '12px 16px',
            width: 60,
          }}
        >
          <IconButton
            onClick={(e) => {
              e.stopPropagation();
              setStarred(!starred);
            }}
            sx={{
              color: starred ? '#fbbf24' : 'var(--text-muted)',
              transition: 'all 0.3s ease',
              '&:hover': {
                color: '#fbbf24',
                transform: 'scale(1.1)',
              },
            }}
          >
            {starred ? <StarIcon /> : <StarOutlineIcon />}
          </IconButton>
        </TableCell>
      </TableRow>
      
      {/* Expanded Content */}
      <TableRow>
        <TableCell 
          colSpan={7} 
          sx={{ 
            padding: 0, 
            borderBottom: '1px solid rgba(148, 163, 184, 0.05)',
          }}
        >
          <Collapse in={expanded} timeout="auto" unmountOnExit>
            <Box 
              sx={{ 
                padding: '16px 32px 32px 32px',
                background: 'rgba(15, 23, 42, 0.4)',
              }}
            >
              <Box 
                sx={{ 
                  display: 'grid',
                  gridTemplateColumns: '1.2fr 1fr',
                  gap: 4,
                }}
              >
                {/* Left Panel - Chart & Stats */}
                <Box
                  sx={{
                    background: 'rgba(30, 41, 59, 0.5)',
                    backdropFilter: 'blur(12px)',
                    borderRadius: '16px',
                    padding: '28px',
                    border: '1px solid rgba(148, 163, 184, 0.1)',
                  }}
                >
                  <Typography sx={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: 3 }}>
                    Last 24h
                  </Typography>
                  <Box sx={{ marginBottom: 4, marginLeft: -1, marginRight: -1 }}>
                    <ExpandedChart isPositive={isPositive} seed={seed} />
                  </Box>
                  
                  <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 4, marginTop: 2 }}>
                    <Box>
                      <Typography sx={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: 1 }}>
                        Buy price
                      </Typography>
                      <Typography sx={{ color: 'var(--text-primary)', fontWeight: 700, fontFamily: 'var(--font-geist-mono)', fontSize: '1.1rem' }}>
                        {formatPrice(data.ask)}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography sx={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: 1 }}>
                        Market cap
                      </Typography>
                      <Typography sx={{ color: 'var(--text-primary)', fontWeight: 600, fontFamily: 'var(--font-geist-mono)', fontSize: '1.1rem' }}>
                        {showUSD ? 'US$' : 'CA$'}{(marketCap * (showUSD ? CAD_TO_USD_RATE : 1)).toLocaleString('en-US', { notation: 'compact', maximumFractionDigits: 2 })}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography sx={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: 1 }}>
                        Sell price
                      </Typography>
                      <Typography sx={{ color: 'var(--text-primary)', fontWeight: 700, fontFamily: 'var(--font-geist-mono)', fontSize: '1.1rem' }}>
                        {formatPrice(data.bid)}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography sx={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: 1 }}>
                        Circulating supply
                      </Typography>
                      <Typography sx={{ color: 'var(--text-primary)', fontWeight: 600, fontFamily: 'var(--font-geist-mono)', fontSize: '1.1rem' }}>
                        {circulatingSupply.toLocaleString('en-US')}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
                
                {/* Right Panel - Buy Calculator */}
                <Box
                  sx={{
                    background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.6), rgba(30, 41, 59, 0.4))',
                    backdropFilter: 'blur(12px)',
                    borderRadius: '16px',
                    padding: '40px 32px',
                    border: '1px solid rgba(148, 163, 184, 0.1)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    textAlign: 'center',
                    minHeight: '280px',
                  }}
                >
                  <Typography sx={{ color: 'var(--text-muted)', fontSize: '1rem', marginBottom: 2 }}>
                    With {showUSD ? 'US$100' : 'CA$100'} get
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1.5, marginBottom: 2 }}>
                    <Typography 
                      sx={{ 
                        fontWeight: 800, 
                        fontSize: '2.5rem',
                        fontFamily: 'var(--font-geist-mono)',
                        background: 'linear-gradient(135deg, #22d3ee 0%, #10b981 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text',
                      }}
                    >
                      {amountFor100.toFixed(amountFor100 < 1 ? 5 : 2)}
                    </Typography>
                    <Typography 
                      sx={{ 
                        fontWeight: 700, 
                        fontSize: '1.5rem',
                        color: '#22d3ee',
                        textTransform: 'uppercase',
                      }}
                    >
                      {baseSymbol}
                    </Typography>
                  </Box>
                  <Typography sx={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: 4 }}>
                    Prices fluctuate all the time
                  </Typography>
                  
                  <Box sx={{ display: 'flex', gap: 3, alignItems: 'center' }}>
                    <Button
                      onClick={(e) => e.stopPropagation()}
                      sx={{
                        background: 'linear-gradient(135deg, #10b981 0%, #22d3ee 100%)',
                        color: '#0a0e1a',
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em',
                        borderRadius: '50px',
                        padding: '14px 36px',
                        fontSize: '0.95rem',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          transform: 'scale(1.05)',
                          boxShadow: '0 10px 30px rgba(16, 185, 129, 0.4)',
                        },
                      }}
                    >
                      Buy {baseSymbol?.toUpperCase()}
                    </Button>
                    <Typography 
                      onClick={(e) => e.stopPropagation()}
                      sx={{ 
                        color: '#22d3ee', 
                        fontSize: '0.95rem',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 0.5,
                        fontWeight: 500,
                        '&:hover': { 
                          textDecoration: 'underline',
                        },
                      }}
                    >
                      How to buy →
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
};

const MarketWebSocket: React.FC = () => {
  const [marketData, setMarketData] = useState<MarketData[]>([]);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showUSD, setShowUSD] = useState(false);
  const [sortField, setSortField] = useState<SortField>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');

  // Handle sort click
  const handleSort = (field: SortField) => {
    if (sortField === field) {
      // Toggle direction or clear sort
      if (sortDirection === 'asc') {
        setSortDirection('desc');
      } else {
        setSortField(null);
        setSortDirection('asc');
      }
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };
  
  useEffect(() => {
    const storedData = localStorage.getItem('marketData');
    if (storedData) {
      setMarketData(JSON.parse(storedData));
    }

    const connectWebSocket = () => {
      const socket = new WebSocket('ws://localhost:8765/markets/ws');

      socket.onopen = () => {
        console.log('WebSocket connection established');
        setIsConnected(true);
        const subscriptionMessage = JSON.stringify({ event: 'subscribe', channel: 'rates' });
        socket.send(subscriptionMessage);
      };

      socket.onmessage = (event) => {
        const receivedData = JSON.parse(event.data);

        if (receivedData.channel === "rates" && receivedData.event === "data") {
          const data = receivedData.data;
          setMarketData(prevData => {
            const existingItemIndex = prevData.findIndex(item => item.symbol === data.symbol);
            let updatedData;
            if (existingItemIndex > -1) {
              updatedData = [...prevData];
              updatedData[existingItemIndex] = { ...updatedData[existingItemIndex], ...data };
            } else {
              updatedData = [...prevData, data];
            }
            localStorage.setItem('marketData', JSON.stringify(updatedData));
            return updatedData;
          });
        }
      };

      socket.onerror = (error) => {
        console.error('WebSocket error:', error);
      };

      socket.onclose = (event) => {
        console.log('WebSocket connection closed:', event.reason);
        setIsConnected(false);
        setTimeout(connectWebSocket, 5000);
      };

      return () => {
        socket.close();
      };
    };

    connectWebSocket();
  }, []);

  const filteredData = marketData.filter(data => {
    const fullName = data.symbol.split('_')[0].toLowerCase();
    const baseSymbol = coins[fullName as keyof typeof coins];
    return (
      fullName.includes(searchTerm.toLowerCase()) ||
      (baseSymbol && baseSymbol.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  });

  // Sort the filtered data
  const sortedData = [...filteredData].sort((a, b) => {
    if (!sortField) return 0;
    
    let comparison = 0;
    
    switch (sortField) {
      case 'coin':
        const nameA = coins[a.symbol.split('_')[0].toLowerCase() as keyof typeof coins] || a.symbol;
        const nameB = coins[b.symbol.split('_')[0].toLowerCase() as keyof typeof coins] || b.symbol;
        comparison = nameA.localeCompare(nameB);
        break;
      case 'price':
        comparison = a.spot - b.spot;
        break;
      case 'change':
        comparison = a.change - b.change;
        break;
      default:
        return 0;
    }
    
    return sortDirection === 'asc' ? comparison : -comparison;
  });

  const formatPrice = (price: number): string => {
    const convertedPrice = showUSD ? price * CAD_TO_USD_RATE : price;
    const currencySymbol = showUSD ? 'US$' : 'CA$';
    return `${currencySymbol}${convertedPrice.toLocaleString('en-US', { 
      minimumFractionDigits: 2, 
      maximumFractionDigits: 2 
    })}`;
  };

  return (
    <Box 
      sx={{ 
        padding: '40px',
        maxWidth: '1400px',
        margin: '0 auto',
      }}
    >
      {/* Section Header */}
      <Box sx={{ marginBottom: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, marginBottom: 1 }}>
          <SignalCellularAltIcon sx={{ color: '#22d3ee', fontSize: 28 }} />
          <Typography 
            variant="h4" 
            sx={{ 
              fontWeight: 800,
              letterSpacing: '-0.02em',
            }}
          >
            Live Markets
          </Typography>
          <Chip
            label={isConnected ? 'Live' : 'Reconnecting...'}
            size="small"
            sx={{
              background: isConnected 
                ? 'rgba(16, 185, 129, 0.15)' 
                : 'rgba(239, 68, 68, 0.15)',
              color: isConnected ? '#10b981' : '#ef4444',
              border: `1px solid ${isConnected ? 'rgba(16, 185, 129, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`,
              fontWeight: 600,
              fontSize: '0.75rem',
            }}
          />
        </Box>
        <Typography sx={{ color: 'var(--text-secondary)', fontSize: '1rem' }}>
          Click any row to view detailed information and quick buy options
        </Typography>
      </Box>

      {/* Controls */}
      <Box 
        sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          marginBottom: 3,
          gap: 3,
          flexWrap: 'wrap',
        }}
      >
        <TextField
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search coins..."
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: 'var(--text-muted)' }} />
              </InputAdornment>
            ),
          }}
          sx={{
            flex: 1,
            maxWidth: '400px',
            '& .MuiOutlinedInput-root': {
              background: 'rgba(30, 41, 59, 0.5)',
              backdropFilter: 'blur(12px)',
              borderRadius: '14px',
              border: '1px solid rgba(148, 163, 184, 0.1)',
              transition: 'all 0.3s ease',
              '& fieldset': { border: 'none' },
              '&:hover': { borderColor: 'rgba(34, 211, 238, 0.3)' },
              '&.Mui-focused': {
                borderColor: '#22d3ee',
                boxShadow: '0 0 20px rgba(34, 211, 238, 0.2)',
              },
            },
            '& input': { 
              color: 'var(--text-primary)',
              padding: '12px 16px',
            },
          }}
        />
        
        <Box 
          sx={{ 
            display: 'flex', 
            alignItems: 'center',
            gap: 1.5,
            background: showUSD ? 'rgba(34, 211, 238, 0.1)' : 'rgba(30, 41, 59, 0.5)',
            backdropFilter: 'blur(12px)',
            borderRadius: '14px',
            padding: '8px 16px',
            border: showUSD ? '1px solid rgba(34, 211, 238, 0.3)' : '1px solid rgba(148, 163, 184, 0.1)',
            transition: 'all 0.3s ease',
            cursor: 'pointer',
          }}
          onClick={() => setShowUSD(!showUSD)}
        >
          <AttachMoneyIcon sx={{ color: showUSD ? '#22d3ee' : 'var(--text-muted)', fontSize: 20 }} />
          <Typography sx={{ color: showUSD ? '#22d3ee' : 'var(--text-secondary)', fontSize: '0.9rem', fontWeight: showUSD ? 600 : 400 }}>
            {showUSD ? '🇺🇸 USD' : '🇨🇦 CAD'}
          </Typography>
          <Switch
            checked={showUSD}
            size="small"
            sx={{
              '& .MuiSwitch-switchBase.Mui-checked': { color: '#22d3ee' },
              '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { backgroundColor: '#22d3ee' },
            }}
          />
        </Box>
      </Box>

      {/* Table */}
      {marketData.length > 0 ? (
        <TableContainer 
          component={Paper} 
          sx={{ 
            background: 'rgba(15, 23, 42, 0.6)',
            backdropFilter: 'blur(20px)',
            borderRadius: '20px',
            border: '1px solid rgba(148, 163, 184, 0.1)',
            boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)',
            overflow: 'hidden',
          }}
        >
          <Table>
            <TableHead>
              <TableRow sx={{ background: 'rgba(30, 41, 59, 0.5)' }}>
                <TableCell sx={{ width: 40, padding: '16px 8px 16px 16px', borderBottom: '1px solid rgba(148, 163, 184, 0.1)' }} />
                
                {/* Coin - Sortable */}
                <TableCell 
                  onClick={() => handleSort('coin')}
                  sx={{ 
                    color: sortField === 'coin' ? '#22d3ee' : 'var(--text-muted)', 
                    borderBottom: '1px solid rgba(148, 163, 184, 0.1)',
                    fontWeight: 600,
                    fontSize: '0.85rem',
                    padding: '16px',
                    cursor: 'pointer',
                    userSelect: 'none',
                    transition: 'color 0.2s ease',
                    '&:hover': { color: '#22d3ee' },
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    Coin
                    {sortField === 'coin' ? (
                      sortDirection === 'asc' ? 
                        <ArrowUpwardIcon sx={{ fontSize: 18 }} /> : 
                        <ArrowDownwardIcon sx={{ fontSize: 18 }} />
                    ) : (
                      <UnfoldMoreIcon sx={{ fontSize: 18, opacity: 0.5 }} />
                    )}
                  </Box>
                </TableCell>
                
                {/* Last 24h - Not Sortable */}
                <TableCell 
                  sx={{ 
                    color: 'var(--text-muted)', 
                    borderBottom: '1px solid rgba(148, 163, 184, 0.1)',
                    fontWeight: 600,
                    fontSize: '0.85rem',
                    padding: '16px',
                  }}
                >
                  Last 24h
                </TableCell>
                
                {/* Live Price - Sortable */}
                <TableCell 
                  onClick={() => handleSort('price')}
                  sx={{ 
                    color: sortField === 'price' ? '#22d3ee' : 'var(--text-muted)', 
                    borderBottom: '1px solid rgba(148, 163, 184, 0.1)',
                    fontWeight: 600,
                    fontSize: '0.85rem',
                    padding: '16px',
                    cursor: 'pointer',
                    userSelect: 'none',
                    transition: 'color 0.2s ease',
                    '&:hover': { color: '#22d3ee' },
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    Live price
                    {sortField === 'price' ? (
                      sortDirection === 'asc' ? 
                        <ArrowUpwardIcon sx={{ fontSize: 18 }} /> : 
                        <ArrowDownwardIcon sx={{ fontSize: 18 }} />
                    ) : (
                      <UnfoldMoreIcon sx={{ fontSize: 18, opacity: 0.5 }} />
                    )}
                  </Box>
                </TableCell>
                
                {/* Network(s) - Not Sortable */}
                <TableCell 
                  sx={{ 
                    color: 'var(--text-muted)', 
                    borderBottom: '1px solid rgba(148, 163, 184, 0.1)',
                    fontWeight: 600,
                    fontSize: '0.85rem',
                    padding: '16px',
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    Network(s)
                    <InfoOutlinedIcon sx={{ fontSize: 16, color: 'var(--text-muted)' }} />
                  </Box>
                </TableCell>
                
                {/* 24h Change - Sortable */}
                <TableCell 
                  onClick={() => handleSort('change')}
                  sx={{ 
                    color: sortField === 'change' ? '#22d3ee' : 'var(--text-muted)', 
                    borderBottom: '1px solid rgba(148, 163, 184, 0.1)',
                    fontWeight: 600,
                    fontSize: '0.85rem',
                    padding: '16px',
                    cursor: 'pointer',
                    userSelect: 'none',
                    transition: 'color 0.2s ease',
                    '&:hover': { color: '#22d3ee' },
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    24h Change
                    {sortField === 'change' ? (
                      sortDirection === 'asc' ? 
                        <ArrowUpwardIcon sx={{ fontSize: 18 }} /> : 
                        <ArrowDownwardIcon sx={{ fontSize: 18 }} />
                    ) : (
                      <UnfoldMoreIcon sx={{ fontSize: 18, opacity: 0.5 }} />
                    )}
                  </Box>
                </TableCell>
                
                {/* Watch - Empty */}
                <TableCell sx={{ borderBottom: '1px solid rgba(148, 163, 184, 0.1)', padding: '16px' }} />
              </TableRow>
            </TableHead>
            <TableBody>
              {sortedData.map((data, index) => (
                <CoinRow 
                  key={data.symbol} 
                  data={data} 
                  index={index}
                  showUSD={showUSD}
                  formatPrice={formatPrice}
                />
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <Box 
          sx={{ 
            textAlign: 'center', 
            padding: '80px 20px',
            background: 'rgba(15, 23, 42, 0.6)',
            backdropFilter: 'blur(20px)',
            borderRadius: '20px',
            border: '1px solid rgba(148, 163, 184, 0.1)',
          }}
        >
          <SignalCellularAltIcon sx={{ fontSize: 48, color: 'var(--text-muted)', marginBottom: 2 }} />
          <Typography sx={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>
            {isConnected ? 'Loading market data...' : 'Connecting to market feed...'}
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default MarketWebSocket;
