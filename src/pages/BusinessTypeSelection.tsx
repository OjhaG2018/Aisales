import React, { useState } from 'react';
import {
  Box,
  Container,
  Paper,
  Typography,
  Button,
  Card,
  CardContent,
  Stepper,
  Step,
  StepLabel,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

const BusinessTypeSelection: React.FC = () => {
  const navigate = useNavigate();
  const [currentLevel, setCurrentLevel] = useState(1);
  const [selections, setSelections] = useState({
    industry: '',
    subcategory: '',
    businessType: '',
    businessModel: '',
  });

  const industries = [
    { id: 'retail', name: 'Retail', description: 'Physical and online stores' },
    { id: 'healthcare', name: 'Healthcare', description: 'Medical services and products' },
    { id: 'realestate', name: 'Real Estate', description: 'Property sales and rentals' },
    { id: 'education', name: 'Education', description: 'Educational services' },
    { id: 'finance', name: 'Finance', description: 'Financial services' },
    { id: 'technology', name: 'Technology', description: 'Tech products and services' },
  ];

  const subcategories = {
    retail: [
      { id: 'supermarket', name: 'Supermarket', description: 'Grocery and daily needs' },
      { id: 'electronics', name: 'Electronics', description: 'Electronic devices' },
      { id: 'apparel', name: 'Apparel', description: 'Clothing and fashion' },
      { id: 'automotive', name: 'Automotive', description: 'Vehicle sales and service' },
    ],
    healthcare: [
      { id: 'clinic', name: 'Clinic', description: 'Medical consultation' },
      { id: 'pharmacy', name: 'Pharmacy', description: 'Medicine and health products' },
      { id: 'diagnostic', name: 'Diagnostic', description: 'Medical testing' },
    ],
  };

  const businessTypes = {
    supermarket: [
      { id: 'grocery', name: 'Grocery Store', description: 'Food and daily essentials' },
      { id: 'multicategory', name: 'Multi-category', description: 'Various product categories' },
    ],
    electronics: [
      { id: 'mobile', name: 'Mobile Phones', description: 'Smartphones and accessories' },
      { id: 'computers', name: 'Computers', description: 'Laptops and desktops' },
      { id: 'appliances', name: 'Home Appliances', description: 'Kitchen and home appliances' },
    ],
  };

  const businessModels = [
    { id: 'franchise', name: 'Franchise', description: 'Licensed business model' },
    { id: 'independent', name: 'Independent', description: 'Standalone business' },
    { id: 'chain', name: 'Chain', description: 'Multiple locations' },
    { id: 'online', name: 'Online Only', description: 'E-commerce business' },
  ];

  const handleSelection = (level: number, value: string) => {
    const newSelections = { ...selections };
    
    if (level === 1) {
      newSelections.industry = value;
      newSelections.subcategory = '';
      newSelections.businessType = '';
    } else if (level === 2) {
      newSelections.subcategory = value;
      newSelections.businessType = '';
    } else if (level === 3) {
      newSelections.businessType = value;
    } else if (level === 4) {
      newSelections.businessModel = value;
    }
    
    setSelections(newSelections);
    
    if (level < 4) {
      setCurrentLevel(level + 1);
    }
  };

  const getCurrentOptions = () => {
    if (currentLevel === 1) return industries;
    if (currentLevel === 2) return subcategories[selections.industry as keyof typeof subcategories] || [];
    if (currentLevel === 3) return businessTypes[selections.subcategory as keyof typeof businessTypes] || [];
    if (currentLevel === 4) return businessModels;
    return [];
  };

  const getLevelTitle = () => {
    if (currentLevel === 1) return 'Select Industry Category';
    if (currentLevel === 2) return 'Select Business Subcategory';
    if (currentLevel === 3) return 'Select Specific Business Type';
    if (currentLevel === 4) return 'Select Business Model';
    return '';
  };

  const canProceed = () => {
    return selections.industry && selections.subcategory && selections.businessType && selections.businessModel;
  };

  const handleNext = () => {
    if (canProceed()) {
      localStorage.setItem('business_selections', JSON.stringify(selections));
      navigate('/onboarding/business-profile');
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f8f9fa', py: 4 }}>
      <Container maxWidth="lg">
        <Paper sx={{ p: 4, borderRadius: 3 }}>
          <Box textAlign="center" mb={4}>
            <Typography variant="h4" gutterBottom sx={{ fontWeight: 600 }}>
              Business Setup
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Help us understand your business better
            </Typography>
          </Box>

          <Stepper activeStep={currentLevel - 1} sx={{ mb: 4 }}>
            <Step>
              <StepLabel>Industry</StepLabel>
            </Step>
            <Step>
              <StepLabel>Subcategory</StepLabel>
            </Step>
            <Step>
              <StepLabel>Business Type</StepLabel>
            </Step>
            <Step>
              <StepLabel>Business Model</StepLabel>
            </Step>
          </Stepper>

          <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
            {getLevelTitle()}
          </Typography>

          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 4 }}>
            {getCurrentOptions().map((option) => (
              <Card
                key={option.id}
                sx={{
                  flex: '1 1 300px',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: '0 8px 25px rgba(0,0,0,0.1)',
                  },
                }}
                onClick={() => handleSelection(currentLevel, option.id)}
              >
                <CardContent>
                  <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                    {option.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {option.description}
                  </Typography>
                </CardContent>
              </Card>
            ))}
          </Box>

          {selections.industry && (
            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" gutterBottom>
                Your Selection:
              </Typography>
              <Typography variant="body1">
                {selections.industry} 
                {selections.subcategory && ` > ${selections.subcategory}`}
                {selections.businessType && ` > ${selections.businessType}`}
                {selections.businessModel && ` > ${selections.businessModel}`}
              </Typography>
            </Box>
          )}

          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
            <Button
              variant="outlined"
              onClick={() => setCurrentLevel(Math.max(1, currentLevel - 1))}
              disabled={currentLevel === 1}
            >
              Back
            </Button>
            <Button
              variant="contained"
              onClick={handleNext}
              disabled={!canProceed()}
              sx={{
                background: 'linear-gradient(310deg, #7928ca 0%, #ff0080 100%)',
                px: 4,
              }}
            >
              Continue to Business Profile
            </Button>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default BusinessTypeSelection;