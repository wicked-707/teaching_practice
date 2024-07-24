import React, { useState, useEffect } from 'react';
import SchemesofWork from './SchemesofWork';
import LessonPlan from './LessonPlan';
import RecordOfWork from './RecordOfWork';
import logo1 from '../assets/logo1.jpeg';
import { getCurrentStudent } from '../Services/AuthService';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';

const Submissions = () => {
  const [student, setStudent] = useState(null);
  const [selectedForm, setSelectedForm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleLogout = () => {
    sessionStorage.clear();
    localStorage.clear();
    navigate('/signin');
  };

  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

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
        if (!userRoles.includes('student-teacher')) {
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
        setLoading(false);
      } catch (err) {
        console.error('Error fetching student data:', err);
        setError('Failed to fetch student data');
        setLoading(false);
      }
    };

    fetchStudentData();
  }, [navigate]);

  const renderForm = () => {
    switch (selectedForm) {
      case 'assessment':
        return <SchemesofWork />;
      case 'lessonPlan':
        return <LessonPlan />;
      case 'recordOfWork':
        return <RecordOfWork />;
      default:
        return (
          <div className='ml-10'>
            <p className="text-slate-800 text-3xl font-bold mb-5 mt-2">
              Welcome to {student ? `${student.university_name}` : 'Student-teacher'} Submissions Portal
            </p>
            <p className="mb-4">
              Dear {student?.first_name}! This portal is designed to help you submit your Scheme of Work, Lesson Plan, and Records efficiently and effectively.
              <br />Please follow the instructions below to navigate through the portal and submit your work.
            </p>

            <h2 className="text-xl font-semibold mb-2">How to Use the Portal</h2>
            <ul className="list-disc list-inside mb-4">
              <li>Use the links on the left sidebar to navigate to the submission forms.</li>
              <li>Choose the type of work you want to submit: Scheme of Work, Lesson Plan, or Records.</li>
              <li>Fill out the form with the required information and submit it.</li>
            </ul>

            <h2 className="text-xl font-semibold mb-2">Submission Guidelines</h2>
            <ul className="list-disc list-inside mb-4">
              <li>Ensure all submissions are in the required format (e.g., PDF, DOCX).</li>
              <li>Include all necessary details as specified in the guidelines for each type of work.</li>
              <li>Submit your work before the deadline to avoid any penalties.</li>
            </ul>

            <h2 className="text-xl font-semibold mb-2">Important Dates</h2>
            <p className="mb-4">
              Please keep an eye on the following dates to ensure timely submissions:
            </p>
            <ul className="list-disc list-inside mb-4">
              <li>Scheme of Work Submission Deadline: [Date]</li>
              <li>Lesson Plan Submission Deadline: [Date]</li>
              <li>Records Submission Deadline: [Date]</li>
            </ul>

            <h2 className="text-xl font-semibold mb-2">Contact Information</h2>
            <p className="mb-4">
              If you have any questions or encounter any issues, please contact the support team at <a href="mailto:support@university.edu" className="text-blue-600 underline">support@university.edu</a>.
            </p>

            <h2 className="text-xl font-semibold mb-2">Announcements</h2>
            <p className="mb-4">
              [Any relevant announcements or updates can be placed here.]
            </p>
          </div>
        );
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <header className='flex flex-row items-center justify-between w-full h-20 bg-slate-100 px-4 sm:px-6 lg:px-8 shadow-xl border-b fixed top-0 z-50'>
        <div className='flex items-center'>
          <img className='w-14 h-14 rounded-full shadow-lg' src={logo1} alt="Logo" />
          <h1 className='ml-4 text-lg font-bold text-slate-700'>TPConnect</h1>
        </div>
        <div className="relative flex items-center">
          <h1 className='text-lg text-slate-800'>
            <span className='text-sm'>Hello, </span>
            {student ? student.first_name : 'Student-teacher'}
          </h1>
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

          {isOpen && (
            <div className="absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50">
              <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
                <div className="px-4 py-2 text-sm text-gray-700">
                  <p className="font-medium">{student.first_name} {student.last_name}</p>
                  <p className="text-gray-500">{student.email}</p>
                  <p className="text-gray-500">Role: {student.roles}</p>
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
      </header>

      <div className="flex flex-1 mt-20">
        <nav className="flex items-start flex-col w-64 bg-slate-100 p-4 shadow-inner fixed h-full">
          <p className='mb-5 mt-8'>Please select the activity to fill and submit.</p>
          <button
            onClick={() => setSelectedForm('assessment')}
            className="text-slate-800 mb-1 hover:translate-x-1"
          >
            Scheme Of Work
          </button>
          <div className='w-full border-b border-slate-200 rounded-full'></div>
          <button
            onClick={() => setSelectedForm('lessonPlan')}
            className="text-slate-800 py-2 rounded"
          >
            Lesson Plan
          </button>
          <div className='w-full border-b border-slate-200 rounded-full'></div>
          <button
            onClick={() => setSelectedForm('recordOfWork')}
            className="text-slate-800 py-2"
          >
            Record Of Work
          </button>
        </nav>

        <main className="flex-1 ml-64 p-4 bg-slate-50">
          {loading ? (
            <div className="flex justify-center items-center h-full">
              <p>Loading...</p>
            </div>
          ) : error ? (
            <div className="flex justify-center items-center h-full">
              <p>{error}</p>
            </div>
          ) : (
            renderForm()
          )}
        </main>
      </div>
    </div>
  );
};

export default Submissions;

// // src/components/Submissions.jsx
// import React, { useState, useEffect } from 'react';
// import SchemesofWork from './SchemesofWork';
// import LessonPlan from './LessonPlan';
// import RecordOfWork from './RecordOfWork';
// import logo1 from '../assets/logo1.jpeg';
// import { getCurrentStudent } from '../Services/AuthService';
// import { jwtDecode } from 'jwt-decode';
// import { useNavigate } from 'react-router-dom';


// const Submissions = () => {
//   const [student, setStudent] = useState(null);
//   const [selectedForm, setSelectedForm] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const navigate = useNavigate();

//   const handleLogout = () => {
//     sessionStorage.clear();
//     localStorage.clear();
//     navigate('/signin');
//   };
//   const [isOpen, setIsOpen] = useState(false);

//   const toggleDropdown = () => {
//     setIsOpen(!isOpen);
//   };

//   useEffect(() => {
//     const fetchStudentData = async () => {
//       try {
//         const studentToken = getCurrentStudent();
//         if (!studentToken) {
//           navigate('/signin', { state: { from: location.pathname } });
//           return;
//         }

//         const decodedToken = jwtDecode(studentToken);
//         if (!decodedToken) {
//           setError('Invalid token format');
//           setLoading(false);
//           return;
//         }

//         const userRoles = decodedToken.role;
//         if (!userRoles.includes('student-teacher')) {
//           setError('Access denied');
//           setLoading(false);
//           return;
//         }

//         const studentData = {
//           id: decodedToken.registration_id,
//           first_name: decodedToken.first_name,
//           last_name: decodedToken.last_name,
//           university_name: decodedToken.university_name,
//           email: decodedToken.email,
//           roles: decodedToken.role,
//         };

//         setStudent(studentData);
//         setLoading(false);
//       } catch (err) {
//         console.error('Error fetching student data:', err);
//         setError('Failed to fetch student data');
//         setLoading(false);
//       }
//     };

//     fetchStudentData();
//   }, [navigate]);

//   const renderForm = () => {
//     switch (selectedForm) {
//       case 'assessment':
//         return <SchemesofWork />;
//       case 'lessonPlan':
//         return <LessonPlan />;
//       case 'recordOfWork':
//         return <RecordOfWork />;
//       default:
//         return <div className='ml-10'>
//                   <p className="text-slate-800 text-3xl font-bold mb-5 mt-2"><p>Welcome to {student ? `${student.university_name}` : 'Student-teacher'} Submissions Portal</p></p>
//                   <p className="mb-4">
//         Dear {student.first_name}! This portal is designed to help you submit your Scheme of Work, Lesson Plan, and Records efficiently and effectively. 
//         <br />Please follow the instructions below to navigate through the portal and submit your work.
//       </p>
      
//       <h2 className="text-xl font-semibold mb-2">How to Use the Portal</h2>
//       <ul className="list-disc list-inside mb-4">
//         <li>Use the links on the left sidebar to navigate to the submission forms.</li>
//         <li>Choose the type of work you want to submit: Scheme of Work, Lesson Plan, or Records.</li>
//         <li>Fill out the form with the required information and submit it.</li>
//       </ul>
      
//       <h2 className="text-xl font-semibold mb-2">Submission Guidelines</h2>
//       <ul className="list-disc list-inside mb-4">
//         <li>Ensure all submissions are in the required format (e.g., PDF, DOCX).</li>
//         <li>Include all necessary details as specified in the guidelines for each type of work.</li>
//         <li>Submit your work before the deadline to avoid any penalties.</li>
//       </ul>
      
//       <h2 className="text-xl font-semibold mb-2">Important Dates</h2>
//       <p className="mb-4">
//         Please keep an eye on the following dates to ensure timely submissions:
//       </p>
//       <ul className="list-disc list-inside mb-4">
//         <li>Scheme of Work Submission Deadline: [Date]</li>
//         <li>Lesson Plan Submission Deadline: [Date]</li>
//         <li>Records Submission Deadline: [Date]</li>
//       </ul>
      
//       <h2 className="text-xl font-semibold mb-2">Contact Information</h2>
//       <p className="mb-4">
//         If you have any questions or encounter any issues, please contact the support team at <a href="mailto:support@university.edu" className="text-blue-600 underline">support@university.edu</a>.
//       </p>
      
//       <h2 className="text-xl font-semibold mb-2">Announcements</h2>
//       <p className="mb-4">
//         [Any relevant announcements or updates can be placed here.]
//       </p>
                  
//                </div> ;
//     }
//   };

//   return (
//     <div className="">
//       <header className='flex flex-row items-center justify-between w-screen h-20 bg-slate-100 right-0 px-4 sm:px-6 lg:px-8 shadow-xl border-b'>
//         <div className='flex flex-row md:ml-16 lg:ml-14 items-center'>
//           <img className='w-14 h-14 rounded-full md:mr-5 shadow-lg' src={logo1} alt="" />
//           <h1 className='md:text-lg font-bold text-slate-700'>TPConnect</h1>
//         </div>
//         {/* <h1>Welcome, {student ? `${student.first_name} ${student.last_name}` : 'Student-teacher'}</h1> */}
//         <div className="relative text-left flex flex-row items-center">
//           <h1 className='flex items-center text-lg text-slate-800'>
//             <p className='text-sm mb-3 mr-1'>Hello</p>
//             {student ? `${student.first_name}` : 'Student-teacher'}
//           </h1>
//           <div>
//             <button 
//               type="button" 
//               className="ml-2 inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
//               onClick={toggleDropdown}
//             >
//               Profile
//               <svg className="-mr-1 ml-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
//                 <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
//               </svg>
//             </button>
//           </div>
//         </div>
    

//       {isOpen && (
//         <div className="fixed right-2 sm:right-6 lg:right-8 mt-48 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50">
//           <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
//             <div className="px-4 py-2 text-sm text-gray-700">
//               <p className="font-medium">{student.first_name} {student.last_name}</p>
//               <p className="text-gray-500">{student.email}</p>
//               <p className="text-gray-500">Role: {student.roles}</p>
//             </div>
//             <div className="border-t border-gray-100"></div>
//             <button
//               onClick={handleLogout}
//               className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
//               role="menuitem"
//             >
//               Logout
//             </button>
//           </div>
//         </div>
//       )}
//       </header>
        
//       {/* <h1 className="text-2xl font-bold mb-4">Submissions</h1> */}
//       <div className='flex flex-row'>
//         <div className="mb-4 flex flex-col items-start pl-4 w-1/4 h-screen bg-slate-100">
//           <p className='mb-5 mt-8'>Please select the activity to fill and submit.</p>
//           <button
//             onClick={() => setSelectedForm('assessment')}
//             className="text-slate-800 mb-1 hover:translate-x-1"
//           >
//             Scheme Of Work
//           </button>
//           <div className='w-full border-b border-slate-200 rounded-full'></div>
//           <button
//             onClick={() => setSelectedForm('lessonPlan')}
//             className="text-slate-800 py-2 rounded"
//           >
//             Lesson Plan
//           </button>
//           <div className='w-full border-b border-slate-200 rounded-full'></div>

//           <button
//             onClick={() => setSelectedForm('recordOfWork')}
//             className="text-slate-800 py-2 "
//           >
//             Records of Work
//           </button>
//         </div>
//         <div className="mt-4">
//           {renderForm()}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Submissions;
