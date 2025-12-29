import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography
} from '@mui/material';

interface Contact {
  id: string;
  first_name: string;
  last_name: string;
  phone: string;
}

interface ScheduleCallDialogProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  contact?: Contact;
  contacts?: Contact[];
}

const ScheduleCallDialog: React.FC<ScheduleCallDialogProps> = ({
  open,
  onClose,
  onSuccess,
  contact,
  contacts = []
}) => {
  const [formData, setFormData] = useState({
    scheduled_at: '',
    priority: 'normal',
    notes: '',
    reason: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const isBulk = !contact && contacts.length > 0;

  const handleSubmit = async () => {
    if (!formData.scheduled_at) {
      setError('Schedule date and time is required');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('access_token');
      
      if (isBulk) {
        // Bulk schedule
        const response = await fetch('http://localhost:8000/api/v1/calls/bulk_initiate/', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            contact_ids: contacts.map(c => c.id),
            scheduled_at: formData.scheduled_at,
            priority: formData.priority
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to schedule calls');
        }
      } else if (contact) {
        // Single schedule
        const response = await fetch('http://localhost:8000/api/v1/calls/scheduled/', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            contact: contact.id,
            scheduled_at: formData.scheduled_at,
            priority: formData.priority,
            notes: formData.notes,
            reason: formData.reason
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to schedule call');
        }
      }

      setFormData({
        scheduled_at: '',
        priority: 'normal',
        notes: '',
        reason: ''
      });
      onSuccess();
      onClose();
    } catch (error) {
      setError('Failed to schedule call(s). Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        {isBulk ? `Schedule Calls (${contacts.length} contacts)` : 'Schedule Call'}
      </DialogTitle>
      <DialogContent>
        <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
          {error && (
            <Alert severity="error">
              {error}
            </Alert>
          )}
          
          {contact && (
            <Box sx={{ p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
              <Typography variant="subtitle2">
                {contact.first_name} {contact.last_name}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                {contact.phone}
              </Typography>
            </Box>
          )}
          
          <TextField
            fullWidth
            label="Schedule Date & Time *"
            type="datetime-local"
            value={formData.scheduled_at}
            onChange={(e) => setFormData(prev => ({ ...prev, scheduled_at: e.target.value }))}
            InputLabelProps={{ shrink: true }}
          />
          
          <FormControl fullWidth>
            <InputLabel>Priority</InputLabel>
            <Select
              value={formData.priority}
              onChange={(e) => setFormData(prev => ({ ...prev, priority: e.target.value }))}
              label="Priority"
            >
              <MenuItem value="low">Low</MenuItem>
              <MenuItem value="normal">Normal</MenuItem>
              <MenuItem value="high">High</MenuItem>
              <MenuItem value="urgent">Urgent</MenuItem>
            </Select>
          </FormControl>
          
          {!isBulk && (
            <>
              <TextField
                fullWidth
                label="Reason"
                value={formData.reason}
                onChange={(e) => setFormData(prev => ({ ...prev, reason: e.target.value }))}
                placeholder="e.g., Follow-up call, Product demo"
              />
              
              <TextField
                fullWidth
                label="Notes"
                multiline
                rows={3}
                value={formData.notes}
                onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                placeholder="Additional notes for this call..."
              />
            </>
          )}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button 
          onClick={handleSubmit} 
          variant="contained" 
          disabled={loading || !formData.scheduled_at}
        >
          {loading ? 'Scheduling...' : `Schedule ${isBulk ? 'Calls' : 'Call'}`}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ScheduleCallDialog;