import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Alert
} from '@mui/material';

interface Contact {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  company_name: string;
  job_title: string;
  group?: {
    id: string;
    name: string;
    color: string;
  } | null;
  city: string;
  notes: string;
}

interface ContactGroup {
  id: string;
  name: string;
  color: string;
}

interface EditContactDialogProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  contact: Contact | null;
  groups: ContactGroup[];
}

const EditContactDialog: React.FC<EditContactDialogProps> = ({
  open,
  onClose,
  onSuccess,
  contact,
  groups
}) => {
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    company_name: '',
    job_title: '',
    group: '',
    city: '',
    notes: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (contact && open) {
      console.log('Setting form data for contact:', contact);
      setFormData({
        first_name: contact.first_name || '',
        last_name: contact.last_name || '',
        email: contact.email || '',
        phone: contact.phone || '',
        company_name: contact.company_name || '',
        job_title: contact.job_title || '',
        group: contact.group?.id || '',
        city: contact.city || '',
        notes: contact.notes || ''
      });
    }
  }, [contact, open]);

  useEffect(() => {
    if (!open) {
      setError('');
    }
  }, [open]);

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    if (!contact || !formData.first_name || !formData.phone) {
      setError('First name and phone are required');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('access_token');
      const response = await fetch(`http://localhost:8000/api/v1/contacts/${contact.id}/`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          group: formData.group || null
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update contact');
      }

      onSuccess();
      onClose();
    } catch (error) {
      setError('Failed to update contact. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setError('');
    // Don't reset form data here to preserve it for debugging
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle>Edit Contact</DialogTitle>
      <DialogContent>
        <Box sx={{ mt: 2 }}>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              <Box sx={{ flex: '1 1 250px', minWidth: '250px' }}>
                <TextField
                  fullWidth
                  label="First Name *"
                  value={formData.first_name}
                  onChange={(e) => handleChange('first_name', e.target.value)}
                />
              </Box>
              <Box sx={{ flex: '1 1 250px', minWidth: '250px' }}>
                <TextField
                  fullWidth
                  label="Last Name"
                  value={formData.last_name}
                  onChange={(e) => handleChange('last_name', e.target.value)}
                />
              </Box>
            </Box>
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              <Box sx={{ flex: '1 1 250px', minWidth: '250px' }}>
                <TextField
                  fullWidth
                  label="Phone *"
                  value={formData.phone}
                  onChange={(e) => handleChange('phone', e.target.value)}
                />
              </Box>
              <Box sx={{ flex: '1 1 250px', minWidth: '250px' }}>
                <TextField
                  fullWidth
                  label="Email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                />
              </Box>
            </Box>
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              <Box sx={{ flex: '1 1 250px', minWidth: '250px' }}>
                <TextField
                  fullWidth
                  label="Company Name"
                  value={formData.company_name}
                  onChange={(e) => handleChange('company_name', e.target.value)}
                />
              </Box>
              <Box sx={{ flex: '1 1 250px', minWidth: '250px' }}>
                <TextField
                  fullWidth
                  label="Job Title"
                  value={formData.job_title}
                  onChange={(e) => handleChange('job_title', e.target.value)}
                />
              </Box>
            </Box>
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              <Box sx={{ flex: '1 1 250px', minWidth: '250px' }}>
                <FormControl fullWidth>
                  <InputLabel>Group</InputLabel>
                  <Select
                    value={formData.group}
                    onChange={(e) => handleChange('group', e.target.value)}
                    label="Group"
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
              <Box sx={{ flex: '1 1 250px', minWidth: '250px' }}>
                <TextField
                  fullWidth
                  label="City"
                  value={formData.city}
                  onChange={(e) => handleChange('city', e.target.value)}
                />
              </Box>
            </Box>
            <TextField
              fullWidth
              label="Notes"
              multiline
              rows={3}
              value={formData.notes}
              onChange={(e) => handleChange('notes', e.target.value)}
            />
          </Box>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button 
          onClick={handleSubmit} 
          variant="contained" 
          disabled={loading || !formData.first_name || !formData.phone}
        >
          {loading ? 'Updating...' : 'Update Contact'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditContactDialog;