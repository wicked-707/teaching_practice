import React, { useState, useEffect } from 'react';
import axios from 'axios';

const SupervisorSignup = () => {
  const [universities, setUniversities] = useState([]);
  const [courses, setCourses] = useState([]);
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const [formData, setFormData] = useState({
    supervisor_name: '',
    email:'',
    university_id: '',
    course_id: '',
    password: '',
  });

  useEffect(() => {
    const fetchUniversities = async () => {
      try {
        const response = await axios.get('/api/universities');
        setUniversities(response.data);
      } catch (error) {
        console.error('Error fetching universities:', error);
      }
    };

    const fetchCourses = async () => {
      try {
        const response = await axios.get('/api/courses');
        setCourses(response.data);
      } catch (error) {
        console.error('Error fetching courses:', error);
      }
    };

    fetchUniversities();
    fetchCourses();
  }, []);

  const handleChange = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.supervisor_name) newErrors.supervisor_name = 'Supervisor name is required';
    if (!formData.email) newErrors.email = 'Email is required';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'Invalid email address';
    if (!formData.university_id) newErrors.university_id = 'University is required';
    if (!formData.course_id) newErrors.course_id = 'Course is required';
    if (!formData.password) newErrors.password = 'Password is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      const response = await axios.post('/api/supervisor/signup', formData);
      setMessage(response.data.message);
      setSubmitted(true);
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
      <h2 className="text-2xl font-bold mb-6">Supervisor Signup</h2>
      {submitted ? (
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Supervisor Registered Successfully!</h2>
          <p>Thank you for registering as a Supervisor.</p>
          {message && <p className="mb-4 text-red-600">{message}</p>}
        </div>
      ) : (
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700">Supervisor Name</label>
          <input
            type="text"
            name="supervisor_name"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none"
            value={formData.supervisor_name}
            onChange={handleChange}
          />
          {errors.supervisor_name && <p className="text-red-600">{errors.supervisor_name}</p>}
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

              
            <div>
  <label>Primary Teaching Subject</label>
  <select 
    name="course_id" 
    value={formData.course_id} 
    onChange={(e) => {
      const selectedSubject = courses.find(s => s.course_id.toString() === e.target.value);
      setFormData({
        ...formData,
        course_id: selectedSubject ? selectedSubject.course_id : '',
        course_name: selectedSubject ? selectedSubject.course_name : ''
      });
    }}
  >
    <option value="">Select Subject</option>
    {courses.map((course) => (
      <option key={course.course_id} value={course.course_id.toString()}>
        {course.course_name}
      </option>
    ))}
  </select>
  {errors.course_id && <p>{errors.course_id}</p>}
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

        <button
          type="submit"
          className="w-full bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          Signup
        </button>
      </form>
      )}
    </div>
  );
};

export default SupervisorSignup;
