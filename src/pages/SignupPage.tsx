import React, { useState } from 'react';
import {
  Box,
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Link,
  Alert,
  Grid,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

const SignupPage: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    companyName: '',
    phone: '',
  });
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      console.log('Sending signup request with data:', {
        first_name: formData.firstName,
        last_name: formData.lastName,
        email: formData.email,
        company_name: formData.companyName,
        phone: formData.phone
      });
      
      const response = await fetch('https://aisalesbackend.rtcknowledge.com/api/v1/auth/signup/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          first_name: formData.firstName,
          last_name: formData.lastName,
          email: formData.email,
          password: formData.password,
          company_name: formData.companyName,
          phone: formData.phone
        }),
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('token', data.tokens.access);
        localStorage.setItem('refreshToken', data.tokens.refresh);
        localStorage.setItem('user', JSON.stringify(data.user));
        navigate('/onboarding/business-type');
      } else {
        const errorData = await response.json();
        console.error('Signup error:', errorData);
        
        // Handle different types of errors
        let errorMessage = 'Registration failed';
        if (errorData.email && Array.isArray(errorData.email)) {
          errorMessage = errorData.email[0];
        } else if (errorData.detail) {
          errorMessage = errorData.detail;
        } else if (errorData.non_field_errors && Array.isArray(errorData.non_field_errors)) {
          errorMessage = errorData.non_field_errors[0];
        } else if (typeof errorData === 'string') {
          errorMessage = errorData;
        }
        
        setError(errorMessage);
      }
    } catch (err) {
      console.error('Signup error:', err);
      setError('Registration failed');
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(310deg, #7928ca 0%, #ff0080 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: 2,
      }}
    >
      <Container maxWidth="md">
        <Paper
          elevation={24}
          sx={{
            p: 4,
            borderRadius: 3,
            background: 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(20px)',
          }}
        >
          <Box textAlign="center" mb={3}>
            <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 600 }}>
              Create Your Account
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Start your AI sales journey today
            </Typography>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                <TextField
                  label="First Name"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                  sx={{ flex: '1 1 200px' }}
                />
                <TextField
                  label="Last Name"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                  sx={{ flex: '1 1 200px' }}
                />
              </Box>
              <TextField
                fullWidth
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
              <TextField
                fullWidth
                label="Company Name"
                name="companyName"
                value={formData.companyName}
                onChange={handleChange}
                required
              />
              <TextField
                fullWidth
                label="Phone Number"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
              />
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                <TextField
                  label="Password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  sx={{ flex: '1 1 200px' }}
                />
                <TextField
                  label="Confirm Password"
                  name="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  sx={{ flex: '1 1 200px' }}
                />
              </Box>
            </Box>

            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              sx={{
                py: 1.5,
                mt: 3,
                background: 'linear-gradient(310deg, #7928ca 0%, #ff0080 100%)',
                fontWeight: 600,
                mb: 2,
              }}
            >
              Create Account
            </Button>
          </form>

          <Box textAlign="center">
            <Typography variant="body2">
              Already have an account?{' '}
              <Link
                component="button"
                variant="body2"
                onClick={() => navigate('/login')}
                sx={{ fontWeight: 600 }}
              >
                Sign in here
              </Link>
            </Typography>
          </Box>

          <Box textAlign="center" mt={2}>
            <Link
              component="button"
              variant="body2"
              onClick={() => navigate('/')}
              sx={{ color: 'text.secondary' }}
            >
              ← Back to Home
            </Link>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default SignupPage;