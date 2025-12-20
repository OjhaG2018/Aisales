import React, { useState } from 'react';
import { Button, Box, Alert, Typography } from '@mui/material';

const TestGroupCreation: React.FC = () => {
  const [result, setResult] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const testAuth = async () => {
    setLoading(true);
    setResult('');
    
    try {
      const token = localStorage.getItem('token');
      console.log('Token from localStorage:', token);
      
      if (!token) {
        setResult('No token found in localStorage');
        return;
      }
      
      // Test auth endpoint first
      const authResponse = await fetch('http://localhost:8000/api/v1/auth/profile/', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      
      console.log('Auth response status:', authResponse.status);
      
      if (!authResponse.ok) {
        const errorText = await authResponse.text();
        setResult(`Auth failed: ${authResponse.status} - ${errorText}`);
        return;
      }
      
      const authData = await authResponse.json();
      console.log('Auth data:', authData);
      setResult(`Auth successful: ${JSON.stringify(authData, null, 2)}`);
      
    } catch (error) {
      console.error('Auth test error:', error);
      setResult(`Auth test error: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  const testGroupCreation = async () => {
    setLoading(true);
    setResult('');
    
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        setResult('No token found in localStorage');
        return;
      }
      
      const testData = {
        name: 'Test Group ' + Date.now(),
        description: 'Test description',
        color: '#FF5722'
      };
      
      console.log('Creating group with data:', testData);
      
      const response = await fetch('http://localhost:8000/api/v1/contacts/groups/', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(testData),
      });
      
      console.log('Group creation response status:', response.status);
      console.log('Response headers:', Array.from(response.headers.entries()));
      
      const responseText = await response.text();
      console.log('Response text:', responseText);
      
      if (!response.ok) {
        setResult(`Group creation failed: ${response.status} - ${responseText}`);
        return;
      }
      
      const result = JSON.parse(responseText);
      setResult(`Group created successfully: ${JSON.stringify(result, null, 2)}`);
      
    } catch (error) {
      console.error('Group creation error:', error);
      setResult(`Group creation error: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ p: 2, border: '1px solid #ccc', borderRadius: 2, m: 2 }}>
      <Typography variant="h6" gutterBottom>
        Debug Contact Group Creation
      </Typography>
      
      <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
        <Button 
          variant="outlined" 
          onClick={testAuth}
          disabled={loading}
        >
          Test Auth
        </Button>
        <Button 
          variant="contained" 
          onClick={testGroupCreation}
          disabled={loading}
        >
          Test Group Creation
        </Button>
      </Box>
      
      {result && (
        <Alert severity={result.includes('successful') ? 'success' : 'error'}>
          <pre style={{ whiteSpace: 'pre-wrap', fontSize: '12px' }}>
            {result}
          </pre>
        </Alert>
      )}
    </Box>
  );
};

export default TestGroupCreation;