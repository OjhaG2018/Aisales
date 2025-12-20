import React, { useState, useEffect } from 'react';

const ScheduleCallForm = () => {
  const [formData, setFormData] = useState({
    company: '',
    contact: '',
    campaign: '',
    scheduled_at: '',
    priority: 'normal',
    notes: '',
    reason: ''
  });

  const [companies, setCompanies] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(false);

  // Load companies on component mount
  useEffect(() => {
    fetchCompanies();
  }, []);

  // Load contacts when company changes
  useEffect(() => {
    if (formData.company) {
      fetchContacts(formData.company);
      fetchCampaigns(formData.company);
    }
  }, [formData.company]);

  const fetchCompanies = async () => {
    try {
      const response = await fetch('/api/v1/accounts/companies/', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      setCompanies(data.results || data);
    } catch (error) {
      console.error('Error fetching companies:', error);
    }
  };

  const fetchContacts = async (companyId) => {
    try {
      const response = await fetch(`/api/v1/contacts/?company=${companyId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      setContacts(data.results || data);
    } catch (error) {
      console.error('Error fetching contacts:', error);
    }
  };

  const fetchCampaigns = async (companyId) => {
    try {
      const response = await fetch(`/api/v1/campaigns/?company=${companyId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      setCampaigns(data.results || data);
    } catch (error) {
      console.error('Error fetching campaigns:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/v1/calls/scheduled/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        const result = await response.json();
        alert('Call scheduled successfully!');
        console.log('Scheduled call:', result);
        
        // Reset form
        setFormData({
          company: '',
          contact: '',
          campaign: '',
          scheduled_at: '',
          priority: 'normal',
          notes: '',
          reason: ''
        });
      } else {
        const error = await response.json();
        alert('Error scheduling call: ' + JSON.stringify(error));
      }
    } catch (error) {
      console.error('Error scheduling call:', error);
      alert('Error scheduling call');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6">Schedule Call</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Company Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Company *
          </label>
          <select
            name="company"
            value={formData.company}
            onChange={handleInputChange}
            required
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select Company</option>
            {companies.map(company => (
              <option key={company.id} value={company.id}>
                {company.name}
              </option>
            ))}
          </select>
        </div>

        {/* Contact Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Contact *
          </label>
          <select
            name="contact"
            value={formData.contact}
            onChange={handleInputChange}
            required
            disabled={!formData.company}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
          >
            <option value="">Select Contact</option>
            {contacts.map(contact => (
              <option key={contact.id} value={contact.id}>
                {contact.first_name} {contact.last_name} ({contact.phone})
              </option>
            ))}
          </select>
        </div>

        {/* Campaign Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Campaign (Optional)
          </label>
          <select
            name="campaign"
            value={formData.campaign}
            onChange={handleInputChange}
            disabled={!formData.company}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
          >
            <option value="">Select Campaign</option>
            {campaigns.map(campaign => (
              <option key={campaign.id} value={campaign.id}>
                {campaign.name}
              </option>
            ))}
          </select>
        </div>

        {/* Scheduled Date/Time */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Scheduled Date & Time *
          </label>
          <input
            type="datetime-local"
            name="scheduled_at"
            value={formData.scheduled_at}
            onChange={handleInputChange}
            required
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Priority */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Priority
          </label>
          <select
            name="priority"
            value={formData.priority}
            onChange={handleInputChange}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
          >
            <option value="low">Low</option>
            <option value="normal">Normal</option>
            <option value="high">High</option>
            <option value="urgent">Urgent</option>
          </select>
        </div>

        {/* Reason */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Reason
          </label>
          <input
            type="text"
            name="reason"
            value={formData.reason}
            onChange={handleInputChange}
            placeholder="e.g., Follow-up call, Product demo"
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Notes */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Notes
          </label>
          <textarea
            name="notes"
            value={formData.notes}
            onChange={handleInputChange}
            rows="3"
            placeholder="Additional notes for the call..."
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {loading ? 'Scheduling...' : 'Schedule Call'}
        </button>
      </form>
    </div>
  );
};

export default ScheduleCallForm;