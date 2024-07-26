// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { Link } from 'react-router-dom';
// import { getCurrentStudent } from '../Services/AuthService';
// import { jwtDecode } from 'jwt-decode';

// const SupervisorPortal = () => {
//   const [assignedStudents, setAssignedStudents] = useState([]);
//   const [submissions, setSubmissions] = useState([]);
//   const [grades, setGrades] = useState({});
//   const [activeSection, setActiveSection] = useState('dashboard');
//   const [supervisor, setSupervisor] = useState(null);

//   useEffect(() => {
//     fetchAssignedStudents();
//     fetchSubmissions();
//   }, []);
//   useEffect(() => {
//     const studentToken = getCurrentStudent();
//     const decodedToken = jwtDecode(studentToken);
//     // console.log(decodedToken);
//     if (!decodedToken) {
//       setError('Invalid token format');
//       setLoading(false);
//       return;
//     }

//     const supervisor = {
//       id: decodedToken.id,
//       course_id: decodedToken.course_id,
//       name: decodedToken.name,
//       university_name: decodedToken.university_id,
//       email: decodedToken.email,
//       roles: decodedToken.role,
//     };
//   console.log(supervisor);

    
//     setSupervisor(supervisor);
//   }, []);


//   const fetchAssignedStudents = async () => {
//     const response = await axios.get(`http://localhost:5000/students/subject/${supervisor?.course_id}`);
//     // console.log(response.data);
//     setAssignedStudents(response.data?.students);
//   };

//   const fetchSubmissions = async () => {
//     const response = await axios.get('/api/submissions');
//     setSubmissions(response.data);
//   };


//   const renderSection = () => {
//     switch (activeSection) {
//       case 'viewStudents':
//         return (
//           <div>
//             <h2 className="text-2xl font-bold mb-4">Assigned Students</h2>
//             {assignedStudents?.map((student) => (
//                 <div key={student.registration_id} className="bg-gray-100 p-4 mb-2">
//                 <Link to={`/assessment-details/student/${student.registration_id}`}>
//                   <h3 className="text-xl font-semibold">{student.first_name} {student.last_name}</h3>
//                 </Link>
//               </div>
//             ))}
//           </div>
//         );
      
//       default:
//         return (
//           <div>
//             <h2 className="text-2xl font-bold mb-4">Welcome to Supervisor Portal</h2>
//             <div className="grid grid-cols-2 gap-4">
//               <div className="bg-blue-100 p-4">
//                 <p>Assigned Students: {assignedStudents.length}</p>
//               </div>
//               <div className="bg-green-100 p-4">
//                 <p>Scheme of Work Submissions: {submissions.filter(sub => sub.type === 'Scheme of Work').length}</p>
//               </div>
//               <div className="bg-yellow-100 p-4">
//                 <p>Lesson Plan Submissions: {submissions.filter(sub => sub.type === 'Lesson Plan').length}</p>
//               </div>
//               <div className="bg-red-100 p-4">
//                 <p>Records of Work Submissions: {submissions.filter(sub => sub.type === 'Record of Work').length}</p>
//               </div>
//             </div>
//           </div>
//         );
//     }
//   };

//   return (
//     <div className="flex h-screen">
//       <div className="bg-gray-800 text-white w-1/4 min-h-screen flex flex-col">
//         <div className="p-4 text-center text-xl font-bold">TPConnect</div>
//         <nav className="flex flex-col p-4">
//           <button
//             className="p-2 my-2 text-left hover:bg-gray-700"
//             onClick={() => setActiveSection('dashboard')}
//           >
//             Dashboard
//           </button>
//           <button
//             className="p-2 my-2 text-left hover:bg-gray-700"
//             onClick={() => setActiveSection('viewStudents')}
//           >
//             View Students
//           </button>
//           {/* <button
//             className="p-2 my-2 text-left hover:bg-gray-700"
//             onClick={() => setActiveSection('viewSubmissions')}
//           >
//             View Submissions
//           </button> */}
//         </nav>
//       </div>
//       <div className="flex-1 p-8">
//         <header className="flex justify-between items-center mb-4">
//           <h1 className="text-3xl font-bold">TPConnect - Supervisor Portal</h1>
//           <nav className="space-x-4">
//             <button className="hover:underline">Home</button>
//             <button className="hover:underline">Contact</button>
//             <button className="hover:underline">Profile</button>
//           </nav>
//         </header>
//         <main>
//           {renderSection()}
//         </main>
//       </div>
//     </div>
//   );
// };

// export default SupervisorPortal;


import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { getCurrentStudent } from '../Services/AuthService';
import { jwtDecode } from 'jwt-decode';

