import React, { useState } from 'react';

const SignupTest = () => {
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  const testSignup = async () => {
    setLoading(true);
    setResult('Testing...');
    
    try {
      const testData = {
        first_name: 'Test',
        last_name: 'User',
        email: `test${Date.now()}@example.com`, // Unique email
        password: 'testpass123',
        company_name: 'Test Company',
        phone: '+1234567890'
      };

      console.log('Sending test signup request:', testData);

      const response = await fetch('https://aisalesbackend.rtcknowledge.com/api/v1/auth/signup/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(testData),
      });

      console.log('Response status:', response.status);
      console.log('Response headers:', Object.fromEntries(response.headers.entries()));

      if (response.ok) {
        const data = await response.json();
        console.log('Success response:', data);
        setResult(`✅ SUCCESS: User created with ID ${data.user.id}`);
      } else {
        const errorData = await response.json();
        console.error('Error response:', errorData);
        setResult(`❌ ERROR: ${JSON.stringify(errorData, null, 2)}`);
      }
    } catch (error) {
    console.error('Network error:', error);
   setResult(`❌ NETWORK ERROR: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'monospace' }}>
      <h2>Signup API Test</h2>
      <button 
        onClick={testSignup} 
        disabled={loading}
        style={{ 
          padding: '10px 20px', 
          fontSize: '16px',
          backgroundColor: loading ? '#ccc' : '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: loading ? 'not-allowed' : 'pointer'
        }}
      >
        {loading ? 'Testing...' : 'Test Signup API'}
      </button>
      
      {result && (
        <div style={{ 
          marginTop: '20px', 
          padding: '15px', 
          backgroundColor: result.includes('SUCCESS') ? '#d4edda' : '#f8d7da',
          border: `1px solid ${result.includes('SUCCESS') ? '#c3e6cb' : '#f5c6cb'}`,
          borderRadius: '4px',
          whiteSpace: 'pre-wrap'
        }}>
          {result}
        </div>
      )}
    </div>
  );
};

export default SignupTest;