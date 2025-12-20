import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Alert
} from '@mui/material';

interface CreateGroupDialogProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const CreateGroupDialog: React.FC<CreateGroupDialogProps> = ({
  open,
  onClose,
  onSuccess
}) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    color: '#3B82F6'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    if (!formData.name.trim()) {
      setError('Group name is required');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        setError('Authentication token not found. Please login again.');
        return;
      }
      
      console.log('Creating group with data:', formData);
      
      const response = await fetch('http://localhost:8000/api/v1/contacts/groups/', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name.trim(),
          description: formData.description.trim(),
          color: formData.color
        }),
      });

      console.log('Response status:', response.status);
      
      if (response.status === 401) {
        setError('Authentication failed. Please login again.');
        return;
      }
      
      if (response.status === 403) {
        setError('Permission denied. You do not have access to create groups.');
        return;
      }
      
      if (!response.ok) {
        let errorMessage = `HTTP ${response.status}`;
        try {
          const errorData = await response.json();
          console.error('Error response:', errorData);
          if (errorData.detail) {
            errorMessage = errorData.detail;
          } else if (errorData.name) {
            errorMessage = `Name: ${errorData.name.join(', ')}`;
          } else {
            errorMessage = JSON.stringify(errorData);
          }
        } catch {
          const errorText = await response.text();
          console.error('Error response text:', errorText);
          errorMessage = errorText || errorMessage;
        }
        setError(`Failed to create group: ${errorMessage}`);
        return;
      }

      const result = await response.json();
      console.log('Group created successfully:', result);
      
      setFormData({ name: '', description: '', color: '#3B82F6' });
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Network error:', error);
      if (error instanceof TypeError && error.message.includes('fetch')) {
        setError('Network error. Please check if the server is running.');
      } else {
        setError(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Create Contact Group</DialogTitle>
      <DialogContent>
        <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
          {error && (
            <Alert severity="error">
              {error}
            </Alert>
          )}
          
          <TextField
            fullWidth
            label="Group Name *"
            value={formData.name}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
          />
          
          <TextField
            fullWidth
            label="Description"
            multiline
            rows={3}
            value={formData.description}
            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
          />
          
          <Box>
            <TextField
              label="Color"
              type="color"
              value={formData.color}
              onChange={(e) => setFormData(prev => ({ ...prev, color: e.target.value }))}
              sx={{ width: 100 }}
            />
          </Box>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button 
          onClick={handleSubmit} 
          variant="contained" 
          disabled={loading || !formData.name}
        >
          {loading ? 'Creating...' : 'Create Group'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateGroupDialog;