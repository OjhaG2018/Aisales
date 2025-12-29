import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Card,
  CardContent,
  Chip,
  Divider,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

const Profile: React.FC = () => {
  const navigate = useNavigate();
  const [userProfile, setUserProfile] = useState({
    email: '',
    firstName: '',
    lastName: '',
    company: { name: '', phone: '' }
  });
  const [businessProfile, setBusinessProfile] = useState({
    industry_category: '',
    business_subcategory: '',
    specific_business_type: '',
    business_model: '',
    description: '',
    target_audience: '',
    unique_selling_points: [],
    competitors: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem('access_token');
      console.log('Token found:', !!token, token ? token.substring(0, 20) + '...' : 'none');
      
      if (!token) {
        console.error('No access token found');
        return;
      }
      
      // Fetch user profile
      console.log('Fetching user profile...');
      const userResponse = await fetch('https://aisalesbackend.rtcknowledge.com/api/v1/auth/profile/', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      console.log('User response status:', userResponse.status);
      if (userResponse.ok) {
        const userData = await userResponse.json();
        console.log('User data received:', userData);
        setUserProfile({
          email: userData.email || '',
          firstName: userData.first_name || '',
          lastName: userData.last_name || '',
          company: userData.company || { name: '', phone: '' }
        });
      } else {
        const errorText = await userResponse.text();
        console.error('Failed to fetch user profile:', userResponse.status, errorText);
      }
      
      // Fetch business profile
      console.log('Fetching business profile...');
      const businessResponse = await fetch('https://aisalesbackend.rtcknowledge.com/api/v1/onboarding/business-profile/get/', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      console.log('Business response status:', businessResponse.status);
      if (businessResponse.ok) {
        const businessData = await businessResponse.json();
        console.log('Business data received:', businessData);
        setBusinessProfile(businessData);
      } else {
        const errorText = await businessResponse.text();
        console.log('Business profile error:', businessResponse.status, errorText);
      }
      
    } catch (err) {
      console.error('Error fetching profile:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
        <Typography>Loading profile data...</Typography>
      </Box>
    );
  }

  // Debug: Log the current state
  console.log('Current userProfile state:', userProfile);
  console.log('Current businessProfile state:', businessProfile);
  console.log('Token exists:', !!localStorage.getItem('access_token'));

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 600, mb: 4 }}>
        Profile
      </Typography>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        {/* User Information */}
        <Card>
          <CardContent>
            <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
              User Information
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <TextField
                label="Email"
                value={userProfile.email}
                disabled
                fullWidth
              />
              <Box sx={{ display: 'flex', gap: 2 }}>
                <TextField
                  label="First Name"
                  value={userProfile.firstName}
                  disabled
                  sx={{ flex: 1 }}
                />
                <TextField
                  label="Last Name"
                  value={userProfile.lastName}
                  disabled
                  sx={{ flex: 1 }}
                />
              </Box>
            </Box>
          </CardContent>
        </Card>

        {/* Company Information */}
        <Card>
          <CardContent>
            <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
              Company Information
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <TextField
                label="Company Name"
                value={userProfile.company?.name || ''}
                disabled
                fullWidth
              />
              <TextField
                label="Phone"
                value={userProfile.company?.phone || ''}
                disabled
                fullWidth
              />
            </Box>
          </CardContent>
        </Card>

        {/* Business Profile */}
        <Card>
          <CardContent>
            <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
              Business Profile
            </Typography>
            
            {businessProfile.industry_category ? (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                <Box>
                  <Typography variant="h6" gutterBottom>
                    Business Classification
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                    <Chip label={`Industry: ${businessProfile.industry_category}`} color="primary" />
                    <Chip label={`Category: ${businessProfile.business_subcategory}`} color="secondary" />
                    <Chip label={`Type: ${businessProfile.specific_business_type}`} />
                    <Chip label={`Model: ${businessProfile.business_model}`} />
                  </Box>
                </Box>

                <Divider />

                <Box>
                  <Typography variant="h6" gutterBottom>
                    Business Description
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 2 }}>
                    {businessProfile.description || 'No description provided'}
                  </Typography>
                </Box>

                <Box>
                  <Typography variant="h6" gutterBottom>
                    Target Audience
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 2 }}>
                    {businessProfile.target_audience || 'No target audience defined'}
                  </Typography>
                </Box>

                <Box>
                  <Typography variant="h6" gutterBottom>
                    Unique Selling Points
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                    {businessProfile.unique_selling_points.length > 0 ? (
                      businessProfile.unique_selling_points.map((usp, index) => (
                        <Chip key={index} label={usp} variant="outlined" color="primary" />
                      ))
                    ) : (
                      <Typography variant="body2" color="text.secondary">No USPs defined</Typography>
                    )}
                  </Box>
                </Box>

                <Box>
                  <Typography variant="h6" gutterBottom>
                    Competitors
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {businessProfile.competitors.length > 0 ? (
                      businessProfile.competitors.map((competitor, index) => (
                        <Chip key={index} label={competitor} variant="outlined" color="secondary" />
                      ))
                    ) : (
                      <Typography variant="body2" color="text.secondary">No competitors listed</Typography>
                    )}
                  </Box>
                </Box>
              </Box>
            ) : (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
                  Business profile not completed
                </Typography>
                <Button
                  variant="contained"
                  onClick={() => navigate('/onboarding/business-type')}
                  sx={{ background: 'linear-gradient(310deg, #7928ca 0%, #ff0080 100%)' }}
                >
                  Complete Business Profile
                </Button>
              </Box>
            )}
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
          <Button
            variant="outlined"
            onClick={() => navigate('/dashboard')}
          >
            Back to Dashboard
          </Button>
          {businessProfile.industry_category && (
            <Button
              variant="contained"
              onClick={() => navigate('/onboarding/business-profile')}
              sx={{ background: 'linear-gradient(310deg, #7928ca 0%, #ff0080 100%)' }}
            >
              Edit Business Profile
            </Button>
          )}
        </Box>
      </Box>
    </Container>
  );
};

export default Profile;