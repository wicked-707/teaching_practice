import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [editCourseId, setEditCourseId] = useState(null);
  const [editCourseData, setEditCourseData] = useState({ course_code: '', course_name: '' });

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get('/api/courses');
        setCourses(response.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchCourses();
  }, []);

  const deleteCourse = async (id) => {
    try {
      await axios.delete(`/api/courses/${id}`);
      setCourses(courses.filter(course => course.course_id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const startEditCourse = (course) => {
    setEditCourseId(course.course_id);
    setEditCourseData({ course_code: course.course_code, course_name: course.course_name });
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditCourseData(prevState => ({ ...prevState, [name]: value }));
  };

  const saveEditCourse = async (id) => {
    try {
      await axios.put(`/api/courses/${id}`, editCourseData);
      setCourses(courses.map(course => (course.course_id === id ? { ...course, ...editCourseData } : course)));
      setEditCourseId(null);
      setEditCourseData({ course_code: '', course_name: '' });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Courses</h1>
      <table className="min-w-full bg-white">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b">Course Code</th>
            <th className="py-2 px-4 border-b">Course Name</th>
            <th className="py-2 px-4 border-b">Actions</th>
          </tr>
        </thead>
        <tbody>
          {courses.map((course) => (
            <tr key={course.course_id}>
              <td className="py-2 px-4 border-b">
                {editCourseId === course.course_id ? (
                  <input
                    type="text"
                    name="course_code"
                    value={editCourseData.course_code}
                    onChange={handleEditChange}
                    className="border rounded px-2 py-1"
                  />
                ) : (
                  course.course_code
                )}
              </td>
              <td className="py-2 px-4 border-b">
                {editCourseId === course.course_id ? (
                  <input
                    type="text"
                    name="course_name"
                    value={editCourseData.course_name}
                    onChange={handleEditChange}
                    className="border rounded px-2 py-1"
                  />
                ) : (
                  course.course_name
                )}
              </td>
              <td className="py-2 px-4 border-b">
                {editCourseId === course.course_id ? (
                  <button
                    onClick={() => saveEditCourse(course.course_id)}
                    className="bg-green-500 text-white px-4 py-2 rounded"
                  >
                    Save
                  </button>
                ) : (
                  <>
                    <button
                      onClick={() => startEditCourse(course)}
                      className="bg-yellow-500 text-white px-4 py-2 rounded mr-2"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteCourse(course.course_id)}
                      className="bg-red-500 text-white px-4 py-2 rounded"
                    >
                      Delete
                    </button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Courses;
