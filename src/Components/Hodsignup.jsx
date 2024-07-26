import React, { useState, useEffect } from 'react';
import axios from 'axios';

const HodSignup = () => {
  const [formData, setFormData] = useState({
    hod_name: '',
    email: '',
    password: '',
    university_id: '',
  });

  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState('');
  const [universities, setUniversities] = useState([]);

  const handleChange = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };

  useEffect(() => {
    const fetchUniversities = async () => {
      try {
        const response = await axios.get('/api/universities');
        setUniversities(response.data);
      } catch (error) {
        console.error('Error fetching universities:', error);
      }
    };

    fetchUniversities();
  }, []);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.hod_name) newErrors.hod_name = 'HOD name is required';
    if (!formData.email) newErrors.email = 'Email is required';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'Invalid email address';
    if (!formData.password) newErrors.password = 'Password is required';
    if (formData.password.length < 8) newErrors.password = 'Password must be at least 8 characters long';
    if (!formData.university_id) newErrors.university_id = 'University ID is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      const response = await axios.post('/api/hods/signup', formData);
      setMessage(response.data.message);
      setFormData({ hod_name: '', email: '', password: '', university_id: '' });
      setErrors({});
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
      <h2 className="text-2xl font-bold mb-6">HOD Signup</h2>
      {message && <p className={message.includes('success') ? 'text-green-600' : 'text-red-600'}>{message}</p>}
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700">HOD Name</label>
          <input
            type="text"
            name="hod_name"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none"
            value={formData.hod_name}
            onChange={handleChange}
          />
          {errors.hod_name && <p className="text-red-600">{errors.hod_name}</p>}
        </div>

        <div className="mb-4">
          <label className="block text-gray-700">Email</label>
          <input
            type="email"
            name="email"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none"
            value={formData.email}
            onChange={handleChange}
          />
          {errors.email && <p className="text-red-600">{errors.email}</p>}
        </div>

        <div className="mb-4">
          <label className="block text-gray-700">Password</label>
          <input
            type="password"
            name="password"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none"
            value={formData.password}
            onChange={handleChange}
          />
          {errors.password && <p className="text-red-600">{errors.password}</p>}
        </div>

        <div>
              <label>University</label>
              
                <select 
                  name="university_id" 
                  value={formData.university_id} 
                  onChange={(e) => {
                    const selectedUniversity = universities.find(u => u.university_id.toString() === e.target.value);
                    setFormData({
                      ...formData,
                      university_id: selectedUniversity ? selectedUniversity.university_id : '',
                      university_name: selectedUniversity ? selectedUniversity.university_name : ''
                    });
                  }}
                >
                  <option value="">Select University</option>
                  {universities.map((university) => (
                    <option key={university.university_id} value={university.university_id.toString()}>
                      {university.university_name}
                    </option>
                  ))}
                </select>
             
              {errors.university_id && <p>{errors.university_id}</p>}
            </div>


        <button
          type="submit"
          className="w-full bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          Signup
        </button>
      </form>
    </div>
  );
};

export default HodSignup;
