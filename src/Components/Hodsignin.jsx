import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const HodSignin = () => {
  const [formData, setFormData] = useState({
    email: '',
    pass: ''
  });
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    // Clear error when user starts typing
    if (errors[e.target.name]) {
      setErrors({
        ...errors,
        [e.target.name]: ''
      });
    }
  };

  const validateForm = () => {
    let isValid = true;
    let newErrors = {};

    if (!formData.email) {
      newErrors.email = 'Email is required';
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
      isValid = false;
    }

    if (!formData.pass) {
      newErrors.pass = 'Password is required';
      isValid = false;
    } else if (formData.pass.length < 6) {
      newErrors.pass = 'Password must be at least 6 characters long';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMessage('');

    if (validateForm()) {
      try {
        const response = await axios.post('/api/hods/signin', formData);
        console.log('HOD signed in successfully:', response.data);
        setSuccessMessage('Signed in successfully!');
        // Reset form or redirect here
        setFormData({ email: '', pass: '' });
      } catch (error) {
        console.error('Error signing in HOD:', error);
        setErrors({ 
          ...errors, 
          general: error.response?.data?.message || 'An error occurred during sign in' 
        });
      }
    }
  };

  return (
    <div>
        <form onSubmit={handleSubmit}>
        <h2>HOD Sign In</h2>
        {successMessage && <div style={{ color: 'green' }}>{successMessage}</div>}
        {errors.general && <div style={{ color: 'red' }}>{errors.general}</div>}
        
        <div>
            <input 
            type="email" 
            name="email" 
            placeholder="Email" 
            value={formData.email} 
            onChange={handleChange} 
            required 
            />
            {errors.email && <div style={{ color: 'red' }}>{errors.email}</div>}
        </div>

        <div>
            <input 
            type="password" 
            name="pass" 
            placeholder="Password" 
            value={formData.pass} 
            onChange={handleChange} 
            required 
            />
            {errors.pass && <div style={{ color: 'red' }}>{errors.pass}</div>}
        </div>

        <button type="submit">Sign In</button>
        </form>
        <div className="mt-6 text-center">
          <p className="text-sm">
            Don't have an account?{' '}
            <Link to="/hodsignup" className="text-blue-600 hover:underline">
              Sign Up
            </Link>
          </p>
        </div>
    </div>
    
  );
};

export default HodSignin;