import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import {jwtDecode} from 'jwt-decode';

const SupervisorSignin = () => {
  const [email, setEmail] = useState('jane.doe@example.com');
  const [password, setPassword] = useState('SecureP@ssw0rd');
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState('');

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
      const response = await axios.post('http://localhost:5000/supervisor/signin', {
        email,
        password,
      });
      setMessage(response.data.message);
      alert('sign in succesful')
      console.log("djks");
      // Handle successful signin, e.g., store token, redirect, etc.

      const { token, data} = response.data;
     
      if(!token) throw new Error('No Token Found')
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(data));
        const decodedToken = jwtDecode(token);
        const approval_status = decodedToken.approval_status;
      // redirect to supersor page in the status is verified

      // console.log("decodedToken", decodedToken);
      window.location.href = '/supervisorportal';

      if (approval_status === 'verified') {
        window.location.href = '/supervisorportal';
      }
    } catch (error) {
      if (error.response && error.response.data.message) {
        setMessage(error.response.data.message);
      } else {
        setMessage('Error submitting form');
      }
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
