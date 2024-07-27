import React, { useState } from 'react';
import axios from 'axios';
import {jwtDecode} from 'jwt-decode';

const AdminSignin = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [formErrors, setFormErrors] = useState({});
  const [message, setMessage] = useState('');

  const validateForm = () => {
    const errors = {};
    if (!formData.email) errors.email = 'Email is required';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) errors.email = 'Invalid email address';
    if (!formData.password) errors.password = 'Password is required';
    if (formData.password.length < 8) errors.password = 'Password must be at least 8 characters';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (validateForm()) {
      try {
        const response = await axios.post('/api/admin/signin', formData);
        console.log('Response:', response); // Log the entire response

        if (response.status === 200 && response.data) {
          const { token, data } = response.data;
          if (!token) throw new Error('No Token Found');
          
          localStorage.setItem('token', token);
          localStorage.setItem('user', JSON.stringify(data));
          
          const decodedToken = jwtDecode(token);
          const role = decodedToken.role;

          setMessage('Login successful');

          // Redirect based on role
          if (role === 'admin') {
            window.location.href = '/adminportal';
          } else {
            window.location.href = '/adminportal';
          }
        } else {
          throw new Error('Unexpected response structure');
        }
      } catch (error) {
        console.error('Login error:', error);
        console.error('Response:', error.response);
        console.error('Response data:', error.response?.data);

        if (error.response && error.response.data && error.response.data.message) {
          setMessage(error.response.data.message);
        } else {
          setMessage('Error submitting form: ' + (error.message || 'Unknown error'));
        }
      }
    }
  };

  const handleChange = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <div className="w-full max-w-md bg-white shadow-md rounded px-8 py-6">
        <h2 className="text-2xl font-bold mb-4 text-center">Admin Login</h2>
        {message && <p className={`mb-4 ${message.includes('successful') ? 'text-green-500' : 'text-red-500'}`}>{message}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="mt-1 block w-full p-2 border border-gray-300 rounded"
            />
            {formErrors.email && <p className="text-red-500 text-sm mt-1">{formErrors.email}</p>}
          </div>
          <div>
            <label className="block text-gray-700">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="mt-1 block w-full p-2 border border-gray-300 rounded"
            />
            {formErrors.password && <p className="text-red-500 text-sm mt-1">{formErrors.password}</p>}
          </div>
          <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded mt-4">
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminSignin;