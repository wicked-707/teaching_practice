import React, { useState, useEffect } from 'react';
import Dashboard from '../Pages/Dashboard';
import Student from '../Pages/Student';
import ManageVacancies from '../Pages/ManageVacancies';
import Reports from '../Pages/Reports';
import Settings from '../Pages/Settings';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { getCurrentStudent } from '../Services/AuthService';
import { jwtDecode } from 'jwt-decode';
import logo1 from '../assets/logo1.jpeg';
import HighSchool from '../Pages/HighSchool';
import Universities from '../Pages/Universities';
import HODs from '../Pages/HODs';
import Supervisors from '../Pages/Supervisors';
import Courses from '../Pages/Courses';
import AddCourses from '../Pages/AddCourses';
import AdminSettings from '../Pages/AdminSettings';

const AdminPortal = () => {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeSection, setActiveSection] = useState('dashboard');
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const [error, setError] = useState(null);

  const handleLogout = () => {
    sessionStorage.clear();
    localStorage.clear();
    navigate('/adminsignin');
  };

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
  const fetchStudentData = async () => {
    try {
      const adminToken = getCurrentStudent();
      if (!adminToken) {
        navigate('/adminsignin', { state: { from: location.pathname } });
        return;
      }

      const decodedToken = jwtDecode(adminToken);
    console.log('Decoded token:', decodedToken);  // Add this line for debugging

    if (!decodedToken) {
      setError('Invalid token format');
      setLoading(false);
      return;
    }

      // Check if role exists and is an array or string
    const userRoles = decodedToken.role;
    if (!userRoles || (Array.isArray(userRoles) && !userRoles.includes('admin')) || 
        (typeof userRoles === 'string' && userRoles !== 'admin')) {
      setError('Access denied');
      setLoading(false);
      return;
    }

    const adminData = {
      name: decodedToken.admin_name || decodedToken.name || 'Admin',
      email: decodedToken.email || 'Not provided',
      role: Array.isArray(userRoles) ? userRoles.join(', ') : userRoles,
    };

    console.log('Admin data:', adminData);  // Add this line for debugging

    setAdmin(adminData);
    setLoading(false);
  } catch (err) {
    console.error('Error fetching admin data:', err);
    setError('Error fetching admin data');
    setLoading(false);
  }
  };

  fetchStudentData();
}, [navigate]);

  const renderSection = () => {
    switch (activeSection) {
      case 'dashboard':
        return <Dashboard />;
      case 'student':
        return <Student />;
      case 'highschool':
        return <HighSchool />;
      case 'universities':
        return <Universities />;
      case 'hods':
        return <HODs />;
      case 'supervisors':
        return <Supervisors />;
      case 'vacancies':
        return <ManageVacancies />;
      case 'courses':
        return <Courses />;
      case 'addcourses':
        return <AddCourses />;
      case 'reports':
        return <Reports />;
      case 'settings':
        return <AdminSettings />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen flex">
      <aside className="w-64 bg-slate-800 text-white fixed top-0 left-0 h-full">
        <div className="p-4">
          <div className='flex flex-row'>
            <img className='w-7 h-7 rounded-full md:mr-5 shadow-lg' src={logo1} alt="" />
            <h2 className="text-xl font-bold">TPConnect</h2>
          </div>
          <nav className="mt-8">
            <ul>
              <li className="mb-4">
                <button
                  onClick={() => setActiveSection('dashboard')}
                  className={`w-full text-left ${
                    activeSection === 'dashboard' ? 'font-bold' : 'text-slate-300 hover:text-white'
                  }`}
                >
                  Dashboard
                </button>
              </li>

              {/* manage Users */}
              <h2 className='text-md font-medium text-slate-300 border-b border-slate-600 pl-5 rounded-full mb-3 '>Manage Users</h2>
              <li className="mb-2 border w-full border-slate-600 pl-5 rounded-full active:bg-slate-700">
                <button
                  onClick={() => setActiveSection('student')}
                  className={`w-full text-left ${
                    activeSection === 'users' ? 'font-bold' : 'text-slate-300 hover:text-white'
                  }`}
                >
                  Student
                </button>
              </li>
              <li className="mb-2 border w-full border-slate-600 pl-5 rounded-full active:bg-slate-700">
                <button
                  onClick={() => setActiveSection('highschool')}
                  className={`w-full text-left ${
                    activeSection === 'users' ? 'font-bold' : 'text-slate-300 hover:text-white'
                  }`}
                >
                  Highschools
                </button>
              </li>
              <li className="mb-2 border w-full border-slate-600 pl-5 rounded-full active:bg-slate-700">
                <button
                  onClick={() => setActiveSection('universities')}
                  className={`w-full text-left ${
                    activeSection === 'users' ? 'font-bold' : 'text-slate-300 hover:text-white'
                  }`}
                >
                  Universities
                </button>
              </li>
              <li className="mb-2 border w-full border-slate-600 pl-5 rounded-full active:bg-slate-700">
                <button
                  onClick={() => setActiveSection('hods')}
                  className={`w-full text-left ${
                    activeSection === 'users' ? 'font-bold' : 'text-slate-300 hover:text-white'
                  }`}
                >
                  HODs
                </button>
              </li>
              <li className="mb-2 border w-full border-slate-600 pl-5 rounded-full active:bg-slate-700">
                <button
                  onClick={() => setActiveSection('supervisors')}
                  className={`w-full text-left ${
                    activeSection === 'users' ? 'font-bold' : 'text-slate-300 hover:text-white'
                  }`}
                >
                  Supervisors
                </button>
              </li>

              {/* seperating line */}
              <div className='border-b border-slate-600 mt-6'></div>

              {/* manage course and vacancies */}
              <h2 className='text-md font-medium text-slate-300 border-b border-slate-600 pl-5 rounded-full mb-3 mt-6 '>Manage Uploads</h2>
              <li className="mb-2 border w-full border-slate-600 pl-5 rounded-full active:bg-slate-700">
                <button
                  onClick={() => setActiveSection('vacancies')}
                  className={`w-full text-left ${
                    activeSection === 'users' ? 'font-bold' : 'text-slate-300 hover:text-white'
                  }`}
                >
                  Vacancies
                </button>
              </li>
              <li className="mb-2 border w-full border-slate-600 pl-5 rounded-full active:bg-slate-700">
                <button
                  onClick={() => setActiveSection('courses')}
                  className={`w-full text-left ${
                    activeSection === 'users' ? 'font-bold' : 'text-slate-300 hover:text-white'
                  }`}
                >
                  Courses
                </button>
              </li>
              <li className="mb-2 border w-full border-slate-600 pl-5 rounded-full active:bg-slate-700">
                <button
                  onClick={() => setActiveSection('addcourses')}
                  className={`w-full text-left ${
                    activeSection === 'users' ? 'font-bold' : 'text-slate-300 hover:text-white'
                  }`}
                >
                  Add a Course
                </button>
              </li>

              {/* seperating line */}
              <div className='border-b border-slate-600 mt-6 shadow-white'></div>

              {/* Edit admin Info */}
              <h2 className='text-md font-medium text-slate-300 border-b border-slate-600 pl-5 rounded-full mb-3 mt-6 '>Account Settings</h2>
               <li className="mb-2 border w-full border-slate-600 pl-5 rounded-full active:bg-slate-700">
                <button
                  onClick={() => setActiveSection('settings')}
                  className={`w-full text-left ${
                    activeSection === 'users' ? 'font-bold' : 'text-slate-300 hover:text-white'
                  }`}
                >
                  Edit Profile
                </button>
              </li>
              
              <li className="mb-4">
                <button
                  onClick={() => setActiveSection('reports')}
                  className={`w-full text-left ${
                    activeSection === 'reports' ? 'font-bold' : 'text-slate-300 hover:text-white'
                  }`}
                >
                  Reports
                </button>
              </li>
            </ul>
          </nav>
        </div>
      </aside>
      <div className="flex-1 w-full ml-64 p-6 bg-gray-100">
        <header className="bg-white shadow-md p-4 fixed flex flex-row items-center justify-between top-0 left-64 right-0">
        <ul className='flex flex-row items-center'>
          <li className='text-lg font-medium py-2 text-slate-900 hover:border-b border-slate-950 mr-3'><Link to="/">Home</Link></li>
          <li className='text-lg font-medium py-2 text-slate-900 hover:border-b border-slate-950 mr-3'><Link to="/contact">Contact</Link></li>
          <li className='text-lg font-medium py-2 text-slate-900 hover:border-b border-slate-950 mr-3'><Link to="/about">About</Link></li>
        </ul>

        <div className="flex items-center">
          <p className='text-sm mr-1 hidden md:flex'>Welcome,</p>
          <h1 className='text-lg text-slate-800 hidden md:flex'>
            {admin ? `${admin.role}` : 'Admin'}
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
        </div>
        {isOpen && admin && (
          <div className="absolute right-2 sm:right-6 lg:right-8 mt-48 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50">
            <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
              <div className="px-4 py-2 text-sm text-gray-700">
                <p className="font-medium">{admin.name}</p>
                <p className="text-gray-500">{admin.email}</p>
                <p className="text-gray-500">Role: {admin.role}</p>
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
        <main className="mt-16 w-full bg-slate-100">
          {renderSection()}
        </main>
      </div>
    </div>
  );
};

export default AdminPortal;
