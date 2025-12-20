import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
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
  LinearProgress,
  Tooltip,
  Avatar
} from '@mui/material';
import {
  Search as SearchIcon,
  Phone as PhoneIcon,
  PlayArrow as PlayIcon,
  Download as DownloadIcon,
  AccessTime as TimeIcon,
  Person as PersonIcon
} from '@mui/icons-material';

interface Call {
  id: string;
  contact: {
    first_name: string;
    last_name: string;
    phone: string;
    company_name: string;
  };
  status: string;
  outcome: string;
  duration: number;
  started_at: string;
  recording_url?: string;
  notes: string;
}

const CallHistoryPage: React.FC = () => {
  const [calls, setCalls] = useState<Call[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [outcomeFilter, setOutcomeFilter] = useState('');

  const stats = [
    { title: 'Total Calls', value: '1,247', color: '#7928ca' },
    { title: 'Successful', value: '892', color: '#10b981' },
    { title: 'Average Duration', value: '4:32', color: '#3b82f6' },
    { title: 'Success Rate', value: '71%', color: '#f59e0b' }
  ];

  const mockCalls: Call[] = [
    {
      id: '1',
      contact: {
        first_name: 'John',
        last_name: 'Doe',
        phone: '+919876543210',
        company_name: 'Tech Corp'
      },
      status: 'completed',
      outcome: 'interested',
      duration: 285,
      started_at: '2024-01-15T10:30:00Z',
      recording_url: '/recordings/call1.mp3',
      notes: 'Customer showed interest in premium package'
    },
    {
      id: '2',
      contact: {
        first_name: 'Jane',
        last_name: 'Smith',
        phone: '+919876543211',
        company_name: 'Business Inc'
      },
      status: 'completed',
      outcome: 'not_interested',
      duration: 120,
      started_at: '2024-01-15T11:15:00Z',
      recording_url: '/recordings/call2.mp3',
      notes: 'Not interested at this time'
    },
    {
      id: '3',
      contact: {
        first_name: 'Mike',
        last_name: 'Johnson',
        phone: '+919876543212',
        company_name: 'StartupXYZ'
      },
      status: 'failed',
      outcome: 'no_answer',
      duration: 0,
      started_at: '2024-01-15T12:00:00Z',
      notes: 'No answer, will try again later'
    }
  ];

  useEffect(() => {
    setLoading(false);
    setCalls(mockCalls);
  }, []);

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      completed: 'success',
      failed: 'error',
      in_progress: 'info',
      scheduled: 'warning'
    };
    return colors[status] || 'default';
  };

  const getOutcomeColor = (outcome: string) => {
    const colors: Record<string, string> = {
      interested: 'success',
      not_interested: 'error',
      callback: 'warning',
      no_answer: 'default',
      busy: 'info'
    };
    return colors[outcome] || 'default';
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Typography variant="h4" fontWeight="bold" sx={{ mb: 3 }}>
        Call History
      </Typography>

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
                placeholder="Search calls..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />
                }}
              />
            </Box>
            <Box sx={{ flex: '1 1 150px', minWidth: '150px' }}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} label="Status">
                  <MenuItem value="">All</MenuItem>
                  <MenuItem value="completed">Completed</MenuItem>
                  <MenuItem value="failed">Failed</MenuItem>
                  <MenuItem value="in_progress">In Progress</MenuItem>
                </Select>
              </FormControl>
            </Box>
            <Box sx={{ flex: '1 1 150px', minWidth: '150px' }}>
              <FormControl fullWidth>
                <InputLabel>Outcome</InputLabel>
                <Select value={outcomeFilter} onChange={(e) => setOutcomeFilter(e.target.value)} label="Outcome">
                  <MenuItem value="">All</MenuItem>
                  <MenuItem value="interested">Interested</MenuItem>
                  <MenuItem value="not_interested">Not Interested</MenuItem>
                  <MenuItem value="callback">Callback</MenuItem>
                  <MenuItem value="no_answer">No Answer</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* Calls Table */}
      <Card>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Contact</TableCell>
                <TableCell>Company</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Outcome</TableCell>
                <TableCell>Duration</TableCell>
                <TableCell>Date & Time</TableCell>
                <TableCell>Recording</TableCell>
                <TableCell>Notes</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={8} align="center">
                    <LinearProgress />
                  </TableCell>
                </TableRow>
              ) : (
                calls.map((call) => (
                  <TableRow key={call.id} hover>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Avatar sx={{ width: 32, height: 32, bgcolor: '#7928ca' }}>
                          <PersonIcon fontSize="small" />
                        </Avatar>
                        <Box>
                          <Typography variant="subtitle2">
                            {call.contact.first_name} {call.contact.last_name}
                          </Typography>
                          <Typography variant="caption" color="textSecondary">
                            {call.contact.phone}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>{call.contact.company_name}</TableCell>
                    <TableCell>
                      <Chip
                        label={call.status}
                        color={getStatusColor(call.status) as any}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={call.outcome.replace('_', ' ')}
                        color={getOutcomeColor(call.outcome) as any}
                        size="small"
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <TimeIcon fontSize="small" color="action" />
                        <Typography variant="body2">
                          {call.duration > 0 ? formatDuration(call.duration) : '-'}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {formatDateTime(call.started_at)}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      {call.recording_url ? (
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          <Tooltip title="Play Recording">
                            <IconButton size="small" color="primary">
                              <PlayIcon />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Download">
                            <IconButton size="small">
                              <DownloadIcon />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      ) : (
                        <Typography variant="caption" color="textSecondary">
                          No recording
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={{ maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {call.notes || '-'}
                      </Typography>
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

export default CallHistoryPage;