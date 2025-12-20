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
  Paper,
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
  Tabs,
  Tab,
  Alert,
  LinearProgress,
  Checkbox,
  Menu,
  ListItemText,
  Fab,
  Tooltip
} from '@mui/material';
import {
  Add as AddIcon,
  Upload as UploadIcon,
  Search as SearchIcon,
  FilterList as FilterIcon,
  Download as DownloadIcon,
  MoreVert as MoreVertIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  Business as BusinessIcon,
  Delete as DeleteIcon,
  Edit as EditIcon
} from '@mui/icons-material';
import AddContactDialog from '../components/AddContactDialog';
import EditContactDialog from '../components/EditContactDialog';
import CreateGroupDialog from '../components/CreateGroupDialog';
import ScheduleCallDialog from '../components/ScheduleCallDialog';

interface Contact {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  company_name: string;
  job_title: string;
  status: string;
  source: string;
  tags: string[];
  group?: {
    id: string;
    name: string;
    color: string;
  } | null;
  city: string;
  notes: string;
  created_at: string;
}

interface ContactGroup {
  id: string;
  name: string;
  color: string;
  contact_count: number;
}

interface ContactStats {
  total: number;
  by_status: Record<string, number>;
  by_source: Record<string, number>;
  by_group: Record<string, number>;
}

