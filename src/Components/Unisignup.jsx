import React, { useState } from 'react';
import axios from 'axios';

const Unisignup = () => {
  const [formData, setFormData] = useState({
    university_name: '',
    registration_number: '',
    charter_number: '',
    official_email: '',
    website: '',
    county: ''
  });
  const [formErrors, setFormErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const validateForm = () => {
    const errors = {};
    if (!formData.university_name) errors.university_name = 'University name is required';
    if (!formData.registration_number) errors.registration_number = 'Registration number is required';
    if (!formData.charter_number) errors.charter_number = 'Charter number is required';
    if (!formData.official_email) errors.official_email = 'Official email is required';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.official_email)) errors.official_email = 'Invalid email address';
    if (!formData.website) errors.website = 'Website is required';
    if (!/^https?:\/\/[^\s$.?#].[^\s]*$/.test(formData.website)) errors.website = 'Invalid website URL';
    if (!formData.county) errors.county = 'County is required';

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (validateForm()) {
      try {
        await axios.post('/api/universities', formData);
        setSubmitted(true);
      } catch (error) {
        console.error('There was an error registering the university:', error);
      }
    }
  };

  const handleChange = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      {submitted ? (
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">University Registered Successfully!</h2>
          <p>Thank you for registering Tech Valley University.</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 max-w-md mx-auto">
          <h2 className="text-2xl font-bold mb-4">University Registration Form</h2>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">University Name</label>
            <input
              type="text"
              name="university_name"
              value={formData.university_name}
              onChange={handleChange}
              className={`shadow appearance-none border ${formErrors.university_name ? 'border-red-500' : ''} rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline`}
            />
            {formErrors.university_name && <p className="text-red-500 text-xs italic">{formErrors.university_name}</p>}
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">Registration Number</label>
            <input
              type="text"
              name="registration_number"
              value={formData.registration_number}
              onChange={handleChange}
              className={`shadow appearance-none border ${formErrors.registration_number ? 'border-red-500' : ''} rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline`}
            />
            {formErrors.registration_number && <p className="text-red-500 text-xs italic">{formErrors.registration_number}</p>}
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">Charter Number</label>
            <input
              type="text"
              name="charter_number"
              value={formData.charter_number}
              onChange={handleChange}
              className={`shadow appearance-none border ${formErrors.charter_number ? 'border-red-500' : ''} rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline`}
            />
            {formErrors.charter_number && <p className="text-red-500 text-xs italic">{formErrors.charter_number}</p>}
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">Official Email</label>
            <input
              type="email"
              name="official_email"
              value={formData.official_email}
              onChange={handleChange}
              className={`shadow appearance-none border ${formErrors.official_email ? 'border-red-500' : ''} rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline`}
            />
            {formErrors.official_email && <p className="text-red-500 text-xs italic">{formErrors.official_email}</p>}
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">Website</label>
            <input
              type="text"
              name="website"
              value={formData.website}
              onChange={handleChange}
              className={`shadow appearance-none border ${formErrors.website ? 'border-red-500' : ''} rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline`}
            />
            {formErrors.website && <p className="text-red-500 text-xs italic">{formErrors.website}</p>}
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">County</label>
            <input
              type="text"
              name="county"
              value={formData.county}
              onChange={handleChange}
              className={`shadow appearance-none border ${formErrors.county ? 'border-red-500' : ''} rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline`}
            />
            {formErrors.county && <p className="text-red-500 text-xs italic">{formErrors.county}</p>}
          </div>
          <div className="flex items-center justify-between">
            <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
              Register
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default Unisignup;

// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import axios from 'axios';
// import Home from './Home';
// import { Link } from 'react-router-dom';
// import logo1 from '../assets/logo1.jpeg';
 

// function Unisignup() {
//   const [formData, setFormData] = useState({
//     university_name: '',
//     establishment_date: '',
//     registration_number: '',
//     charter_number: '',
//     accreditation_status: '',
//     official_email: '',
//     official_phone_number: '',
//     website: '',
//     postal_address: '',
//     physical_address: '',
//     county: '',
//     category: '',
//     pass: '',
//     confirm_pass: ''
//   });

//   const navigate = useNavigate();
  

//   const [errors, setErrors] = useState({});

//   const [currentStep, setCurrentStep] = useState(1);

//   const handleNext = () => {
//     setCurrentStep(currentStep + 1);
//   };

//   const handlePrevious = () => {
//     setCurrentStep(currentStep - 1);
//   };

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData(prevState => ({
//       ...prevState,
//       [name]: value
//     }));
//   };

//   const validate = () => {
//     let tempErrors = {};
//     if (formData.pass !== formData.confirm_pass) {
//       tempErrors.confirm_pass = "Passwords do not match";
//     }
//     if (!/^\d{10}$/.test(formData.official_phone_number)) {
//       tempErrors.official_phone_number = "Please enter a valid 10-digit phone number";
//     }
//     if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.official_email)) {
//       tempErrors.official_email = "Please enter a valid email address";
//     }
//     setErrors(tempErrors);
//     return Object.keys(tempErrors).length === 0;
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (validate()) {
//       try {
//         const response = await axios.post('http://localhost:5000/university', formData);
//         console.log('University registered:', response.data);
//         alert('University registered successfully!');
//         // Reset form or redirect
//       } catch (error) {
//         console.error('Error:', error);
//         alert('An error occurred while registering the university.');
//       }
//     }
//   };

//   return (
//    <form onSubmit={handleSubmit} className="w-screen mx-auto p-8 bg-slate-100 shadow-lg rounded-lg">
  
//   {/* Step 1: Basic Information */}
//   {currentStep === 1 && (
//     <div className="min-h-screen text-slate-900 flex flex-col items-center justify-center p-8">
//       <img className='w-14 h-14 md:w-28 md:h-28 rounded-full md:mr-5 shadow-lg' src={logo1} alt="" />
//       <h1 className="text-4xl font-bold mb-4">We're excited you joining us in shaping the future of education</h1>
//       <h2 className="text-xl mb-8 max-w-2xl text-center text-slate-700">
//         To get started, we need some key information about your school.
//       </h2>       
//   <div className="p-8 max-w-md w-full">
//     <div className="mb-6">
//       <input 
//         type="text" 
//         id="university_name" 
//         name="university_name" 
//         value={formData.university_name} 
//         onChange={handleChange} 
//         required 
//         className="w-full px-3 py-2 rounded-xl shadow-xl border-b bg-slate-100 border-slate-500 focus:border-slate-700 focus:outline-none"
//         placeholder="What's your university's name?" 
//       />
//     </div>
//     <div className="mb-6">
//       <input 
//         type="date" 
//         id="establishment_date" 
//         name="establishment_date" 
//         value={formData.establishment_date} 
//         onChange={handleChange} 
//         required 
//         className="w-full px-3 py-2 rounded-xl shadow-xl border-b bg-slate-100 border-slate-500 focus:border-slate-700 focus:outline-none"
//       />
//     </div>
//     <div className="mb-6">
//       <input 
//         type="text" 
//         id="registration_number" 
//         name="registration_number" 
//         value={formData.registration_number} 
//         onChange={handleChange} 
//         required 
//         className="w-full px-3 py-2 rounded-xl shadow-xl border-b bg-slate-100 border-slate-500 focus:border-slate-700 focus:outline-none"
//         placeholder="What's your registration number?" 
//       />
//     </div>
//     <div className="mb-6">
//       <input 
//         type="text" 
//         id="charter_number" 
//         name="charter_number" 
//         value={formData.charter_number} 
//         onChange={handleChange} 
//         required 
//         className="w-full px-3 py-2 rounded-xl shadow-xl border-b bg-slate-100 border-slate-500 focus:border-slate-700 focus:outline-none"
//         placeholder="What's your charter number?" 
//       />
//     </div>
//     <div className="flex justify-between w-full">
//       <Link to="/loginchoice" className="text-cyan-500 pr-4 py-1 pl-3 rounded-3xl hover:underline flex items-center bg-slate-950">
//         <img src="https://img.icons8.com/?size=80&id=1RH5tsh9xuwl&format=png" alt="" className='w-4 h-4' />
//         <p className='ml-1 font-medium'>Back</p>
//       </Link>
//       <button
//         type="button"
//         onClick={handleNext}
//         className="bg-slate-900 text-orange-500 px-6 py-1 rounded-full hover:bg-slate-600 transition duration-300"
//       >
//         Next
//       </button>
//     </div>
//   </div>
// </div>
//   )}

//   {/* Step 2: Accreditation and Contact */}
//   {currentStep === 2 && (
//     <div className="min-h-screen text-slate-900 flex flex-col items-center justify-center p-8">
//   <img className='w-14 h-14 md:w-28 md:h-28 rounded-full md:mr-5 shadow-lg' src={logo1} alt="" />
//   <h1 className="text-4xl font-bold mb-4">Credentials and Contact</h1>
//   <h2 className="text-xl mb-8 max-w-2xl text-center text-slate-700">
//     Let's talk about your accreditation and how to reach you
//   </h2>
//   <div className="p-8 max-w-md w-full">
    
//     <div className="mb-6">
//       <select 
//         id="accreditation_status" 
//         name="accreditation_status" 
//         value={formData.accreditation_status} 
//         onChange={handleChange} 
//         required 
//         className="w-full bg-transparent border-b-2 border-slate-500 focus:border-slate-700 text-slate-700 py-2 px-1 leading-tight focus:outline-none rounded-b-lg shadow-sm transition duration-300"
//       >
//         <option value="">Select accreditation status</option>
//         <option value="Accredited">Accredited</option>
//         <option value="Provisional">Provisional</option>
//         <option value="Not Accredited">Not Accredited</option>
//       </select>
//     </div>
//     <div className="mb-6">
//       <input 
//         type="email" 
//         id="official_email" 
//         name="official_email" 
//         value={formData.official_email} 
//         onChange={handleChange} 
//         required 
//         className="w-full px-3 py-2 rounded-xl shadow-xl border-b bg-slate-100 border-slate-500 focus:border-slate-700 focus:outline-none"
//         placeholder="What's your official email?" 
//       />
//       {errors.official_email && <p className="text-red-500 text-xs italic">{errors.official_email}</p>}
//     </div>
//     <div className="mb-6">
//       <input 
//         type="tel" 
//         id="official_phone_number" 
//         name="official_phone_number" 
//         value={formData.official_phone_number} 
//         onChange={handleChange} 
//         required 
//         className="w-full px-3 py-2 rounded-xl shadow-xl border-b bg-slate-100 border-slate-500 focus:border-slate-700 focus:outline-none"
//         placeholder="What's your official phone number?" 
//       />
//       {errors.official_phone_number && <p className="text-red-500 text-xs italic">{errors.official_phone_number}</p>}
//     </div>
//     <div className="mb-6">
//       <input 
//         type="url" 
//         id="website" 
//         name="website" 
//         value={formData.website} 
//         onChange={handleChange} 
//         required 
//         className="w-full px-3 py-2 rounded-xl shadow-xl border-b bg-slate-100 border-slate-500 focus:border-slate-700 focus:outline-none"
//         placeholder="What's your website URL?" 
//       />
//     </div>
//     <div className="flex justify-between w-full">
//       <button
//         type="button"
//         onClick={handlePrevious}
//         className="bg-gray-300 hover:bg-gray-400 text-slate-800 py-2 px-6 rounded-full focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-opacity-50 transition duration-300 transform hover:scale-105"
//       >
//         Previous
//       </button>
//       <button
//         type="button"
//         onClick={handleNext}
//         className="bg-slate-900 text-orange-500 px-6 py-1 rounded-full hover:bg-slate-600 transition duration-300"
//       >
//         Next
//       </button>
//     </div>
//   </div>
// </div>

//   )}

//   {/* Step 3: Location Details */}
//   {currentStep === 3 && (
//     <div className="min-h-screen text-slate-900 flex flex-col items-center justify-center p-8">
//   <img className='w-14 h-14 md:w-28 md:h-28 rounded-full md:mr-5 shadow-lg' src={logo1} alt="" />
//   <h1 className="text-4xl font-bold mb-4">Where are you located?</h1>
//   <h2 className="text-xl mb-8 max-w-2xl text-center text-slate-700">
//     Help us pinpoint your university
//   </h2>       
//   <div className="p-8 max-w-md w-full">
    
//     <div className="mb-6">
//       <input 
//         type="text" 
//         id="postal_address" 
//         name="postal_address" 
//         value={formData.postal_address} 
//         onChange={handleChange} 
//         required 
//         className="w-full px-3 py-2 rounded-xl shadow-xl border-b bg-slate-100 border-slate-500 focus:border-slate-700 focus:outline-none"
//         placeholder="What's your postal address?" 
//       />
//     </div>

//     <div className="mb-6">
//       <input 
//         type="text" 
//         id="physical_address" 
//         name="physical_address" 
//         value={formData.physical_address} 
//         onChange={handleChange} 
//         required 
//         className="w-full px-3 py-2 rounded-xl shadow-xl border-b bg-slate-100 border-slate-500 focus:border-slate-700 focus:outline-none"
//         placeholder="What's your physical address?" 
//       />
//     </div>

//     <div className="mb-6">
//       <input 
//         type="text" 
//         id="county" 
//         name="county" 
//         value={formData.county} 
//         onChange={handleChange} 
//         required 
//         className="w-full px-3 py-2 rounded-xl shadow-xl border-b bg-slate-100 border-slate-500 focus:border-slate-700 focus:outline-none"
//         placeholder="Which county are you in?" 
//       />
//     </div>

//     <div className="flex justify-between w-full">
//       <button
//         type="button"
//         onClick={handlePrevious}
//         className="bg-gray-300 hover:bg-gray-400 text-slate-800 py-2 px-6 rounded-full focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-opacity-50 transition duration-300 transform hover:scale-105"
//       >
//         Previous
//       </button>
//       <button
//         type="button"
//         onClick={handleNext}
//         className="bg-slate-900 text-orange-500 px-6 py-1 rounded-full hover:bg-slate-600 transition duration-300"
//       >
//         Next
//       </button>
//     </div>
//   </div>
// </div>

//   )}

//   {/* Step 4: Final Details */}
//   {currentStep === 4 && (
//     <div className="min-h-screen text-slate-900 flex flex-col items-center justify-center p-8">
//   <img className='w-14 h-14 md:w-28 md:h-28 rounded-full md:mr-5 shadow-lg' src={logo1} alt="" />
//   <h1 className="text-4xl font-bold mb-4">We're Almost there! You are one step away from joining our community</h1>
//   <h2 className="text-xl mb-8 max-w-2xl text-center text-slate-700">
//     TPConnect allows you to return to previous pages to review and ensure the accuracy of the information entered. 
//         Please verify all details before submission to facilitate approval.
//   </h2>       
//   <div className="p-8 max-w-md w-full">

//     <div className="mb-6">
//       <select 
//         id="category" 
//         name="category" 
//         value={formData.category} 
//         onChange={handleChange} 
//         required 
//         className="w-full px-3 py-2 rounded-xl shadow-xl border-b bg-slate-100 border-slate-500 focus:border-slate-700 focus:outline-none"
//       >
//         <option value="">Select category</option>
//         <option value="Public">Public</option>
//         <option value="Private">Private</option>
//       </select>
//     </div>

//     <div className="mb-6">
//       <input 
//         type="password" 
//         id="pass" 
//         name="pass" 
//         value={formData.pass} 
//         onChange={handleChange} 
//         required 
//         className="w-full px-3 py-2 rounded-xl shadow-xl border-b bg-slate-100 border-slate-500 focus:border-slate-700 focus:outline-none"
//         placeholder="Choose a secure password" 
//       />
//     </div>

//     <div className="mb-6">
//       <input 
//         type="password" 
//         id="confirm_pass" 
//         name="confirm_pass" 
//         value={formData.confirm_pass} 
//         onChange={handleChange} 
//         required 
//         className="w-full px-3 py-2 rounded-xl shadow-xl border-b bg-slate-100 border-slate-500 focus:border-slate-700 focus:outline-none"
//         placeholder="Confirm your password" 
//       />
//       {errors.confirm_pass && <p className="text-red-500 text-xs italic">{errors.confirm_pass}</p>}
//     </div>

//     <div className="flex justify-between w-full">
//       <button
//         type="button"
//         onClick={handlePrevious}
//         className="bg-gray-300 hover:bg-gray-400 text-slate-800 py-2 px-6 rounded-full focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-opacity-50 transition duration-300 transform hover:scale-105"
//       >
//         Previous
//       </button>
//       <button
//         type="submit"
//         className="bg-slate-900 text-orange-500 px-6 py-1 rounded-full hover:bg-slate-600 transition duration-300"
//       >
//         RSubmit
//       </button>
//     </div>
//   </div>
// </div>

//   )}

//   <div className="mt-6 text-center">
//     <button type="button" onClick={() => navigate('/')} className="text-slate-800 hover:text-slate-600 underline">
//       Back to Home
//     </button>
//   </div>

// </form>
//   );
// }

// export default Unisignup;