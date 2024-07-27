import React, { useState } from 'react';
import axios from 'axios';

const AddCourses = () => {
  const [courseCode, setCourseCode] = useState('');
  const [courseName, setCourseName] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/api/courses', {
        course_code: courseCode,
        course_name: courseName
      });

      if (response.status === 200 && response.data) {
        setMessage('Saved Successfully! Navigate to courses to edit or Delete the subject')
      }
      console.log('Course added:', response.data);
      setCourseCode('');
      setCourseName('');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Add Subject</h1>
      {message && <p className={`mb-4 ${message.includes('successful') ? 'text-green-500' : 'text-green-500'}`}>{message}</p>}
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="courseCode" className="block text-gray-700">Subject Code:</label>
          <input
            type="text"
            id="courseCode"
            name="courseCode"
            value={courseCode}
            onChange={(e) => setCourseCode(e.target.value)}
            className="border rounded w-full py-2 px-3"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="courseName" className="block text-gray-700">Subject Name:</label>
          <input
            type="text"
            id="courseName"
            name="courseName"
            value={courseName}
            onChange={(e) => setCourseName(e.target.value)}
            className="border rounded w-full py-2 px-3"
            required
          />
        </div>
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Save Subject
        </button>
      </form>
    </div>
  );
};

export default AddCourses;
