import React, { useState } from 'react';
import {
  Box,
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Chip,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

const BusinessProfile: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    description: '',
    targetAudience: '',
    uspInput: '',
    competitorInput: '',
  });
  const [usps, setUsps] = useState<string[]>([]);
  const [competitors, setCompetitors] = useState<string[]>([]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleAddUSP = () => {
    if (formData.uspInput.trim()) {
      setUsps([...usps, formData.uspInput.trim()]);
      setFormData({ ...formData, uspInput: '' });
    }
  };

  const handleAddCompetitor = () => {
    if (formData.competitorInput.trim()) {
      setCompetitors([...competitors, formData.competitorInput.trim()]);
      setFormData({ ...formData, competitorInput: '' });
    }
  };

  const handleDeleteUSP = (index: number) => {
    setUsps(usps.filter((_, i) => i !== index));
  };

  const handleDeleteCompetitor = (index: number) => {
    setCompetitors(competitors.filter((_, i) => i !== index));
  };

  const refreshToken = async () => {
    const refresh = localStorage.getItem('refresh_token');
    if (!refresh) return null;
    
    try {
      const response = await fetch('http://localhost:8000/api/v1/auth/token/refresh/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refresh }),
      });
      
      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('access_token', data.access);
        return data.access;
      }
    } catch (err) {
      console.error('Token refresh failed:', err);
    }
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      let token = localStorage.getItem('access_token');
      const selections = JSON.parse(localStorage.getItem('business_selections') || '{}');
      
      let response = await fetch('http://localhost:8000/api/v1/onboarding/business-profile/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          industry: selections.industry || 'retail',
          subcategory: selections.subcategory || 'electronics',
          business_type: selections.businessType || 'mobile',
          business_model: selections.businessModel || 'independent',
          description: formData.description,
          target_audience: formData.targetAudience,
          unique_selling_points: usps,
          competitors: competitors,
        }),
      });

      if (response.status === 401) {
        token = await refreshToken();
        if (token) {
          response = await fetch('http://localhost:8000/api/v1/onboarding/business-profile/', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({
              industry: selections.industry || 'retail',
              subcategory: selections.subcategory || 'electronics',
              business_type: selections.businessType || 'mobile',
              business_model: selections.businessModel || 'independent',
              description: formData.description,
              target_audience: formData.targetAudience,
              unique_selling_points: usps,
              competitors: competitors,
            }),
          });
        } else {
          navigate('/login');
          return;
        }
      }

      if (response.ok) {
        localStorage.removeItem('business_selections');
        navigate('/dashboard');
      } else {
        console.error('Failed to save business profile');
      }
    } catch (err) {
      console.error('Error saving business profile:', err);
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f8f9fa', py: 4 }}>
      <Container maxWidth="md">
        <Paper sx={{ p: 4, borderRadius: 3 }}>
          <Box textAlign="center" mb={4}>
            <Typography variant="h4" gutterBottom sx={{ fontWeight: 600 }}>
              Business Profile
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Tell us more about your business
            </Typography>
          </Box>

          <form onSubmit={handleSubmit}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              <TextField
                fullWidth
                multiline
                rows={4}
                label="Business Description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe what your business does..."
                required
              />

              <TextField
                fullWidth
                multiline
                rows={3}
                label="Target Audience"
                name="targetAudience"
                value={formData.targetAudience}
                onChange={handleChange}
                placeholder="Who are your ideal customers?"
                required
              />

              <Box>
                <Typography variant="h6" gutterBottom>
                  Unique Selling Points
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                  <TextField
                    fullWidth
                    label="Add USP"
                    name="uspInput"
                    value={formData.uspInput}
                    onChange={handleChange}
                    placeholder="What makes you unique?"
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddUSP())}
                  />
                  <Button
                    variant="contained"
                    onClick={handleAddUSP}
                    sx={{ background: 'linear-gradient(310deg, #7928ca 0%, #ff0080 100%)' }}
                  >
                    Add
                  </Button>
                </Box>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {usps.map((usp, index) => (
                    <Chip
                      key={index}
                      label={usp}
                      onDelete={() => handleDeleteUSP(index)}
                      sx={{ bgcolor: 'rgba(121, 40, 202, 0.1)' }}
                    />
                  ))}
                </Box>
              </Box>

              <Box>
                <Typography variant="h6" gutterBottom>
                  Main Competitors
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                  <TextField
                    fullWidth
                    label="Add Competitor"
                    name="competitorInput"
                    value={formData.competitorInput}
                    onChange={handleChange}
                    placeholder="Who are your competitors?"
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddCompetitor())}
                  />
                  <Button
                    variant="contained"
                    onClick={handleAddCompetitor}
                    sx={{ background: 'linear-gradient(310deg, #17c1e8 0%, #7928ca 100%)' }}
                  >
                    Add
                  </Button>
                </Box>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {competitors.map((competitor, index) => (
                    <Chip
                      key={index}
                      label={competitor}
                      onDelete={() => handleDeleteCompetitor(index)}
                      sx={{ bgcolor: 'rgba(23, 193, 232, 0.1)' }}
                    />
                  ))}
                </Box>
              </Box>

              <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
                <Button
                  variant="outlined"
                  onClick={() => navigate('/onboarding/business-type')}
                >
                  Back
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  sx={{
                    background: 'linear-gradient(310deg, #7928ca 0%, #ff0080 100%)',
                    px: 4,
                  }}
                >
                  Complete Setup
                </Button>
              </Box>
            </Box>
          </form>
        </Paper>
      </Container>
    </Box>
  );
};

export default BusinessProfile;