import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { getCurrentStudent } from '../Services/AuthService';
import {jwtDecode} from 'jwt-decode';

const AdminSettings = () => {
  const [adminData, setAdminData] = useState({
    admin_name: '',
    email: '',
    password: ''
  });

  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const adminToken = getCurrentStudent();
        if (!adminToken) {
          navigate('/adminsignin', { state: { from: location.pathname } });
          return;
        }

        const decodedToken = jwtDecode(adminToken);
        console.log('Decoded token:', decodedToken);  // Add this line for debugging

        if (!decodedToken) {
          setError('Invalid token format');
          setLoading(false);
          return;
        }

        // Check if role exists and is an array or string
        const userRoles = decodedToken.role;
        if (!userRoles || (Array.isArray(userRoles) && !userRoles.includes('admin')) || 
            (typeof userRoles === 'string' && userRoles !== 'admin')) {
          setError('Access denied');
          setLoading(false);
          return;
        }

        setAdminData({
          admin_name: decodedToken.admin_name || decodedToken.name || 'Admin',
          email: decodedToken.email || 'Not provided',
          password: ''
        });

        setLoading(false);
      } catch (err) {
        console.error('Error fetching admin data:', err);
        setError('Error fetching admin data');
        setLoading(false);
      }
    };

    fetchAdminData();
  }, [navigate]);

  const handleChange = (e) => {
    setAdminData({ ...adminData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put('/api/admin', adminData, {
        headers: { token: token }
      });
      console.log('Admin updated:', response.data);
      alert('Information updated successfully!');
    } catch (err) {
      console.error(err);
      alert('Error updating information.');
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Admin Settings</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="admin_name" className="block text-gray-700">Admin Name</label>
          <input
            type="text"
            id="admin_name"
            name="admin_name"
            value={adminData.admin_name}
            onChange={handleChange}
            className="border rounded w-full py-2 px-3"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="email" className="block text-gray-700">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={adminData.email}
            onChange={handleChange}
            className="border rounded w-full py-2 px-3"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="password" className="block text-gray-700">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            value={adminData.password}
            onChange={handleChange}
            className="border rounded w-full py-2 px-3"
          />
        </div>
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Update Information
        </button>
      </form>
    </div>
  );
};

export default AdminSettings;
