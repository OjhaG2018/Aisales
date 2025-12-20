import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Tabs,
  Tab,
  LinearProgress,
  Tooltip
} from '@mui/material';
import {
  Search as SearchIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  Edit as EditIcon,
  TrendingUp as TrendingUpIcon,
  Schedule as ScheduleIcon
} from '@mui/icons-material';

interface Lead {
  id: string;
  contact: {
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    company_name: string;
  };
  status: string;
  score: number;
  last_contacted: string;
  next_follow_up: string;
  notes: string;
}

const LeadsPage: React.FC = () => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [tabValue, setTabValue] = useState(0);

  const tabs = [
    { label: 'Interested', value: 'interested', color: '#10b981' },
    { label: 'Not Interested', value: 'not_interested', color: '#ef4444' },
    { label: 'Not Picked Up', value: 'not_picked_up', color: '#f59e0b' },
    { label: 'Follow-up', value: 'follow_up', color: '#3b82f6' }
  ];

  const stats = [
    { title: 'Total Leads', value: '156', color: '#7928ca' },
    { title: 'Hot Leads', value: '23', color: '#ef4444' },
    { title: 'Follow-ups Due', value: '12', color: '#f59e0b' },
    { title: 'Conversion Rate', value: '18%', color: '#10b981' }
  ];

  const mockLeads: Lead[] = [
    {
      id: '1',
      contact: {
        first_name: 'John',
        last_name: 'Doe',
        email: 'john@example.com',
        phone: '+919876543210',
        company_name: 'Tech Corp'
      },
      status: 'interested',
      score: 85,
      last_contacted: '2024-01-15',
      next_follow_up: '2024-01-20',
      notes: 'Interested in premium package'
    },
    {
      id: '2',
      contact: {
        first_name: 'Jane',
        last_name: 'Smith',
        email: 'jane@example.com',
        phone: '+919876543211',
        company_name: 'Business Inc'
      },
      status: 'follow_up',
      score: 72,
      last_contacted: '2024-01-14',
      next_follow_up: '2024-01-18',
      notes: 'Needs budget approval'
    }
  ];

  useEffect(() => {
    setLoading(false);
    setLeads(mockLeads);
  }, []);

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      interested: 'success',
      not_interested: 'error',
      not_picked_up: 'warning',
      follow_up: 'info'
    };
    return colors[status] || 'default';
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return '#10b981';
    if (score >= 60) return '#f59e0b';
    return '#ef4444';
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" fontWeight="bold">
          Leads Management
        </Typography>
        <Button variant="contained" startIcon={<TrendingUpIcon />}>
          Generate Report
        </Button>
      </Box>

      {/* Stats Cards */}
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, mb: 3 }}>
        {stats.map((stat, index) => (
          <Box key={index} sx={{ flex: '1 1 250px', minWidth: '250px' }}>
            <Card>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  {stat.title}
                </Typography>
                <Typography variant="h4" sx={{ color: stat.color }}>
                  {stat.value}
                </Typography>
              </CardContent>
            </Card>
          </Box>
        ))}
      </Box>

      {/* Tabs */}
      <Card sx={{ mb: 3 }}>
        <Tabs value={tabValue} onChange={(e, v) => setTabValue(v)}>
          {tabs.map((tab, index) => (
            <Tab key={index} label={tab.label} />
          ))}
        </Tabs>
      </Card>

      {/* Filters */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, alignItems: 'center' }}>
            <Box sx={{ flex: '1 1 300px', minWidth: '300px' }}>
              <TextField
                fullWidth
                placeholder="Search leads..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />
                }}
              />
            </Box>
            <Box sx={{ flex: '1 1 200px', minWidth: '200px' }}>
              <FormControl fullWidth>
                <InputLabel>Score Range</InputLabel>
                <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} label="Score Range">
                  <MenuItem value="">All</MenuItem>
                  <MenuItem value="high">High (80+)</MenuItem>
                  <MenuItem value="medium">Medium (60-79)</MenuItem>
                  <MenuItem value="low">Low (&lt;60)</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* Leads Table */}
      <Card>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Contact</TableCell>
                <TableCell>Company</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Score</TableCell>
                <TableCell>Last Contact</TableCell>
                <TableCell>Next Follow-up</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={7} align="center">
                    <LinearProgress />
                  </TableCell>
                </TableRow>
              ) : (
                leads.map((lead) => (
                  <TableRow key={lead.id} hover>
                    <TableCell>
                      <Box>
                        <Typography variant="subtitle2">
                          {lead.contact.first_name} {lead.contact.last_name}
                        </Typography>
                        <Typography variant="caption" color="textSecondary">
                          {lead.contact.phone}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>{lead.contact.company_name}</TableCell>
                    <TableCell>
                      <Chip
                        label={lead.status.replace('_', ' ')}
                        color={getStatusColor(lead.status) as any}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography variant="body2" sx={{ color: getScoreColor(lead.score) }}>
                          {lead.score}
                        </Typography>
                        <Box sx={{ width: 50, height: 4, bgcolor: '#e0e0e0', borderRadius: 2 }}>
                          <Box
                            sx={{
                              width: `${lead.score}%`,
                              height: '100%',
                              bgcolor: getScoreColor(lead.score),
                              borderRadius: 2
                            }}
                          />
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>{lead.last_contacted}</TableCell>
                    <TableCell>{lead.next_follow_up}</TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <Tooltip title="Call">
                          <IconButton size="small" color="primary">
                            <PhoneIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Email">
                          <IconButton size="small" color="secondary">
                            <EmailIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Schedule Follow-up">
                          <IconButton size="small">
                            <ScheduleIcon />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>
    </Box>
  );
};

export default LeadsPage;