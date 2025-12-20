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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  LinearProgress,
  Tooltip
} from '@mui/material';
import {
  Add as AddIcon,
  Search as SearchIcon,
  PlayArrow as PlayIcon,
  Pause as PauseIcon,
  Stop as StopIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Campaign as CampaignIcon
} from '@mui/icons-material';

interface Campaign {
  id: string;
  name: string;
  status: string;
  total_contacts: number;
  completed_calls: number;
  success_rate: number;
  created_at: string;
  scheduled_at: string;
}

const mockCampaigns: Campaign[] = [
  {
    id: '1',
    name: 'Q4 Sales Push',
    status: 'active',
    total_contacts: 150,
    completed_calls: 89,
    success_rate: 78,
    created_at: '2024-01-10',
    scheduled_at: '2024-01-15'
  },
  {
    id: '2',
    name: 'New Product Launch',
    status: 'scheduled',
    total_contacts: 200,
    completed_calls: 0,
    success_rate: 0,
    created_at: '2024-01-12',
    scheduled_at: '2024-01-20'
  },
  {
    id: '3',
    name: 'Follow-up Campaign',
    status: 'completed',
    total_contacts: 75,
    completed_calls: 75,
    success_rate: 82,
    created_at: '2024-01-05',
    scheduled_at: '2024-01-08'
  }
];

const CampaignsPage: React.FC = () => {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [createDialogOpen, setCreateDialogOpen] = useState(false);

  const stats = [
    { title: 'Total Campaigns', value: '12', color: '#7928ca' },
    { title: 'Active Campaigns', value: '3', color: '#10b981' },
    { title: 'Completed', value: '8', color: '#3b82f6' },
    { title: 'Success Rate', value: '76%', color: '#f59e0b' }
  ];

  useEffect(() => {
    setLoading(false);
    setCampaigns(mockCampaigns);
  }, []);

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      active: 'success',
      scheduled: 'warning',
      paused: 'info',
      completed: 'default',
      stopped: 'error'
    };
    return colors[status] || 'default';
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <PlayIcon />;
      case 'paused': return <PauseIcon />;
      case 'stopped': return <StopIcon />;
      default: return <CampaignIcon />;
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" fontWeight="bold">
          Campaigns
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setCreateDialogOpen(true)}
        >
          Create Campaign
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

      {/* Filters */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, alignItems: 'center' }}>
            <Box sx={{ flex: '1 1 300px', minWidth: '300px' }}>
              <TextField
                fullWidth
                placeholder="Search campaigns..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />
                }}
              />
            </Box>
            <Box sx={{ flex: '1 1 200px', minWidth: '200px' }}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} label="Status">
                  <MenuItem value="">All</MenuItem>
                  <MenuItem value="active">Active</MenuItem>
                  <MenuItem value="scheduled">Scheduled</MenuItem>
                  <MenuItem value="paused">Paused</MenuItem>
                  <MenuItem value="completed">Completed</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* Campaigns Table */}
      <Card>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Campaign Name</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Progress</TableCell>
                <TableCell>Success Rate</TableCell>
                <TableCell>Created</TableCell>
                <TableCell>Scheduled</TableCell>
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
                campaigns.map((campaign) => (
                  <TableRow key={campaign.id} hover>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        {getStatusIcon(campaign.status)}
                        <Typography variant="subtitle2">
                          {campaign.name}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={campaign.status}
                        color={getStatusColor(campaign.status) as any}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Box>
                        <Typography variant="body2">
                          {campaign.completed_calls} / {campaign.total_contacts}
                        </Typography>
                        <LinearProgress
                          variant="determinate"
                          value={(campaign.completed_calls / campaign.total_contacts) * 100}
                          sx={{ mt: 0.5, height: 6, borderRadius: 3 }}
                        />
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" color={campaign.success_rate > 70 ? 'success.main' : 'text.secondary'}>
                        {campaign.success_rate}%
                      </Typography>
                    </TableCell>
                    <TableCell>{campaign.created_at}</TableCell>
                    <TableCell>{campaign.scheduled_at}</TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        {campaign.status === 'active' ? (
                          <Tooltip title="Pause">
                            <IconButton size="small" color="warning">
                              <PauseIcon />
                            </IconButton>
                          </Tooltip>
                        ) : campaign.status === 'scheduled' ? (
                          <Tooltip title="Start">
                            <IconButton size="small" color="success">
                              <PlayIcon />
                            </IconButton>
                          </Tooltip>
                        ) : null}
                        <Tooltip title="Edit">
                          <IconButton size="small">
                            <EditIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete">
                          <IconButton size="small" color="error">
                            <DeleteIcon />
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

      {/* Create Campaign Dialog */}
      <Dialog open={createDialogOpen} onClose={() => setCreateDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Create New Campaign</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField fullWidth label="Campaign Name" />
            <TextField fullWidth label="Description" multiline rows={3} />
            <FormControl fullWidth>
              <InputLabel>Contact Group</InputLabel>
              <Select label="Contact Group">
                <MenuItem value="all">All Contacts</MenuItem>
                <MenuItem value="leads">Leads Only</MenuItem>
                <MenuItem value="prospects">Prospects</MenuItem>
              </Select>
            </FormControl>
            <TextField fullWidth label="Schedule Date" type="datetime-local" InputLabelProps={{ shrink: true }} />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCreateDialogOpen(false)}>Cancel</Button>
          <Button variant="contained">Create Campaign</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CampaignsPage;