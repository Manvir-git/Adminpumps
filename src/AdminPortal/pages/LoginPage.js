import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Login.css'; // Make sure to create this CSS file

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    try {
        const response = await axios.post('http://localhost:5001/admin/login', {
          email,
          password
        });
  
        if (response.data.token) {
          // Store token
          localStorage.setItem('token', response.data.token);
          
          // Store last activity timestamp
          localStorage.setItem('lastActivity', Date.now());
  
          // Navigate to dashboard
          navigate('/dashboard');
        }}
    
     catch (err) {
      // Handle login errors
      setError(err.response?.data?.message || 'Login failed');
      console.error('Login error:', err);
    }
  };

  return (
    <div className='log'>
    <div className="auth-container">
      <div className="auth-form">
        <h2>Admin Login</h2>
        
        {error && (
          <div className="error-message">
            {error}
          </div>
        )}
        
        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Enter your email"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Enter your password"
            />
          </div>
          
          <button
            type="submit"
            className="login-button"
          >
            Sign In
          </button>
        </form>
      </div>
    </div>
    </div>
  );
};

export default Login;