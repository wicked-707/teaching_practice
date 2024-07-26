import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import {jwtDecode} from 'jwt-decode';

const Hodsignin = () => {
  const location = useLocation();
  const notification = location.state?.notification;
  const [formData, setFormData] = useState({
    email: '',
    password: ''
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
  try {
    console.log('Form Data:', formData);
    const response = await axios.post('/api/hods/signin', formData);
    const { token, data } = response.data;
    console.log('Full response:', response);
    console.log('Response data:', response.data);

    if (token) {
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(data));

      const decodedToken = jwtDecode(token);
      const userRoles = decodedToken.role;
      console.log(userRoles);

      if (userRoles.includes('hod')) {
        const redirectTo = location.state?.from || '/hodportal';
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
      setError(error.response.data.message || 'Failed to sign in');
    } else {
      setError('Network error. Please try again.');
    }
  }
};


  return (
   <div className="min-h-screen bg-slate-100 text-slate-900 text-center flex flex-col items-center justify-center p-8">
      <h1 className=" text-2xl md:text-4xl font-bold mb-4">Ready to Embark Your Students Learning Journey?</h1>
      <h2 className="text-md md:text-2xl mb-8 md:max-w-2xl text-center text-slate-700">
        Unlock a world of knowledge and opportunities. Your nurture begins with a simple login.
      </h2>
      
      
      
      <div className="login-container p-8 rounded-lg shadow-xl max-w-md w-full">
        <img 
        src="https://img.icons8.com/emoji/12x/man-student.png" 
        alt="Student studying" 
        className="md:ml-20 w-36 h-36 ml-3 md:w-56 md:h-56 object-cover  mb-8"
      />
        {notification && <p className="text-green-600 mb-4">{notification}</p>}
        <h2 className="text-lg md:text-2xl font-semibold mb-6 text-center">Student Login</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-8">
            <input
              type="email"
              name="email"
              value={formData.email}
              placeholder="Email"
              onChange={handleChange}
              required
              className="w-full px-3 py-2 rounded-lg shadow-lg border-b border-slate-500 focus:outline-none bg-slate-100 focus:bg-slate-100 focus:border-slate-700"
            />
          </div>
          <div className="mb-6">
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
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
            <Link to="/hodsignup" className="text-blue-600 hover:underline">
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

export default Hodsignin;
// import React, { useState } from 'react';
// import axios from 'axios';
// import { Link } from 'react-router-dom';

// const HodSignin = () => {
//   const [formData, setFormData] = useState({
//     email: '',
//     pass: ''
//   });
//   const [errors, setErrors] = useState({});
//   const [successMessage, setSuccessMessage] = useState('');

//   const handleChange = (e) => {
//     setFormData({
//       ...formData,
//       [e.target.name]: e.target.value
//     });
//     // Clear error when user starts typing
//     if (errors[e.target.name]) {
//       setErrors({
//         ...errors,
//         [e.target.name]: ''
//       });
//     }
//   };

//   const validateForm = () => {
//     let isValid = true;
//     let newErrors = {};

//     if (!formData.email) {
//       newErrors.email = 'Email is required';
//       isValid = false;
//     } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
//       newErrors.email = 'Email is invalid';
//       isValid = false;
//     }

//     if (!formData.pass) {
//       newErrors.pass = 'Password is required';
//       isValid = false;
//     } else if (formData.pass.length < 6) {
//       newErrors.pass = 'Password must be at least 6 characters long';
//       isValid = false;
//     }

//     setErrors(newErrors);
//     return isValid;
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setSuccessMessage('');

//     if (validateForm()) {
//       try {
//         const response = await axios.post('/api/hods/signin', formData);
//         console.log('HOD signed in successfully:', response.data);
//         setSuccessMessage('Signed in successfully!');
//         // Reset form or redirect here
//         setFormData({ email: '', pass: '' });
//       } catch (error) {
//         console.error('Error signing in HOD:', error);
//         setErrors({ 
//           ...errors, 
//           general: error.response?.data?.message || 'An error occurred during sign in' 
//         });
//       }
//     }
//   };

//   return (
//     <div>
//         <form onSubmit={handleSubmit}>
//         <h2>HOD Sign In</h2>
//         {successMessage && <div style={{ color: 'green' }}>{successMessage}</div>}
//         {errors.general && <div style={{ color: 'red' }}>{errors.general}</div>}
        
//         <div>
//             <input 
//             type="email" 
//             name="email" 
//             placeholder="Email" 
//             value={formData.email} 
//             onChange={handleChange} 
//             required 
//             />
//             {errors.email && <div style={{ color: 'red' }}>{errors.email}</div>}
//         </div>

//         <div>
//             <input 
//             type="password" 
//             name="pass" 
//             placeholder="Password" 
//             value={formData.pass} 
//             onChange={handleChange} 
//             required 
//             />
//             {errors.pass && <div style={{ color: 'red' }}>{errors.pass}</div>}
//         </div>

//         <button type="submit">Sign In</button>
//         </form>
//         <div className="mt-6 text-center">
//           <p className="text-sm">
//             Don't have an account?{' '}
//             <Link to="/hodsignup" className="text-blue-600 hover:underline">
//               Sign Up
//             </Link>
//           </p>
//         </div>
//     </div>
    
//   );
// };

// export default HodSignin;