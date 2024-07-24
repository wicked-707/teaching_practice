import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {jwtDecode} from 'jwt-decode';
import axios from 'axios';
import { getCurrentStudent } from '../Services/AuthService';
import logo1 from '../assets/logo1.jpeg'; // Assuming this function retrieves the current student's token

function HighschoolDash() {
  const [school, setSchool] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const goToUploads = () => {
    navigate('/vacancy');
  };

  useEffect(() => {
    const fetchSchoolData = async () => {
      try {
        // Get current student's token from your authentication service
        const studentToken = getCurrentStudent();
        console.log(studentToken);

        if (!studentToken) {
          navigate('/signin', { state: { from: location.pathname } });
          return;
        }

        // Decode the token to extract user information
        const decodedToken = jwtDecode(studentToken);
        

        // Ensure the token contains necessary user data and roles
        if (!decodedToken) {
          console.log(decodedToken)
        

          setError('Invalid token format');
          setLoading(false);
          return;
        }

        // Example: Check user roles
        const userRoles = decodedToken.role;
        console.log(userRoles)
        if (!userRoles.includes('highschool')) {
          setError('Access denied');
          setLoading(false);
          return;
        }

        // Extract user data from the token
        const schoolData = {
          id: decodedToken.school_id,
          Name: decodedToken.school_name,
          email: decodedToken.official_email,
          roles: decodedToken.role,
          // Add any other relevant user data that's stored in the token
        };

        setSchool(schoolData);

        setLoading(false);
      } catch (err) {
        console.error('Error fetching student data:', err);
        setError('Failed to fetch student data');
        setLoading(false);
      }
    };
    fetchSchoolData();
  }, [navigate]);

  const handleLogout = () => {
    // Clear session and local storage
    sessionStorage.clear();
    localStorage.clear();
    navigate('/highschoolsignin');
  };
  

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <section className='flex flex-col items-center justify-center w-screen bg-slate-100'>
      <div className="school-portal text-black flex flex-row items-center justify-between w-screen h-20">
        <div>
          <div className='flex flex-row items-center'>
          <img className='w-14 h-14 rounded-full md:mr-5 shadow-lg' src={logo1} alt="" />
          <h1 className='md:text-lg font-bold text-slate-700'>Welcome, {school ? school.Name: 'highschool'}</h1>
          {/* <h1 className='md:text-lg font-bold text-slate-700'>TPConnect</h1> */}
         </div>
        </div>
        <div>
          <form action="" method="post">
            <input type="search" name="search" id="search" placeholder='Search...' />
            <button type="submit">Search</button>
          </form>
        </div>
        <button onClick={goToUploads}>Upload Vacancies</button>
        <section className="profile relative">
      <button 
        onClick={toggleDropdown}
        className="bg-slate-900 text-white px-4 py-1 rounded-full hover:bg-slate-700 transition duration-300"
      >
        Profile
      </button>
      {isOpen && (
        <div className="profile-popup absolute right-0 mt-2 w-48 bg-white rounded-md shadow-xl z-20">
          <div className="py-1">
            <p className="px-4 py-2 text-sm text-gray-700">Email: {school.email}</p>
            <p className="px-4 py-2 text-sm text-gray-700">Role: {school.roles}</p>
            {/* Add more user details as needed */}
            <button 
              onClick={handleLogout}
              className="block w-full text-left px-4 py-2 text-sm text-red-700 hover:bg-gray-100"
            >
              Logout
            </button>
          </div>
        </div>
      )}
    </section>
      </div>
    </section>
  );
}

export default HighschoolDash;
