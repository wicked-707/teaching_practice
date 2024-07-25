// import React, { useEffect, useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { jwtDecode } from 'jwt-decode';
// import axios from 'axios';
// import { getCurrentStudent } from '../Services/AuthService';
// import logo1 from '../assets/logo1.jpeg';
// import { Link } from 'react-router-dom';


// function Studentportal() {
//   const [student, setStudent] = useState(null);
//   const [vacancies, setVacancies] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const navigate = useNavigate();

 

//   const [formData, setFormData] = useState({
//     primarySubject: '',
//     schoolName: '',
//     county: '',
//     subCounty: '',
//     schoolType: '',
//     schoolLevel: '',
//   });

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData({
//       ...formData,
//       [name]: value,
//     });
//   };

//   const goToVacancydetails = () => {
//   navigate('/vacancy/:vancancy_id');
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
//         if (!userRoles.includes('student')) {
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
//         // setError('Failed to fetch student data');
//         setLoading(false);
//       }
//     };

//     const fetchVacancies = async () => {
//       try {
//         const token = localStorage.getItem('token');
//         const headers = { Authorization: `Bearer ${token}` };

//         const response = await axios.get('http://localhost:5000/vacancies', { 
//           headers: {
//           'Content-Type': 'application/json',
//           'Accept': 'application/json'
//         },
        
//       }
//         );
//         if (Array.isArray(response.data.vacancies)) {
//           setVacancies(response.data.vacancies);
//         } else {
//           throw new Error('Invalid vacancies response format');
//         }
//       } catch (err) {
//         console.error('Error fetching vacancies:', err.message);
//         setError(err.message);
//       }
//     };

//     fetchStudentData();
//     fetchVacancies();
//   }, [navigate]);

//   console.log(vacancies);

//   const handleLogout = () => {
//     sessionStorage.clear();
//     localStorage.clear();
//     navigate('/signin');
//   };
//   const [isOpen, setIsOpen] = useState(false);

//   const toggleDropdown = () => {
//     setIsOpen(!isOpen);
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     // Construct query parameters based on filled criteria
//     const queryParams = Object.entries(formData)
//       .filter(([key, value]) => value) // Filter out empty values
//       .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
//       .join('&');

//     try {
//       const response = await axios.get(`/api/vacancies?${queryParams}`);
//       // Handle the response as needed, e.g., set it to a state
//       console.log('Search Results:', response.data);
//     } catch (error) {
//       console.error('Error fetching search results:', error);
//     }
//   };

//   if (loading) {
//     return <div>Loading...</div>;
//   }

//   if (error) {
//     return <div>Error: {error}</div>;
//   }

//   return (
//     <div className="student-portal text-black">
//       <header className='flex flex-row items-center justify-between w-screen h-20 bg-slate-100 right-0 px-4 sm:px-6 lg:px-8 shadow-xl border-b'>
//         <div className='flex flex-row md:ml-16 lg:ml-14 items-center'>
//           <img className='w-14 h-14 rounded-full md:mr-5 shadow-lg' src={logo1} alt="" />
//           <h1 className='md:text-lg font-bold text-slate-700'>TPConnect</h1>
//         </div>
//         {/* <h1>Welcome, {student ? `${student.first_name} ${student.last_name}` : 'Student-teacher'}</h1> */}
//         <div className="relative text-left flex flex-row items-center">
//            <Link to="/submissions">
//              <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
//                 Submit Assessment
//               </button>
//             </Link>
//            <Link to="/lessonobservationreport">
//              <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
//                 Assessment Grading
//               </button>
//             </Link>
//           <h1 className='flex items-center text-lg text-slate-800'>
//             <p className='text-sm mb-3 mr-1'>Welcome</p>
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
//       {/* <section className="profile">
//         <h2>Profile Information</h2>
//         <div className="profile-popup">
//           <h2>{student.first_name}</h2>
//           <p>Email: {student.email}</p>
//           <p>Role: {student.roles}</p>
//           <button onClick={handleLogout}>Logout</button>
//         </div>
//       </section> */}

//       <section className="vacancies w-screen flex flex-wrap items-start bg-slate-50">
//          <div className="w-1/4 bg-slate-100 h-screen p-4 overflow-y-auto">
//       <h2 className="text-lg font-semibold mb-4">Search Vacancies</h2>
//       <form className="space-y-4" onSubmit={handleSubmit}>
//         <div>
//           <label htmlFor="primarySubject" className="block text-sm font-medium text-gray-700">Primary Subject</label>
//           <select
//             id="primarySubject"
//             name="primarySubject"
//             value={formData.primarySubject}
//             onChange={handleChange}
//             className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
//           >
//             <option value="">All Subjects</option>
//             <option>Mathematics</option>
//             <option>English</option>
//             <option>Science</option>
//             {/* Add more subjects as needed */}
//           </select>
//         </div>

//         <div>
//           <label htmlFor="schoolName" className="block text-sm font-medium text-gray-700">School Name</label>
//           <input
//             type="text"
//             name="schoolName"
//             id="schoolName"
//             value={formData.schoolName}
//             onChange={handleChange}
//             className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
//             placeholder="Enter school name"
//           />
//         </div>

        // <div>
        //   <label htmlFor="county" className="block text-sm font-medium text-gray-700">County</label>
        //   <select
        //     id="county"
        //     name="county"
        //     value={formData.county}
        //     onChange={handleChange}
        //     className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
        //   >
        //     <option value="">All Counties</option>
        //     <option>Nairobi</option>
        //     <option>Mombasa</option>
        //     <option>Kisumu</option>
        //     {/* Add more counties as needed */}
        //   </select>
        // </div>

        // <div>
        //   <label htmlFor="subCounty" className="block text-sm font-medium text-gray-700">Sub-County</label>
        //   <select
        //     id="subCounty"
        //     name="subCounty"
        //     value={formData.subCounty}
        //     onChange={handleChange}
        //     className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
        //   >
        //     <option value="">All Sub-Counties</option>
        //     {/* Add sub-counties based on selected county */}
        //   </select>
        // </div>

//         <div>
//           <label htmlFor="schoolType" className="block text-sm font-medium text-gray-700">School Type</label>
//           <select
//             id="schoolType"
//             name="schoolType"
//             value={formData.schoolType}
//             onChange={handleChange}
//             className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
//           >
//             <option value="">All Types</option>
//             <option>Public</option>
//             <option>Private</option>
//             <option>International</option>
//           </select>
//         </div>

//         <div>
//           <label htmlFor="schoolLevel" className="block text-sm font-medium text-gray-700">School Level</label>
//           <select
//             id="schoolLevel"
//             name="schoolLevel"
//             value={formData.schoolLevel}
//             onChange={handleChange}
//             className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
//           >
//             <option value="">All Levels</option>
//             <option>Primary</option>
//             <option>Secondary</option>
//             <option>Mixed</option>
//           </select>
//         </div>

//         <div>
//           <button
//             type="submit"
//             className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
//           >
//             Search
//           </button>
//         </div>
//       </form>
//     </div>

//     {/* Available vacancies */}
//         <div className='flex flex-col justify-center w-3/4'>
//           <h2 className='ml-10 mt-10 mb-7 text-4xl font-bold text-slate-900'>Available Vacancies</h2>
//           <div className='flex flex-wrap gap-8 px-4 sm:px-6 lg:px-8'>
//   {vacancies.map((vacancy) => (
//     <div key={vacancy.vacancy_id} className="bg-white rounded-xl shadow-lg overflow-hidden border border-slate-200 flex flex-row h-[300px] w-full sm:w-[calc(50%-1rem)]">
//       <div className=" p-6 flex flex-col">
//         <h3 className="text-lg font-bold text-blue-400  mb-4">
//           {vacancy.school_name}
//         </h3>
//         <h3 className="text-lg font-bold text-slate-400  mb-4">
//           {vacancy.primary_subject} {vacancy.secondary_subject && `& ${vacancy.secondary_subject}`}
//         </h3>
//         <div className="mb-4 text-sm">
//           <p className="text-gray-700 mb-1"><span className="font-medium">Positions:</span> {vacancy.positions_available}</p>
//           <p className="text-gray-700 mb-1"><span className="font-medium">Start Date:</span> {new Date(vacancy.start_date).toLocaleDateString()}</p>
//           <p className="text-gray-700 mb-1"><span className="font-medium">End Date:</span> {new Date(vacancy.end_date).toLocaleDateString()}</p>
//           <p className="text-gray-700 mb-1"><span className="font-medium">Application Deadline:</span> {new Date(vacancy.application_deadline).toLocaleDateString()}</p>
//         </div>
//         <div className="mt-auto pt-4 border-t border-gray-200">
//           <Link to={`/vacancy/${1}`}>View Vacancy Details</Link>
//         </div>
//       </div>
//     </div>
//   ))}
// </div>
//         </div>
//       </section>
//     </div>
//   );
// }

// export default Studentportal;


import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';
import { getCurrentStudent } from '../Services/AuthService';
import logo1 from '../assets/logo1.jpeg';
import { Link } from 'react-router-dom';
import SidebarSearch from './sideSearchBar';

function Studentportal() {
  const [student, setStudent] = useState(null);
  const [vacancies, setVacancies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
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
        console.log(decodedToken);
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
        setLoading(false);
      } catch (err) {
        console.error('Error fetching student data:', err);
        setLoading(false);
      }
    };

    const fetchVacancies = async () => {
      try {
        const token = localStorage.getItem('token');
        const headers = { Authorization: `Bearer ${token}` };

        const response = await axios.get('http://localhost:5000/vacancies', { 
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
        });
        if (Array.isArray(response.data.vacancies)) {
          setVacancies(response.data.vacancies);
        } else {
          throw new Error('Invalid vacancies response format');
        }
      } catch (err) {
        console.error('Error fetching vacancies:', err.message);
        setError(err.message);
      }
    };

    fetchStudentData();
    fetchVacancies();
  }, [navigate]);


  const handleLogout = () => {
    sessionStorage.clear();
    localStorage.clear();
    navigate('/signin');
  };

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  console.log(vacancies);
  const handleSearch = (searchResults) => {
    setVacancies(searchResults);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="student-portal text-black">
      <header className='flex flex-row items-center justify-between w-full h-20 bg-slate-100 right-0 px-4 sm:px-6 lg:px-8 shadow-xl border-b'>
        <div className='flex flex-row md:ml-16 lg:ml-14 items-center'>
          <img className='w-14 h-14 rounded-full md:mr-5 shadow-lg' src={logo1} alt="" />
          <h1 className='md:text-lg font-bold text-slate-700 hidden md:flex '>TPConnect</h1>
        </div>
        <div className="relative text-left flex flex-row items-center">
          <Link to="/submissions" className="mr-2">
            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-1 md:px-4 text-sm md:text-md rounded">
              Submit Assessment
            </button>
          </Link>
          <Link to="/lessonobservationreport" className="mr-2">
            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-1 md:px-4 text-sm md:text-md rounded">
              Assessment Grading
            </button>
          </Link>
          <div className="flex items-center">
            <p className='text-sm mr-1 hidden md:flex'>Welcome,</p>
            <h1 className='text-lg text-slate-800 hidden md:flex'>
              {student ? `${student.first_name}` : 'Student-teacher'}
            </h1>
          </div>
          <div>
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
        </div>

        {isOpen && student && (
          <div className="absolute right-2 sm:right-6 lg:right-8 mt-48 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50">
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
      </header>

      <div className="flex flex-col md:flex-row bg-slate-50">
        <SidebarSearch onSearch={handleSearch} />
        
        <div className='flex-1 p-4'>
          <h2 className='text-3xl font-bold text-slate-900 mb-6'>Available Vacancies</h2>
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
            {vacancies.map((vacancy) => (
              <div key={vacancy.vancancy_id} className="bg-white rounded-xl shadow-lg overflow-hidden border border-slate-200 flex flex-col">
                <div className="p-6 flex-1">
                  <h3 className="text-lg font-bold text-blue-400 mb-2">{vacancy.school_name}</h3>
                  <h4 className="text-md font-semibold text-slate-400 mb-4">
                    {vacancy.primary_subject} {vacancy.secondary_subject && `& ${vacancy.secondary_subject}`}
                  </h4>
                  <div className="text-sm">
                    <p className="text-gray-700 mb-1"><span className="font-medium">Positions:</span> {vacancy.positions_available}</p>
                    <p className="text-gray-700 mb-1"><span className="font-medium">Start Date:</span> {new Date(vacancy.start_date).toLocaleDateString()}</p>
                    <p className="text-gray-700 mb-1"><span className="font-medium">End Date:</span> {new Date(vacancy.end_date).toLocaleDateString()}</p>
                    <p className="text-gray-700 mb-1"><span className="font-medium">Application Deadline:</span> {new Date(vacancy.application_deadline).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                  <Link to={`/vacancy/${vacancy.vancancy_id}`} className="text-blue-500 hover:text-blue-700 font-medium">
                    View Vacancy Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Studentportal;