const ContactsPage: React.FC = () => {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [groups, setGroups] = useState<ContactGroup[]>([]);
  const [stats, setStats] = useState<ContactStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedContacts, setSelectedContacts] = useState<string[]>([]);
  
  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [groupFilter, setGroupFilter] = useState('');
  const [sourceFilter, setSourceFilter] = useState('');
  
  // Dialogs
  const [importDialogOpen, setImportDialogOpen] = useState(false);
  const [addContactDialogOpen, setAddContactDialogOpen] = useState(false);
  const [editContactDialogOpen, setEditContactDialogOpen] = useState(false);
  const [createGroupDialogOpen, setCreateGroupDialogOpen] = useState(false);
  const [scheduleCallDialogOpen, setScheduleCallDialogOpen] = useState(false);
  const [bulkActionMenuAnchor, setBulkActionMenuAnchor] = useState<null | HTMLElement>(null);
  const [selectedContactForCall, setSelectedContactForCall] = useState<any>(null);
  const [selectedContactForEdit, setSelectedContactForEdit] = useState<Contact | null>(null);
  
  // Import
  const [importFile, setImportFile] = useState<File | null>(null);
  const [importGroup, setImportGroup] = useState('');
  const [importProgress, setImportProgress] = useState<number | null>(null);
  const [importStatus, setImportStatus] = useState<string>('');

  const API_BASE = 'http://localhost:8000/api/v1';
  const token = localStorage.getItem('token');

  const apiCall = async (url: string, options: RequestInit = {}) => {
    const response = await fetch(`${API_BASE}${url}`, {
      ...options,
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });
    if (!response.ok) throw new Error(`API Error: ${response.status}`);
    return response.json();
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      const [contactsData, groupsData, statsData] = await Promise.all([
        apiCall('/contacts/'),
        apiCall('/contacts/groups/'),
        apiCall('/contacts/stats/')
      ]);
      
      setContacts(contactsData.results || contactsData);
      setGroups(groupsData.results || groupsData);
      setStats(statsData);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filteredContacts = contacts.filter(contact => {
    const matchesSearch = !searchTerm || 
      (contact.first_name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (contact.last_name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (contact.email || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (contact.phone || '').includes(searchTerm) ||
      (contact.company_name || '').toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = !statusFilter || contact.status === statusFilter;
    const matchesGroup = !groupFilter || (contact.group && contact.group.id === groupFilter);
    const matchesSource = !sourceFilter || contact.source === sourceFilter;
    
    return matchesSearch && matchesStatus && matchesGroup && matchesSource;
  });

  const handleImport = async () => {
    if (!importFile) return;
    
    const formData = new FormData();
    formData.append('file', importFile);
    if (importGroup) formData.append('target_group', importGroup);
    
    try {
      setImportProgress(0);
      const response = await fetch(`${API_BASE}/contacts/import/`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData,
      });
      
      const result = await response.json();
      setImportStatus('Import started successfully');
      setImportDialogOpen(false);
      setImportFile(null);
      
      // Poll for import status
      const importId = result.import_id;
      const pollStatus = setInterval(async () => {
        try {
          const statusData = await apiCall(`/contacts/import/${importId}/status/`);
          setImportProgress(statusData.processed_rows / statusData.total_rows * 100);
          
          if (statusData.status === 'completed') {
            clearInterval(pollStatus);
            setImportProgress(null);
            setImportStatus(`Import completed: ${statusData.successful_imports} contacts imported`);
            fetchData();
          } else if (statusData.status === 'failed') {
            clearInterval(pollStatus);
            setImportProgress(null);
            setImportStatus('Import failed');
          }
        } catch (error) {
          clearInterval(pollStatus);
          setImportProgress(null);
        }
      }, 2000);
      
    } catch (error) {
      setImportStatus('Import failed');
      setImportProgress(null);
    }
  };

  const handleBulkAction = async (action: string) => {
    if (selectedContacts.length === 0) return;
    
    try {
      await apiCall('/contacts/bulk_action/', {
        method: 'POST',
        body: JSON.stringify({
          contact_ids: selectedContacts,
          action: action
        })
      });
      
      setSelectedContacts([]);
      setBulkActionMenuAnchor(null);
      fetchData();
    } catch (error) {
      console.error('Bulk action failed:', error);
    }
  };

  const downloadTemplate = () => {
    window.open(`${API_BASE}/contacts/import/template/`, '_blank');
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      active: 'success',
      inactive: 'default',
      blocked: 'error',
      dnd: 'warning'
    };
    return colors[status] || 'default';
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" fontWeight="bold">
          Contacts
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="outlined"
            startIcon={<DownloadIcon />}
            onClick={downloadTemplate}
          >
            Template
          </Button>
          <Button
            variant="outlined"
            startIcon={<UploadIcon />}
            onClick={() => setImportDialogOpen(true)}
          >
            Import
          </Button>
          <Button
            variant="outlined"
            onClick={() => setCreateGroupDialogOpen(true)}
          >
            Create Group
          </Button>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setAddContactDialogOpen(true)}
          >
            Add Contact
          </Button>
        </Box>
      </Box>

      {/* Import Status */}
      {importProgress !== null && (
        <Alert severity="info" sx={{ mb: 2 }}>
          <Box sx={{ width: '100%' }}>
            <Typography variant="body2">Importing contacts...</Typography>
            <LinearProgress variant="determinate" value={importProgress} sx={{ mt: 1 }} />
          </Box>
        </Alert>
      )}
      
      {importStatus && (
        <Alert severity="success" sx={{ mb: 2 }} onClose={() => setImportStatus('')}>
          {importStatus}
        </Alert>
      )}

      {/* Stats Cards */}
      {stats && (
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, mb: 3 }}>
          <Box sx={{ flex: '1 1 250px', minWidth: '250px' }}>
            <Card>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  Total Contacts
                </Typography>
                <Typography variant="h4">
                  {stats.total}
                </Typography>
              </CardContent>
            </Card>
          </Box>
          <Box sx={{ flex: '1 1 250px', minWidth: '250px' }}>
            <Card>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  Active
                </Typography>
                <Typography variant="h4" color="success.main">
                  {stats.by_status.active || 0}
                </Typography>
              </CardContent>
            </Card>
          </Box>
          <Box sx={{ flex: '1 1 250px', minWidth: '250px' }}>
            <Card>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  Groups
                </Typography>
                <Typography variant="h4">
                  {groups.length}
                </Typography>
              </CardContent>
            </Card>
          </Box>
          <Box sx={{ flex: '1 1 250px', minWidth: '250px' }}>
            <Card>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  Imported
                </Typography>
                <Typography variant="h4">
                  {stats.by_source.import || 0}
                </Typography>
              </CardContent>
            </Card>
          </Box>
        </Box>
      )}

      {/* Filters */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, alignItems: 'center' }}>
            <Box sx={{ flex: '1 1 300px', minWidth: '300px' }}>
              <TextField
                fullWidth
                placeholder="Search contacts..."
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
                <Select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  label="Status"
                >
                  <MenuItem value="">All</MenuItem>
                  <MenuItem value="active">Active</MenuItem>
                  <MenuItem value="inactive">Inactive</MenuItem>
                  <MenuItem value="blocked">Blocked</MenuItem>
                  <MenuItem value="dnd">DND</MenuItem>
                </Select>
              </FormControl>
            </Box>
            <Box sx={{ flex: '1 1 150px', minWidth: '150px' }}>
              <FormControl fullWidth>
                <InputLabel>Group</InputLabel>
                <Select
                  value={groupFilter}
                  onChange={(e) => setGroupFilter(e.target.value)}
                  label="Group"
                >
                  <MenuItem value="">All</MenuItem>
                  {groups.map((group) => (
                    <MenuItem key={group.id} value={group.id}>
                      {group.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
            <Box sx={{ flex: '1 1 150px', minWidth: '150px' }}>
              <FormControl fullWidth>
                <InputLabel>Source</InputLabel>
                <Select
                  value={sourceFilter}
                  onChange={(e) => setSourceFilter(e.target.value)}
                  label="Source"
                >
                  <MenuItem value="">All</MenuItem>
                  <MenuItem value="manual">Manual</MenuItem>
                  <MenuItem value="import">Import</MenuItem>
                  <MenuItem value="api">API</MenuItem>
                  <MenuItem value="website">Website</MenuItem>
                </Select>
              </FormControl>
            </Box>
            <Box sx={{ flex: '1 1 200px', minWidth: '200px' }}>
              {selectedContacts.length > 0 && (
                <Button
                  variant="outlined"
                  startIcon={<MoreVertIcon />}
                  onClick={(e) => setBulkActionMenuAnchor(e.currentTarget)}
                >
                  Actions ({selectedContacts.length})
                </Button>
              )}
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* Contacts Table */}
      <Card>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell padding="checkbox">
                  <Checkbox
                    checked={selectedContacts.length === filteredContacts.length && filteredContacts.length > 0}
                    indeterminate={selectedContacts.length > 0 && selectedContacts.length < filteredContacts.length}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedContacts(filteredContacts.map(c => c.id));
                      } else {
                        setSelectedContacts([]);
                      }
                    }}
                  />
                </TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Contact</TableCell>
                <TableCell>Company</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Group</TableCell>
                <TableCell>Tags</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={8} align="center">
                    <LinearProgress />
                  </TableCell>
                </TableRow>
              ) : filteredContacts.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} align="center">
                    <Typography color="textSecondary">
                      No contacts found
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                filteredContacts.map((contact) => (
                  <TableRow key={contact.id} hover>
                    <TableCell padding="checkbox">
                      <Checkbox
                        checked={selectedContacts.includes(contact.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedContacts([...selectedContacts, contact.id]);
                          } else {
                            setSelectedContacts(selectedContacts.filter(id => id !== contact.id));
                          }
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <Box>
                        <Typography variant="subtitle2">
                          {contact.first_name} {contact.last_name}
                        </Typography>
                        <Typography variant="caption" color="textSecondary">
                          {contact.job_title}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <PhoneIcon fontSize="small" color="action" />
                          <Typography variant="body2">{contact.phone}</Typography>
                        </Box>
                        {contact.email && (
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <EmailIcon fontSize="small" color="action" />
                            <Typography variant="body2">{contact.email}</Typography>
                          </Box>
                        )}
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <BusinessIcon fontSize="small" color="action" />
                        <Typography variant="body2">{contact.company_name}</Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={contact.status}
                        color={getStatusColor(contact.status) as any}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      {contact.group ? (
                        <Chip
                          label={contact.group.name}
                          size="small"
                          sx={{ backgroundColor: contact.group.color, color: 'white' }}
                        />
                      ) : (
                        <Typography variant="body2" color="textSecondary">-</Typography>
                      )}
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                        {(contact.tags || []).slice(0, 2).map((tag) => (
                          <Chip key={tag} label={tag} size="small" variant="outlined" />
                        ))}
                        {(contact.tags || []).length > 2 && (
                          <Chip label={`+${(contact.tags || []).length - 2}`} size="small" variant="outlined" />
                        )}
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <Tooltip title="Schedule Call">
                          <IconButton 
                            size="small" 
                            color="primary"
                            onClick={() => {
                              setSelectedContactForCall(contact);
                              setScheduleCallDialogOpen(true);
                            }}
                          >
                            <PhoneIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Edit">
                          <IconButton 
                            size="small"
                            onClick={() => {
                              setSelectedContactForEdit(contact);
                              setEditContactDialogOpen(true);
                            }}
                          >
                            <EditIcon />
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

      {/* Add Contact Dialog */}
      <AddContactDialog
        open={addContactDialogOpen}
        onClose={() => setAddContactDialogOpen(false)}
        onSuccess={fetchData}
        groups={groups}
      />

      {/* Edit Contact Dialog */}
      <EditContactDialog
        open={editContactDialogOpen}
        onClose={() => {
          setEditContactDialogOpen(false);
          setSelectedContactForEdit(null);
        }}
        onSuccess={fetchData}
        contact={selectedContactForEdit}
        groups={groups}
      />

      {/* Create Group Dialog */}
      <CreateGroupDialog
        open={createGroupDialogOpen}
        onClose={() => setCreateGroupDialogOpen(false)}
        onSuccess={fetchData}
      />

      {/* Schedule Call Dialog */}
      <ScheduleCallDialog
        open={scheduleCallDialogOpen}
        onClose={() => {
          setScheduleCallDialogOpen(false);
          setSelectedContactForCall(null);
        }}
        onSuccess={() => {
          fetchData();
          setSelectedContacts([]);
        }}
        contact={selectedContactForCall}
        contacts={selectedContacts.length > 0 ? contacts.filter(c => selectedContacts.includes(c.id)) : []}
      />

      {/* Import Dialog */}
      <Dialog open={importDialogOpen} onClose={() => setImportDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Import Contacts</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <input
              type="file"
              accept=".csv,.xlsx,.xls"
              onChange={(e) => setImportFile(e.target.files?.[0] || null)}
              style={{ marginBottom: 16 }}
            />
            <FormControl fullWidth sx={{ mt: 2 }}>
              <InputLabel>Target Group (Optional)</InputLabel>
              <Select
                value={importGroup}
                onChange={(e) => setImportGroup(e.target.value)}
                label="Target Group (Optional)"
              >
                <MenuItem value="">No Group</MenuItem>
                {groups.map((group) => (
                  <MenuItem key={group.id} value={group.id}>
                    {group.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setImportDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleImport} variant="contained" disabled={!importFile}>
            Import
          </Button>
        </DialogActions>
      </Dialog>

      {/* Bulk Actions Menu */}
      <Menu
        anchorEl={bulkActionMenuAnchor}
        open={Boolean(bulkActionMenuAnchor)}
        onClose={() => setBulkActionMenuAnchor(null)}
      >
        <MenuItem onClick={() => handleBulkAction('delete')}>
          <DeleteIcon sx={{ mr: 1 }} />
          Delete Selected
        </MenuItem>
        <MenuItem onClick={() => handleBulkAction('change_status')}>
          Change Status
        </MenuItem>
        <MenuItem onClick={() => handleBulkAction('add_to_group')}>
          Add to Group
        </MenuItem>
        <MenuItem onClick={() => {
          const selectedContactsData = contacts.filter(c => selectedContacts.includes(c.id));
          setScheduleCallDialogOpen(true);
          setBulkActionMenuAnchor(null);
        }}>
          Schedule Calls
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default ContactsPage;