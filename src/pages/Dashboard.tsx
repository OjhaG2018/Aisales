import React from 'react';
import {
  Box,
  Container,
  Card,
  CardContent,
  Button,
  Typography,
} from '@mui/material';
import {
  Campaign as CampaignIcon,
  Phone as PhoneIcon,
  Analytics as AnalyticsIcon,
  Add as AddIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();

  const stats = [
    { title: 'Total Contacts', value: '1,234', color: '#7928ca' },
    { title: 'Active Campaigns', value: '8', color: '#ff0080' },
    { title: 'Calls Today', value: '156', color: '#17c1e8' },
    { title: 'Success Rate', value: '78%', color: '#82d616' },
  ];

  return (
    <Box sx={{ p: 3 }}>
        
      <Container maxWidth="xl">
          {/* Stats Cards */}
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, mb: 4 }}>
            {stats.map((stat, index) => (
              <Box key={index} sx={{ flex: '1 1 250px', minWidth: '250px' }}>
                <Card
                  sx={{
                    background: 'rgba(255, 255, 255, 0.8)',
                    backdropFilter: 'blur(20px)',
                    borderRadius: 3,
                    boxShadow: '0 20px 27px 0 rgba(0, 0, 0, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    position: 'relative',
                    overflow: 'visible',
                  }}
                >
                  <Box
                    sx={{
                      position: 'absolute',
                      top: -20,
                      left: 20,
                      width: 60,
                      height: 60,
                      borderRadius: 2,
                      background: `linear-gradient(310deg, ${stat.color}, ${stat.color}dd)`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: `0 4px 20px 0 ${stat.color}40`,
                    }}
                  >
                    <Typography variant="h4" sx={{ color: 'white', fontWeight: 700 }}>
                      {stat.value.charAt(0)}
                    </Typography>
                  </Box>
                  <CardContent sx={{ pt: 4, pb: 2 }}>
                    <Typography variant="h4" sx={{ fontWeight: 700, mb: 1, textAlign: 'right' }}>
                      {stat.value}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'right' }}>
                      {stat.title}
                    </Typography>
                  </CardContent>
                </Card>
              </Box>
            ))}
          </Box>

          {/* Quick Actions */}
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
            <Box sx={{ flex: '2 1 600px' }}>
              <Card
                sx={{
                  background: 'rgba(255, 255, 255, 0.8)',
                  backdropFilter: 'blur(20px)',
                  borderRadius: 3,
                  boxShadow: '0 20px 27px 0 rgba(0, 0, 0, 0.05)',
                  p: 3,
                }}
              >
                <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
                  Quick Actions
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                  <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => navigate('/contacts')}
                    sx={{
                      py: 2,
                      px: 3,
                      background: 'linear-gradient(310deg, #7928ca 0%, #ff0080 100%)',
                      borderRadius: 2,
                    }}
                  >
                    Add Contact
                  </Button>
                  <Button
                    variant="contained"
                    startIcon={<CampaignIcon />}
                    sx={{
                      py: 2,
                      px: 3,
                      background: 'linear-gradient(310deg, #17c1e8 0%, #7928ca 100%)',
                      borderRadius: 2,
                    }}
                  >
                    New Campaign
                  </Button>
                  <Button
                    variant="contained"
                    startIcon={<PhoneIcon />}
                    sx={{
                      py: 2,
                      px: 3,
                      background: 'linear-gradient(310deg, #82d616 0%, #17c1e8 100%)',
                      borderRadius: 2,
                    }}
                  >
                    Start Call
                  </Button>
                  <Button
                    variant="contained"
                    startIcon={<AnalyticsIcon />}
                    sx={{
                      py: 2,
                      px: 3,
                      background: 'linear-gradient(310deg, #ff0080 0%, #82d616 100%)',
                      borderRadius: 2,
                    }}
                  >
                    View Reports
                  </Button>
                </Box>
              </Card>
            </Box>

            <Box sx={{ flex: '1 1 300px' }}>
              <Card
                sx={{
                  background: 'rgba(255, 255, 255, 0.8)',
                  backdropFilter: 'blur(20px)',
                  borderRadius: 3,
                  boxShadow: '0 20px 27px 0 rgba(0, 0, 0, 0.05)',
                  p: 3,
                }}
              >
                <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
                  Recent Activity
                </Typography>
                <Box>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    • Campaign "Q4 Sales Push" completed
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    • 45 new contacts added
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    • Call success rate improved by 12%
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    • 3 new leads qualified
                  </Typography>
                </Box>
              </Card>
            </Box>
          </Box>
      </Container>
    </Box>
  );
};

export default Dashboard;