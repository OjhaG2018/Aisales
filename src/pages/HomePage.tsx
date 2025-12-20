import React from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  AppBar,
  Toolbar,
  useTheme,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import PhoneIcon from '@mui/icons-material/Phone';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import AnalyticsIcon from '@mui/icons-material/Analytics';
import GroupIcon from '@mui/icons-material/Group';

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const theme = useTheme();

  const features = [
    {
      icon: <SmartToyIcon sx={{ fontSize: 40, color: theme.palette.primary.main }} />,
      title: 'AI-Powered Conversations',
      description: 'Natural language processing with advanced AI models for human-like interactions.',
    },
    {
      icon: <PhoneIcon sx={{ fontSize: 40, color: theme.palette.secondary.main }} />,
      title: 'Voice Calling',
      description: 'Automated outbound calling with real-time conversation capabilities.',
    },
    {
      icon: <GroupIcon sx={{ fontSize: 40, color: theme.palette.primary.main }} />,
      title: 'Lead Management',
      description: 'Comprehensive lead tracking with BANT qualification and follow-up automation.',
    },
    {
      icon: <AnalyticsIcon sx={{ fontSize: 40, color: theme.palette.secondary.main }} />,
      title: 'Advanced Analytics',
      description: 'Real-time insights and performance metrics for your sales campaigns.',
    },
  ];

  return (
    <Box>
      {/* Header */}
      <AppBar position="static" sx={{ background: 'linear-gradient(310deg, #7928ca 0%, #ff0080 100%)' }}>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 600 }}>
            AI Sales Agent
          </Typography>
          <Button color="inherit" onClick={() => navigate('/login')} sx={{ mr: 2 }}>
            Login
          </Button>
          <Button 
            variant="outlined" 
            color="inherit" 
            onClick={() => navigate('/signup')}
            sx={{ borderColor: 'white' }}
          >
            Sign Up
          </Button>
        </Toolbar>
      </AppBar>

      {/* Hero Section */}
      <Box
        sx={{
          background: 'linear-gradient(310deg, #7928ca 0%, #ff0080 100%)',
          color: 'white',
          py: 10,
          textAlign: 'center',
        }}
      >
        <Container maxWidth="md">
          <Typography variant="h2" component="h1" gutterBottom sx={{ fontWeight: 700, mb: 3 }}>
            AI-Powered Sales Calling Platform
          </Typography>
          <Typography variant="h5" sx={{ mb: 4, opacity: 0.9 }}>
            Automate your sales calls with intelligent AI agents that sound human and convert leads
          </Typography>
          <Button
            variant="contained"
            size="large"
            onClick={() => navigate('/signup')}
            sx={{
              backgroundColor: 'white',
              color: theme.palette.primary.main,
              px: 4,
              py: 1.5,
              fontSize: '1.1rem',
              fontWeight: 600,
            }}
          >
            Get Started Free
          </Button>
        </Container>
      </Box>

      {/* Features Section */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Typography variant="h3" component="h2" textAlign="center" gutterBottom sx={{ mb: 6, fontWeight: 600 }}>
          Why Choose AI Sales Agent?
        </Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
          {features.map((feature, index) => (
            <Box key={index} sx={{ flex: '1 1 400px' }}>
              <Card
                sx={{
                  height: '100%',
                  p: 3,
                  borderRadius: 3,
                  boxShadow: '0 20px 27px 0 rgba(0, 0, 0, 0.05)',
                  transition: 'transform 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                  },
                }}
              >
                <CardContent>
                  <Box sx={{ mb: 2 }}>{feature.icon}</Box>
                  <Typography variant="h5" component="h3" gutterBottom sx={{ fontWeight: 600 }}>
                    {feature.title}
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    {feature.description}
                  </Typography>
                </CardContent>
              </Card>
            </Box>
          ))}
        </Box>
      </Container>

      {/* Stats Section */}
      <Box sx={{ backgroundColor: '#f8f9fa', py: 8 }}>
        <Container maxWidth="lg">
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 4, textAlign: 'center', justifyContent: 'center' }}>
            <Box sx={{ flex: '1 1 200px' }}>
              <Typography variant="h3" sx={{ fontWeight: 700, color: theme.palette.primary.main, mb: 1 }}>
                10K+
              </Typography>
              <Typography variant="h6" color="text.secondary">
                Calls Made Daily
              </Typography>
            </Box>
            <Box sx={{ flex: '1 1 200px' }}>
              <Typography variant="h3" sx={{ fontWeight: 700, color: theme.palette.secondary.main, mb: 1 }}>
                85%
              </Typography>
              <Typography variant="h6" color="text.secondary">
                Connection Rate
              </Typography>
            </Box>
            <Box sx={{ flex: '1 1 200px' }}>
              <Typography variant="h3" sx={{ fontWeight: 700, color: theme.palette.primary.main, mb: 1 }}>
                500+
              </Typography>
              <Typography variant="h6" color="text.secondary">
                Happy Customers
              </Typography>
            </Box>
            <Box sx={{ flex: '1 1 200px' }}>
              <Typography variant="h3" sx={{ fontWeight: 700, color: theme.palette.secondary.main, mb: 1 }}>
                24/7
              </Typography>
              <Typography variant="h6" color="text.secondary">
                AI Availability
              </Typography>
            </Box>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default HomePage;