import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {jwtDecode} from 'jwt-decode';
import axios from 'axios';
import { getCurrentStudent } from '../../Services/AuthService';
import logo1 from '../../assets/logo1.jpeg';

function StudentGrade() {
  const [student, setStudent] = useState(null);
  const [marks, setMarks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStudentData = async () => {
      try {
        const studentToken = getCurrentStudent();
        if (!studentToken) {
          navigate('/signin', { state: { from: location.pathname } });
          return;
        }

        const decodedToken = jwtDecode(studentToken);
        if (!decodedToken) {
          setError('Invalid token format');
          setLoading(false);
          return;
        }

        const userRoles = decodedToken.role;
        if (!userRoles.includes('student')) {
          setError('Access denied');
          setLoading(false);
          return;
        }

        const studentData = {
          id: decodedToken.registration_id,
          first_name: decodedToken.first_name,
          last_name: decodedToken.last_name,
          university_name: decodedToken.university_name,
          email: decodedToken.email,
          roles: decodedToken.role,
        };

        setStudent(studentData);

        // Fetch the student marks by ID
        const marksResponse = await axios.get(`http://localhost:5000/grading/${studentData.id}`);
        if (marksResponse.data.assessment_marks) {
          setMarks(marksResponse.data.assessment_marks);
        } else {
          setMarks([]);
        //   setError('No assessment marks found for the given student ID');
        }
        setLoading(false);
      } catch (err) {
        console.error('Error fetching student data:', err);
        setError('Failed to fetch student data');
        setLoading(false);
      }
    };

    fetchStudentData();
  }, [navigate]);

  if (loading) return <div className="flex items-center justify-center h-screen">Loading...</div>;
  if (error) return <div className="flex items-center justify-center h-screen text-red-500">{error}</div>;

  return (
    <main className="min-h-screen bg-gray-100 ">
      <header className='flex flex-row items-center justify-between w-full h-20 bg-slate-100 right-0 px-4 sm:px-6 lg:px-8 shadow-xl border-b'>
        <div className='flex flex-row md:ml-16 lg:ml-14 items-center'>
          <img className='w-14 h-14 rounded-full md:mr-5 shadow-lg' src={logo1} alt="" />
          <h1 className='md:text-lg font-bold text-slate-700 hidden md:flex '>TPConnect</h1>
        </div>
        <div className="relative text-left flex flex-row items-center">
          <div className="flex items-center">
            <p className='text-sm mr-1 hidden md:flex'>Welcome,</p>
            <h1 className='text-md text-slate-800 flex '>
              {student ? `${student.first_name}` : 'Student'}
            </h1>
          </div>
          <div>
            <button 
              type="button" 
              className="ml-2 inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Profile
              <svg className="-mr-1 ml-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 011.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </div>
      </header>
      <div className="max-w-4xl md:mx-auto m-4 bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="p-4 bg-indigo-600 text-white text-center">
          <h1 className="text-2xl font-bold">Student Grade Report</h1>
        </div>
        {student && (
          <div className="p-6">
            <div className="mb-4">
              <h2 className="text-xl font-bold">Student Details</h2>
              <p><strong>Name:</strong> {student.first_name} {student.last_name}</p>
              <p><strong>Student Id:</strong> {student.id}</p>
              <p><strong>Email:</strong> {student.email}</p>
            </div>
            <div>
              <h2 className="text-xl font-bold">Assessment Marks</h2>
              {marks.length > 0 ? (
                <table className="min-w-full bg-white">
                  <thead>
                    <tr>
                      {/* <th className="py-2 px-4 border-b">Assessment ID</th> */}
                      <th className="py-2 px-4 border-b">Total Marks</th>
                    </tr>
                  </thead>
                  <tbody>
                    {marks.map((mark) => (
                      <tr key={mark.id}>
                        {/* <td className="py-2 px-4 border-b">{mark.id}</td> */}
                        <td className="py-2 px-4 border-b font-bold text-lg text-center">{mark.total_marks} points</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p className="text-center text-gray-500">No marks awarded</p>
              )}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

export default StudentGrade;

