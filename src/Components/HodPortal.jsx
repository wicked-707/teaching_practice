import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AproveSupervisor from './hodpanels/approveSupervisors';
import ApproveStudent from './hodpanels/approveStudent';

const HODPortal = () => {
  // overview data
  const [overviewData, setOverviewData] = useState({
    registered_students: 0,
    registered_supervisors: 0,
    approved_students: 0,
    approved_supervisors: 0,
    pending_students: 0,
    pending_supervisors: 0
  });



  const [students, setStudents] = useState([]);
  const [error, setError] = useState([]);
  const [verifiedStudents, setVerifiedStudents] = useState([]);
  const [supervisors, setSupervisors] = useState([]);
  const [approvedStudents, setApprovedStudents] = useState([]);
  const [approvedSupervisors, setApprovedSupervisors] = useState([]);
  const [studentsGrades, setStudentsGrades] = useState([]);
  const [activeSection, setActiveSection] = useState('dashboard');
  const [loading, setLoading] = useState('false');


  useEffect(() => {
    const fetchVerifiedStudents = async () => {
      try {
        const response = await axios.get('/api/students/verified');
        setVerifiedStudents(response.data.students);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch pending students');
        setLoading(false);
      }
    };
    // Fetch verified supervisors
    const fetchVerifiedSupervisors = async () => {
      try {
        const response = await axios.get('/api/supervisors/verified');
        setSupervisors(response.data.verified_supervisors);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch pending supervisors');
        setLoading(false);
      }
    };

    
    const fetchOverviewData = async () => {
      try {
        const response = await axios.get('/api/data/overview');
        const data = response.data;
        console.log("Overview data:", data);
        
        setOverviewData({
          registered_students: data.registered_students[0]?.count || 0,
          registered_supervisors: data.registered_supervisors[0]?.count || 0,
          approved_students: data.approved_students[0]?.count || 0,
          approved_supervisors: data.approved_supervisors[0]?.count || 0,
          pending_students: data.pending_students[0]?.count || 0,
          pending_supervisors: data.pending_supervisors[0]?.count || 0
        });

        setLoading(false);
      } catch (err) {
        console.error('Failed to fetch overview data:', err);
        setError('Failed to fetch overview data');
        setLoading(false);
      }
    };

    fetchOverviewData();

    // Fetch approved students
    fetchVerifiedStudents();
    fetchVerifiedSupervisors();
   
  }, []);

  console.log(overviewData);


 




  const renderSection = () => {
  switch (activeSection) {
    case 'approveStudents':
      return (
        <ApproveStudent/>
      );
      case 'approveSupervisors':
        return (
          <div>
            <AproveSupervisor/>
          </div>
        );
       
      case 'viewApprovedStudents':
        return (
          <div>
            <h2 className="text-2xl font-bold mb-4">Approved Students</h2>
            <div className="overflow-x-auto">
            <table className="min-w-full divide-y border divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">ID Number</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Phone</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Graduation Year</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Subjects</th>
                  {/* <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">County</th> */}
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Registration Date</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
              {!verifiedStudents && (
                    <tr>
                      <td colSpan="8" className="px-6 py-4 whitespace-nowrap text-center">No verified students found</td>
                    </tr>
                  )}
                {/* Map through the pending students and display them */}
                {verifiedStudents?.map((student) => (
                  <tr key={student.registration_id}>
                    <td className="px-6 py-4 whitespace-nowrap">{`${student.first_name} ${student.last_name}`}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{student.id_number}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{student.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{student.phone_number}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{new Date(student.graduation_date).toLocaleDateString()}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{student.primary_teaching_subject} & {student.secondary_teaching_subject}</td>
                    {/* <td className="px-6 py-4 whitespace-nowrap">{student.kenya_county}</td> */}
                    <td className="px-6 py-4 whitespace-nowrap">{new Date(student.created_at).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            </div>
          </div>
        );

        case 'viewApprovedSupervisors':
          return (
            <div>
              <h2 className="text-2xl font-bold mb-4">Approved Supervisors</h2>
              <div className="overflow-x-auto">
              <table className="min-w-full divide-y border divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Email</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Subject</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Registration Date</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y  divide-gray-200">
                {!supervisors && (
                      <tr>
                        <td colSpan="5" className="px-6 py-4 whitespace-nowrap text-center">No approved supervisors found</td>
                      </tr>
                    )}
                  {/* Map through the pending students and display them */}
                  {supervisors?.map((supervisor) => (
                    <tr key={supervisor.registration_id}>
                      <td className="px-4 py-2 whitespace-nowrap">{supervisor.supervisor_name}</td>
                  <td className="px-4 py-2 whitespace-nowrap">{supervisor.email}</td>
                  {/* <td className="px-4 py-2 whitespace-nowrap">{supervisor.university_id}</td> */}
                  <td className="px-4 py-2 whitespace-nowrap">{supervisor.course_name}</td>
                  <td className="px-4 py-2 whitespace-nowrap">{supervisor.approval_status}</td>
                  <td className="px-4 py-2 whitespace-nowrap">{supervisor.id}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
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
            <h2 className="text-xl text-center font-bold mb-4">Welcome to HOD Portal</h2>
            <div className="flex gap-2 flex-wrap ">
              <div className="flex flex-row p-4 bg-slate-100">
                <p>Registered Students: {overviewData.registered_students}</p>
              </div>
              <div className="bg-green-100 p-4">
                <p>Approved Students: {overviewData.approved_students}</p>
              </div>
              <div className="bg-yellow-100 p-4">
                <p>Pending Students: {overviewData.pending_students}</p>
              </div>
              <div className="bg-blue-100 p-4">
                <p>Registered Supervisors: {overviewData.registered_supervisors}</p>
              </div>
              <div className="bg-green-100 p-4">
                <p>Approved Supervisors: {overviewData.approved_supervisors}</p>
              </div>
              <div className="bg-yellow-100 p-4">
                <p>Pending Supervisors: {overviewData.pending_supervisors}</p>
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
          <h1 className="text-3xl text-center py-3 font-bold">TPConnect - HOD Portal</h1>
        </header>
        <main>
          {renderSection()}
        </main>
      </div>
    </div>
  );
};

export default HODPortal;
