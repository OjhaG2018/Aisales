import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  LinearProgress
} from '@mui/material';
import {
  TrendingUp as TrendingUpIcon,
  Phone as PhoneIcon,
  People as PeopleIcon,
  Campaign as CampaignIcon
} from '@mui/icons-material';

const AnalyticsPage: React.FC = () => {
  const [timeRange, setTimeRange] = useState('7d');

  const kpiCards = [
    {
      title: 'Total Calls',
      value: '1,247',
      change: '+12%',
      trend: 'up',
      icon: <PhoneIcon />,
      color: '#7928ca'
    },
    {
      title: 'Success Rate',
      value: '71.2%',
      change: '+5.3%',
      trend: 'up',
      icon: <TrendingUpIcon />,
      color: '#10b981'
    },
    {
      title: 'New Leads',
      value: '156',
      change: '+18%',
      trend: 'up',
      icon: <PeopleIcon />,
      color: '#3b82f6'
    },
    {
      title: 'Active Campaigns',
      value: '8',
      change: '-2',
      trend: 'down',
      icon: <CampaignIcon />,
      color: '#f59e0b'
    }
  ];

  const performanceMetrics = [
    { label: 'Call Connection Rate', value: 85, color: '#10b981' },
    { label: 'Lead Conversion Rate', value: 23, color: '#3b82f6' },
    { label: 'Average Call Duration', value: 67, color: '#f59e0b' },
    { label: 'Follow-up Success Rate', value: 45, color: '#ef4444' }
  ];

  const campaignPerformance = [
    { name: 'Q4 Sales Push', calls: 450, success: 78, leads: 34 },
    { name: 'New Product Launch', calls: 320, success: 65, leads: 21 },
    { name: 'Follow-up Campaign', calls: 180, success: 82, leads: 15 },
    { name: 'Holiday Special', calls: 297, success: 71, leads: 19 }
  ];

  const dailyStats = [
    { day: 'Mon', calls: 45, success: 32 },
    { day: 'Tue', calls: 52, success: 38 },
    { day: 'Wed', calls: 38, success: 28 },
    { day: 'Thu', calls: 61, success: 44 },
    { day: 'Fri', calls: 48, success: 35 },
    { day: 'Sat', calls: 23, success: 16 },
    { day: 'Sun', calls: 18, success: 12 }
  ];

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" fontWeight="bold">
          Analytics Dashboard
        </Typography>
        <FormControl sx={{ minWidth: 120 }}>
          <InputLabel>Time Range</InputLabel>
          <Select value={timeRange} onChange={(e) => setTimeRange(e.target.value)} label="Time Range">
            <MenuItem value="1d">Last 24h</MenuItem>
            <MenuItem value="7d">Last 7 days</MenuItem>
            <MenuItem value="30d">Last 30 days</MenuItem>
            <MenuItem value="90d">Last 90 days</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {/* KPI Cards */}
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, mb: 4 }}>
        {kpiCards.map((kpi, index) => (
          <Box key={index} sx={{ flex: '1 1 250px', minWidth: '250px' }}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography color="textSecondary" gutterBottom variant="body2">
                      {kpi.title}
                    </Typography>
                    <Typography variant="h4" sx={{ color: kpi.color, mb: 1 }}>
                      {kpi.value}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{ color: kpi.trend === 'up' ? '#10b981' : '#ef4444' }}
                    >
                      {kpi.change} from last period
                    </Typography>
                  </Box>
                  <Box sx={{ color: kpi.color, fontSize: '2rem' }}>
                    {kpi.icon}
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Box>
        ))}
      </Box>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        {/* Performance and Daily Activity Row */}
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
          {/* Performance Metrics */}
          <Box sx={{ flex: '1 1 400px', minWidth: '400px' }}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Performance Metrics
                </Typography>
                <Box sx={{ mt: 2 }}>
                  {performanceMetrics.map((metric, index) => (
                    <Box key={index} sx={{ mb: 3 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="body2">{metric.label}</Typography>
                        <Typography variant="body2" fontWeight="bold">
                          {metric.value}%
                        </Typography>
                      </Box>
                      <LinearProgress
                        variant="determinate"
                        value={metric.value}
                        sx={{
                          height: 8,
                          borderRadius: 4,
                          '& .MuiLinearProgress-bar': {
                            backgroundColor: metric.color
                          }
                        }}
                      />
                    </Box>
                  ))}
                </Box>
              </CardContent>
            </Card>
          </Box>

          {/* Daily Activity */}
          <Box sx={{ flex: '1 1 400px', minWidth: '400px' }}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Daily Activity (This Week)
                </Typography>
                <Box sx={{ mt: 2 }}>
                  {dailyStats.map((day, index) => (
                    <Box key={index} sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Typography variant="body2" sx={{ minWidth: 40 }}>
                        {day.day}
                      </Typography>
                      <Box sx={{ flex: 1, mx: 2 }}>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          <Box
                            sx={{
                              height: 20,
                              width: `${(day.calls / 70) * 100}%`,
                              backgroundColor: '#7928ca',
                              borderRadius: 1
                            }}
                          />
                          <Box
                            sx={{
                              height: 20,
                              width: `${(day.success / 70) * 100}%`,
                              backgroundColor: '#10b981',
                              borderRadius: 1
                            }}
                          />
                        </Box>
                      </Box>
                      <Typography variant="body2" sx={{ minWidth: 60, textAlign: 'right' }}>
                        {day.success}/{day.calls}
                      </Typography>
                    </Box>
                  ))}
                  <Box sx={{ display: 'flex', gap: 2, mt: 2, justifyContent: 'center' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Box sx={{ width: 12, height: 12, backgroundColor: '#7928ca', borderRadius: 1 }} />
                      <Typography variant="caption">Total Calls</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Box sx={{ width: 12, height: 12, backgroundColor: '#10b981', borderRadius: 1 }} />
                      <Typography variant="caption">Successful</Typography>
                    </Box>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Box>
        </Box>

        {/* Campaign Performance */}
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Campaign Performance
            </Typography>
            <Box sx={{ mt: 2, display: 'flex', flexWrap: 'wrap', gap: 2 }}>
              {campaignPerformance.map((campaign, index) => (
                <Box key={index} sx={{ flex: '1 1 250px', minWidth: '250px' }}>
                  <Card variant="outlined">
                    <CardContent>
                      <Typography variant="subtitle2" gutterBottom>
                        {campaign.name}
                      </Typography>
                      <Box sx={{ mt: 2 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                          <Typography variant="body2" color="textSecondary">
                            Total Calls
                          </Typography>
                          <Typography variant="body2" fontWeight="bold">
                            {campaign.calls}
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                          <Typography variant="body2" color="textSecondary">
                            Success Rate
                          </Typography>
                          <Typography variant="body2" fontWeight="bold" color="success.main">
                            {campaign.success}%
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                          <Typography variant="body2" color="textSecondary">
                            New Leads
                          </Typography>
                          <Typography variant="body2" fontWeight="bold" color="primary.main">
                            {campaign.leads}
                          </Typography>
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                </Box>
              ))}
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
};

export default AnalyticsPage;