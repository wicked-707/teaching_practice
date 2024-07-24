import React, { useState, useEffect } from 'react';
import axios from 'axios';

const SupervisorPortal = () => {
  const [assignedStudents, setAssignedStudents] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [grades, setGrades] = useState({});
  const [activeSection, setActiveSection] = useState('dashboard');

  useEffect(() => {
    fetchAssignedStudents();
    fetchSubmissions();
  }, []);

  const fetchAssignedStudents = async () => {
    const response = await axios.get('/api/supervisors/assigned_students');
    setAssignedStudents(response.data);
  };

  const fetchSubmissions = async () => {
    const response = await axios.get('/api/submissions');
    setSubmissions(response.data);
  };

  const handleGradeSubmit = async (studentId) => {
    await axios.post(`/api/submissions/${studentId}/grade`, { grade: grades[studentId] });
    fetchSubmissions(); // Refresh submissions list after grading
  };

  const renderSection = () => {
    switch (activeSection) {
      case 'viewStudents':
        return (
          <div>
            <h2 className="text-2xl font-bold mb-4">Assigned Students</h2>
            {assignedStudents.map((student) => (
              <div key={student.id} className="bg-gray-100 p-4 mb-2">
                <h3 className="text-xl font-semibold">{student.first_name} {student.last_name}</h3>
                {submissions
                  .filter(submission => submission.student_id === student.id)
                  .map(submission => (
                    <div key={submission.id} className="bg-white p-4 mb-2">
                      <h4 className="text-lg font-bold">{submission.type}</h4>
                      <p>{submission.details}</p>
                      <button
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                        onClick={() => setActiveSection(`grade-${student.id}`)}
                      >
                        Grade Student
                      </button>
                    </div>
                  ))}
              </div>
            ))}
          </div>
        );
      case 'gradeStudent':
        const studentId = parseInt(activeSection.split('-')[1], 10);
        return (
          <div>
            <h2 className="text-2xl font-bold mb-4">Grade Student</h2>
            <div className="bg-gray-100 p-4 mb-2">
              <h3 className="text-xl font-semibold">Student ID: {studentId}</h3>
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="grade">
                  Grade
                </label>
                <input
                  type="number"
                  id="grade"
                  className="border rounded w-full py-2 px-3 text-gray-700"
                  value={grades[studentId] || ''}
                  onChange={(e) => setGrades({ ...grades, [studentId]: e.target.value })}
                />
                <button
                  className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mt-4"
                  onClick={() => handleGradeSubmit(studentId)}
                >
                  Submit Grade
                </button>
              </div>
            </div>
          </div>
        );
      case 'viewSubmissions':
        return (
          <div>
            <h2 className="text-2xl font-bold mb-4">Submissions</h2>
            {submissions.map((submission) => (
              <div key={submission.id} className="bg-gray-100 p-4 mb-2">
                <h4 className="text-lg font-bold">{submission.type}</h4>
                <p>{submission.details}</p>
              </div>
            ))}
          </div>
        );
      default:
        return (
          <div>
            <h2 className="text-2xl font-bold mb-4">Welcome to Supervisor Portal</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-blue-100 p-4">
                <p>Assigned Students: {assignedStudents.length}</p>
              </div>
              <div className="bg-green-100 p-4">
                <p>Scheme of Work Submissions: {submissions.filter(sub => sub.type === 'Scheme of Work').length}</p>
              </div>
              <div className="bg-yellow-100 p-4">
                <p>Lesson Plan Submissions: {submissions.filter(sub => sub.type === 'Lesson Plan').length}</p>
              </div>
              <div className="bg-red-100 p-4">
                <p>Records of Work Submissions: {submissions.filter(sub => sub.type === 'Record of Work').length}</p>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="flex h-screen">
      <div className="bg-gray-800 text-white w-1/4 min-h-screen flex flex-col">
        <div className="p-4 text-center text-xl font-bold">TPConnect</div>
        <nav className="flex flex-col p-4">
          <button
            className="p-2 my-2 text-left hover:bg-gray-700"
            onClick={() => setActiveSection('dashboard')}
          >
            Dashboard
          </button>
          <button
            className="p-2 my-2 text-left hover:bg-gray-700"
            onClick={() => setActiveSection('viewStudents')}
          >
            View Students
          </button>
          <button
            className="p-2 my-2 text-left hover:bg-gray-700"
            onClick={() => setActiveSection('viewSubmissions')}
          >
            View Submissions
          </button>
        </nav>
      </div>
      <div className="flex-1 p-8">
        <header className="flex justify-between items-center mb-4">
          <h1 className="text-3xl font-bold">TPConnect - Supervisor Portal</h1>
          <nav className="space-x-4">
            <button className="hover:underline">Home</button>
            <button className="hover:underline">Contact</button>
            <button className="hover:underline">Profile</button>
          </nav>
        </header>
        <main>
          {renderSection()}
        </main>
      </div>
    </div>
  );
};

export default SupervisorPortal;