const SupervisorPortal = () => {
  const [assignedStudents, setAssignedStudents] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [grades, setGrades] = useState({});
  const [activeSection, setActiveSection] = useState('dashboard');
  const [supervisor, setSupervisor] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const fetchData = async () => {
      try {
        const studentToken = getCurrentStudent();
        const decodedToken = jwtDecode(studentToken);
        if (!decodedToken) {
          console.error('Invalid token format');
          return;
        }
        const supervisorInfo = {
          id: decodedToken.registration_id,
          course_id: decodedToken.course_id,
          name: decodedToken.name,
          university_name: decodedToken.university_id,
          email: decodedToken.email,
          roles: decodedToken.role,
        };
        const userRoles = decodedToken.role;
        console.log(userRoles);
        if (!userRoles.includes('supervisor')) {
          console.error('Access denied');
          return;
        }
        
        if (isMounted) {
          setSupervisor(supervisorInfo);
          const response = await axios.get(`http://localhost:5000/students/subject/${supervisorInfo.course_id}`);
          setAssignedStudents(response.data?.students);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
  
    fetchData();
  
    return () => {
      isMounted = false;
    };
  }, []);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      window.location.href="/";
    }
  };

  const renderSection = () => {
    switch (activeSection) {
      case 'viewStudents':
        return (
          <div>
            <h2 className="text-2xl font-bold mb-4">Assigned Students</h2>
            <p className="mb-4 bg-[#ffeabc] p-2  text-sm md:text-md rounded-md">* Click on each student to see their details of submissions of attachment materials</p>
            {assignedStudents?.map((student) => (
              <div key={student.registration_id} className="bg-gray-100 p-4 mb-2">
                <Link to={`/assessment-details/student/${student.registration_id}`}>
                  <h3 className="text-xl font-semibold">{student.first_name} {student.last_name}</h3>
                </Link>
              </div>
            ))}
          </div>
        );
      
      default:
        return (
          <div>
            <h2 className="text-2xl font-bold mb-4">Welcome to Supervisor Portal</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-blue-100 p-4">
                <p>Assigned Students: {assignedStudents.length || 'Not Assigned'}</p>
              </div>
              <div className="bg-green-100 p-4">
                <p>Scheme of Work Submissions: {submissions.filter(sub => sub.type === 'Scheme of Work').length || 'Not found'}</p>
              </div>
              <div className="bg-yellow-100 p-4">
                <p>Lesson Plan Submissions: {submissions.filter(sub => sub.type === 'Lesson Plan').length || 'Not found'}</p>
              </div>
              <div className="bg-red-100 p-4">
                <p>Records of Work Submissions: {submissions.filter(sub => sub.type === 'Record of Work').length || 'Not found'}</p>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="flex flex-col md:flex-row h-screen">
      {/* Hamburger menu for small screens */}
      <button 
        className="md:hidden p-4 text-2xl  bg-gray-800 text-gray-100" 
        
      >
        <p onClick={toggleMenu} className='border border-gray-100 w-10 rounded-md hover:bg-slate-700'>☰</p>
      </button>

      {/* Sidebar */}
      <div className={`bg-gray-800 text-white w-full md:w-1/4 min-h-screen flex-col ${isMenuOpen ? 'flex' : 'hidden md:flex'}`}>
        <div className="p-4 text-center text-xl font-bold">TPConnect</div>
        <nav className="flex flex-col p-4">
          <button
            className="p-2 my-2 text-left hover:bg-gray-700"
            onClick={() => {
              setActiveSection('dashboard');
              setIsMenuOpen(false);
            }}
          >
            Dashboard
          </button>
          <button
            className="p-2 my-2 text-left hover:bg-gray-700"
            onClick={() => {
              setActiveSection('viewStudents');
              setIsMenuOpen(false);
            }}
          >
            View Students
          </button>
        </nav>
      </div>

      {/* Main content */}
      <div className="flex-1 p-4 md:p-8 overflow-auto">
        <header className="flex flex-col md:flex-row justify-between items-center mb-4">
          <h1 className="text-2xl md:text-3xl font-bold mb-2 md:mb-0">TPConnect - Supervisor Portal</h1>
          <nav className="space-y-2 md:space-y-0 md:space-x-4 relative">
           <div className='flex items-center'>
              <p>Welcome <span className='text-blue-500'>{supervisor?.name}</span></p>
                <div className="relative inline-block">
                  <button 
                    type="button" 
                    className="ml-2 inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    onClick={toggleDropdown}
                  >
                    Profile
                    <svg className="-mr-1 ml-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
           </div>
              {isOpen && supervisor && (
                <div className="absolute right-0 mt-44 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50">
                  <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
                    <div className="px-4 py-2 text-sm text-gray-700">
                      <p className="font-medium">{supervisor.name}</p>
                      <p className="text-gray-500">{supervisor.email}</p>
                      <p className="text-gray-500">Role: {supervisor.roles}</p>
                    </div>
                    <div className="border-t border-gray-100"></div>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                      role="menuitem"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
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