import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import {jwtDecode} from 'jwt-decode';

const HighschoolSignin = () => {
  const location = useLocation();
  const notification = location.state?.notification;
  const [formData, setFormData] = useState({
    official_email: '',
    hashed_password: ''
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
console.log('formData being sent:', formData);


    try {
      console.log('Attempting to send request...');
      const response = await axios.post('http://localhost:5000/high_school/signin', formData, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
        
      });
  console.log('Request completed');

      const { token, data} = response.data;
      console.log(response.data);
      console.log('Full response:', response);
      console.log('Response data:', response.data);
      console.log('Token:', response.token);
      // console.log('Student:', response.data.student);

      if (token) {
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(data));

        const decodedToken = jwtDecode(token);
        const userRoles = decodedToken.role;
        console.log(userRoles);

        if (userRoles.includes('highschool')) {
          const redirectTo = location.state?.from || '/highschooldash';
          navigate(redirectTo);
        } else if (userRoles.includes('hod')) {
          navigate('/hodportal');
        } else {
          setError('Access denied');
        }
      } else {
        setError('Invalid response from server');
      }
    } catch (error) {
      console.error('Error:', error);
      if (error.response) {
        setError(error.response.data.msg || 'Failed to sign in');
      } else {
        setError('Network error. Please try again.');
      }
    }
  };

  return (
     <div className="min-h-screen bg-slate-100 text-slate-900 text-center flex flex-col items-center justify-center p-8">
      <h1 className=" text-2xl md:text-4xl font-bold mb-4">Ready To Shape Tomorrow's Leaders</h1>
      <h2 className="text-md md:text-2xl mb-8 md:max-w-2xl text-center text-slate-700">
        Connect with talented educators and staff. Your next great hire is just a login away.
      </h2>
      
      
      
      <div className="login-container p-8 rounded-lg shadow-xl max-w-md w-full">
        <img 
        src="https://img.icons8.com/emoji/12x/man-student.png" 
        alt="Student studying" 
        className="md:ml-20 w-36 h-36 ml-3 md:w-56 md:h-56 object-cover  mb-8"
      />
        {notification && <p className="text-green-600 mb-4">{notification}</p>}
        <h2 className="text-lg md:text-2xl font-semibold mb-6 text-center">Login To Your Dashboard</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-8">
            <input
              type="email"
              name="official_email"
              value={formData.official_email}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 rounded-lg shadow-lg border-b border-slate-500 focus:outline-none bg-slate-100 focus:bg-slate-100 focus:border-slate-700"
            />
          </div>
          <div className="mb-6">
            <input
              type="password"
              name="hashed_password"
              value={formData.hashed_password}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 rounded-lg shadow-lg border-b border-slate-500 bg-slate-100 focus:bg-slate-100 focus:outline-none focus:border-slate-700"
            />
          </div>

          <div className="mb-6 flex items-center justify-between">
            <div className='mr-5'>
              <input type="checkbox" id="remember" className="mr-2" />
              <label className="text-xs md:text-sm text-slate-700" htmlFor="remember">
                Remember me
              </label>
            </div>
            <button type="button" className="text-red-500 text-xs md:text-sm hover:underline">
              Forgot Password?
            </button>
          </div>

          {error && <p className="error text-red-600 mb-4">{error}</p>}
          <button 
            type="submit"
            className="w-52 bg-slate-900 text-orange-500 py-2 rounded-xl hover:bg-slate-800 transition duration-300"
          >
            Login
          </button>
        </form>
        
        <div className="mt-6 text-center">
          <p className="text-sm">
            Don't have an account?{' '}
            <Link to="/highschoolsignup" className="text-blue-600 hover:underline">
              Sign Up
            </Link>
          </p>
        </div>
      </div>
      <div className='flex flex-row w-full justify-between'>
      <Link to="/loginchoice" className="mt-8 text-cyan-500 pr-4 py-1 pl-3 rounded-3xl hover:underline flex items-center bg-slate-950 lg:ml-[418px]">
      <img src="https://img.icons8.com/?size=80&id=1RH5tsh9xuwl&format=png" alt="" className=' w-4 h-4' />
        <p className='ml-1 font-medium'>Back</p>
      </Link>
      <Link to="/" className="mt-8 text-cyan-500 pr-3 py-1 pl-2 rounded-3xl hover:underline flex items-center bg-slate-950 lg:mr-[418px]">
      <img src="https://img.icons8.com/?size=80&id=VtR2yMi6rG8c&format=png" alt="" className='w-4 h-4' />
        <p className='ml-1 font-medium'>Home</p>
      </Link>
      </div>
    </div>

  );
};

export default HighschoolSignin;