import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import Dashboard from './pages/Dashboard';
import BusinessTypeSelection from './pages/BusinessTypeSelection';
import BusinessProfile from './pages/BusinessProfile';
import Profile from './pages/Profile';
import ContactsPage from './pages/ContactsPage';
import LeadsPage from './pages/LeadsPage';
import CampaignsPage from './pages/CampaignsPage';
import CallHistoryPage from './pages/CallHistoryPage';
import AnalyticsPage from './pages/AnalyticsPage';
import DashboardLayout from './components/DashboardLayout';

const theme = createTheme({
  palette: {
    primary: {
      main: '#7928ca',
    },
    secondary: {
      main: '#ff0080',
    },
    background: {
      default: '#f8f9fa',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/dashboard" element={<DashboardLayout><Dashboard /></DashboardLayout>} />
          <Route path="/onboarding/business-type" element={<BusinessTypeSelection />} />
          <Route path="/onboarding/business-profile" element={<BusinessProfile />} />
          <Route path="/profile" element={<DashboardLayout><Profile /></DashboardLayout>} />
          <Route path="/contacts" element={<DashboardLayout><ContactsPage /></DashboardLayout>} />
          <Route path="/leads" element={<DashboardLayout><LeadsPage /></DashboardLayout>} />
          <Route path="/campaigns" element={<DashboardLayout><CampaignsPage /></DashboardLayout>} />
          <Route path="/calls" element={<DashboardLayout><CallHistoryPage /></DashboardLayout>} />
          <Route path="/analytics" element={<DashboardLayout><AnalyticsPage /></DashboardLayout>} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;