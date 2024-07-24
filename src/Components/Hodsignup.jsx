import React, { useState } from 'react';
import axios from 'axios';

const HodSignup = () => {
  const [formData, setFormData] = useState({
    hod_name: '',
    email: '',
    department_id: '',
    hod_number: '',
    pass: '',
    confirm_pass: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const response = await axios.post('http://localhost:5000/hods', formData);
      console.log('HOD signed up successfully:', response.data);
      // Reset form or redirect here
    } catch (error) {
      console.error('Error signing up HOD:', error);
      // Handle error in UI
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="text" name="hod_name" placeholder="Name" value={formData.hod_name} onChange={handleChange} required />
      <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
      <input type="text" name="department_id" placeholder="Department ID" value={formData.department_id} onChange={handleChange} required />
      <input type="text" name="hod_number" placeholder="HOD Number" value={formData.hod_number} onChange={handleChange} required />
      <input type="password" name="pass" placeholder="Password" value={formData.pass} onChange={handleChange} required />
      <input type="password" name="confirm_pass" placeholder="Confirm Password" value={formData.confirm_pass} onChange={handleChange} required />
      <button type="submit">Sign Up</button>
    </form>
  );
};

export default HodSignup;
