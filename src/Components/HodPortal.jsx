import React, { useState, useEffect } from 'react';
import axios from 'axios';

const HODPortal = () => {
  const [students, setStudents] = useState([]);
  const [supervisors, setSupervisors] = useState([]);
  const [approvedStudents, setApprovedStudents] = useState([]);
  const [approvedSupervisors, setApprovedSupervisors] = useState([]);
  const [studentsGrades, setStudentsGrades] = useState([]);
  const [activeSection, setActiveSection] = useState('dashboard');

  useEffect(() => {
    fetchStudents();
    fetchSupervisors();
    fetchApprovedStudents();
    fetchApprovedSupervisors();
    fetchStudentsGrades();
  }, []);

  const fetchStudents = async () => {
    const response = await axios.get('/api/students/pending');
    setStudents(response.data);
  };

  const fetchSupervisors = async () => {
    const response = await axios.get('/api/supervisors/pending');
    setSupervisors(response.data);
  };

  const fetchApprovedStudents = async () => {
    const response = await axios.get('/api/students/approved');
    setApprovedStudents(response.data);
  };

  const fetchApprovedSupervisors = async () => {
    const response = await axios.get('/api/supervisors/approved');
    setApprovedSupervisors(response.data);
  };

  const fetchStudentsGrades = async () => {
    const response = await axios.get('/api/students/grades');
    setStudentsGrades(response.data);
  };

  const approveStudent = async (studentId) => {
    await axios.post(`/api/students/${studentId}/approve`);
    fetchStudents();
    fetchApprovedStudents();
  };

  const disapproveStudent = async (studentId) => {
    await axios.post(`/api/students/${studentId}/disapprove`);
    fetchApprovedStudents();
    fetchStudents();
  };

  const approveSupervisor = async (supervisorId) => {
    await axios.post(`/api/supervisors/${supervisorId}/approve`);
    fetchSupervisors();
    fetchApprovedSupervisors();
  };

  const disapproveSupervisor = async (supervisorId) => {
    await axios.post(`/api/supervisors/${supervisorId}/disapprove`);
    fetchApprovedSupervisors();
    fetchSupervisors();
  };

  const renderSection = () => {
    switch (activeSection) {
      case 'approveStudents':
        return (
          <div>
            <h2 className="text-2xl font-bold mb-4">Approve Students</h2>
            {students.map((student) => (
              <div key={student.id} className="flex justify-between items-center bg-gray-100 p-4 mb-2">
                <div>
                  <p>Name: {student.first_name} {student.last_name}</p>
                  <p>Email: {student.email}</p>
                  <p>Primary Subject: {student.primary_teaching_subject}</p>
                </div>
                <button
                  className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                  onClick={() => approveStudent(student.id)}
                >
                  Approve
                </button>
              </div>
            ))}
          </div>
        );
      case 'approveSupervisors':
        return (
          <div>
            <h2 className="text-2xl font-bold mb-4">Approve Supervisors</h2>
            {supervisors.map((supervisor) => (
              <div key={supervisor.id} className="flex justify-between items-center bg-gray-100 p-4 mb-2">
                <div>
                  <p>Name: {supervisor.first_name} {supervisor.last_name}</p>
                  <p>Email: {supervisor.email}</p>
                </div>
                <button
                  className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                  onClick={() => approveSupervisor(supervisor.id)}
                >
                  Approve
                </button>
              </div>
            ))}
          </div>
        );
      case 'viewApprovedStudents':
        return (
          <div>
            <h2 className="text-2xl font-bold mb-4">Approved Students</h2>
            {approvedStudents.map((student) => (
              <div key={student.id} className="flex justify-between items-center bg-gray-100 p-4 mb-2">
                <div>
                  <p>Name: {student.first_name} {student.last_name}</p>
                  <p>Email: {student.email}</p>
                  <p>Primary Subject: {student.primary_teaching_subject}</p>
                </div>
                <button
                  className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                  onClick={() => disapproveStudent(student.id)}
                >
                  Disapprove
                </button>
              </div>
            ))}
          </div>
        );
      case 'viewApprovedSupervisors':
        return (
          <div>
            <h2 className="text-2xl font-bold mb-4">Approved Supervisors</h2>
            {approvedSupervisors.map((supervisor) => (
              <div key={supervisor.id} className="flex justify-between items-center bg-gray-100 p-4 mb-2">
                <div>
                  <p>Name: {supervisor.first_name} {supervisor.last_name}</p>
                  <p>Email: {supervisor.email}</p>
                </div>
                <button
                  className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                  onClick={() => disapproveSupervisor(supervisor.id)}
                >
                  Disapprove
                </button>
              </div>
            ))}
          </div>
        );
      case 'viewGrades':
        return (
          <div>
            <h2 className="text-2xl font-bold mb-4">Students' Grades</h2>
            {studentsGrades.map((grade) => (
              <div key={grade.student_id} className="bg-gray-100 p-4 mb-2">
                <p>Student Name: {grade.student_name}</p>
                <p>Primary Subject: {grade.primary_subject}</p>
                <p>Grade: {grade.grade}</p>
              </div>
            ))}
          </div>
        );
      default:
        return (
          <div>
            <h2 className="text-2xl font-bold mb-4">Welcome to HOD Portal</h2>
            <div className="flex flex-wrap ">
              <div className="flex flex-row h-20 w-32 bg-slate-950">
                <p>Registered Students: {students.length + approvedStudents.length}</p>
              </div>
              <div className="bg-green-100 p-4">
                <p>Approved Students: {approvedStudents.length}</p>
              </div>
              <div className="bg-yellow-100 p-4">
                <p>Pending Students: {students.length}</p>
              </div>
              <div className="bg-blue-100 p-4">
                <p>Registered Supervisors: {supervisors.length + approvedSupervisors.length}</p>
              </div>
              <div className="bg-green-100 p-4">
                <p>Approved Supervisors: {approvedSupervisors.length}</p>
              </div>
              <div className="bg-yellow-100 p-4">
                <p>Pending Supervisors: {supervisors.length}</p>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="flex h-screen w-screen">
      <div className="bg-gray-800 text-white w-1/4 h-screen flex flex-col">
        <div className="p-4 text-center text-xl font-bold">TPConnect</div>
        <nav className="flex flex-col pl-4">
          <button
            className="p-2 my-2 text-left hover:bg-gray-700"
            onClick={() => setActiveSection('dashboard')}
          >
            Dashboard
          </button>
          <button
            className="p-2 my-2 text-left hover:bg-gray-700"
            onClick={() => setActiveSection('approveStudents')}
          >
            Approve Students
          </button>
          <button
            className="p-2 my-2 text-left hover:bg-gray-700"
            onClick={() => setActiveSection('approveSupervisors')}
          >
            Approve Supervisors
          </button>
          <button
            className="p-2 my-2 text-left hover:bg-gray-700"
            onClick={() => setActiveSection('viewApprovedStudents')}
          >
            View Approved Students
          </button>
          <button
            className="p-2 my-2 text-left hover:bg-gray-700"
            onClick={() => setActiveSection('viewApprovedSupervisors')}
          >
            View Approved Supervisors
          </button>
          <button
            className="p-2 my-2 text-left hover:bg-gray-700"
            onClick={() => setActiveSection('viewGrades')}
          >
            View Students' Grades
          </button>
        </nav>
      </div>
      <div className="flex flex-col h-screen pl-2 w-3/4">
        <header className="flex flex-col justify-between items-centerright-0">
          <nav className="space-x-4 flex items-center justify-end bg-slate-900 lg:ml-48 lg:mt-10  mb-10  w-4/5 h-10 rounded-l-full">
            <div className='mr-40'>
              <button className="hover:underline text-white mr-10">Home</button>
              <button className="hover:underline text-white">Contact</button>
            </div>
            <button className="hover:underline text-white">Profile</button>
          </nav>
          <h1 className="text-3xl font-bold">TPConnect - HOD Portal</h1>
        </header>
        <main>
          {renderSection()}
        </main>
      </div>
    </div>
  );
};

export default HODPortal;
