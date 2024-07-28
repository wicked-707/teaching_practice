import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

const SupervisorSignin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors = {};
    if (!email) newErrors.email = 'Email is required';
    if (!password) newErrors.password = 'Password is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      const response = await axios.post('/api/supervisor/signin', {
        email,
        password,
      });
      
      const { token, data } = response.data;
      console.log(response.data)

      if (!token) throw new Error('No Token Found');
      
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(data));
      
      const decodedToken = jwtDecode(token);
      const approval_status = decodedToken.approval_status;

      setMessage('Sign in successful');

      // Redirect based on approval status
      if (approval_status === 'approved') {
        navigate('/supervisorportal');
      } else if (approval_status === 'pending') {
        navigate('/pending');
      } else {
        setMessage('Your account status is not recognized.');
      }
    } catch (error) {
      if (error.response && error.response.data.message) {
        setMessage(error.response.data.message);
      } else {
        setMessage('Error submitting form');
      }
      console.error('Signin error:', error);
    }
  };

  return (
    <div className="max-w-md mx-auto my-10 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6">Supervisor Signin</h2>
      {message && <p className="mb-4 text-red-600">{message}</p>}
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700">Email</label>
          <input
            type="email"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          {errors.email && <p className="text-red-600">{errors.email}</p>}
        </div>

        <div className="mb-4">
          <label className="block text-gray-700">Password</label>
          <input
            type="password"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {errors.password && <p className="text-red-600">{errors.password}</p>}
        </div>

        <button
          type="submit"
          className="w-full bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          Signin
        </button>
      </form>
      <div className="mt-6 text-center">
        <p className="text-sm">
          Don't have an account?{' '}
          <Link to="/supervisorsignup" className="text-blue-600 hover:underline">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SupervisorSignin;