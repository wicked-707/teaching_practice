import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import logo1 from '../assets/logo1.jpeg';

function HighschoolSignup() {
  const [formData, setFormData] = useState({
    school_name: '',
    establishment_date: '',
    registration_number: '',
    school_level: '',
    education_system: '',
    school_type: '',
    official_email: '',
    official_phone_number: '',
    website: '',
    postal_address: '',
    physical_address: '',
    principal_name: '',
    principal_email: '',
    principal_phone: '',
    county: '',
    sub_county: '',
    hashed_password: '',
    confirm_pass: ''
  });

  const [school_photo, setSchool_photo] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [currentStep, setCurrentStep] = useState(1);

  const handleNext = () => {
    setCurrentStep(currentStep + 1);
  };

  const handlePrevious = () => {
    setCurrentStep(currentStep - 1);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    setSchool_photo(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (formData.hashed_password !== formData.confirm_pass) {
      setError("Passwords do not match");
      return;
    }

    const formDataToSend = new FormData();
    Object.keys(formData).forEach(key => {
      formDataToSend.append(key, formData[key]);
    });
    if (school_photo) {
      formDataToSend.append('school_photo', school_photo);
    }

    try {
      const response = await axios.post('http://localhost:5000/high_school', formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      setSuccess('High School registered successfully!');
          console.log('High School registered:', JSON.stringify(response.data)); // Logging response data as JSON string

      console.log('High School registered:', response.data);

      // Reset form or redirect here
    } catch (err) {
      setError('An error occurred while registering the high school.');
      console.error('Error:', err);
    }
  };

  return (
    <form onSubmit={handleSubmit} encType="multipart/form-data" className="w-screen mx-auto p-8 bg-slate-100 shadow-lg rounded-lg">
  
  {/* Step 1: Basic Information */}
  {currentStep === 1 && (
    <div className="min-h-screen text-slate-900 flex flex-col items-center justify-center p-8">
      <h1 className="text-4xl font-bold mb-4">We're excited you joining us in shaping the future of education</h1>
      <h2 className="text-xl mb-8 max-w-2xl text-center text-slate-700">
        To get started, we need some key information about your school.
      </h2>      
      <div className=" p-8 max-w-md w-full">
          <div className="mb-6">
            <input 
              type="text" 
              id="school_name" 
              name="school_name" 
              value={formData.school_name} 
              onChange={handleChange} 
              required 
              className="w-full px-3 py-2 rounded-xl shadow-xl border-b bg-slate-100 border-slate-500 focus:border-slate-700 focus:outline-none"
              placeholder="What's your school called?"
            />
          </div>

          <div className="mb-6">
            <input 
              type="date" 
              id="establishment_date" 
              name="establishment_date" 
              value={formData.establishment_date} 
              onChange={handleChange} 
              required 
              className="w-full px-3 py-2 rounded-xl shadow-xl border-b bg-slate-100 border-slate-500 focus:border-slate-700 focus:outline-none "
            />
          </div>

          <div className="mb-6">
            <input 
              type="text" 
              id="registration_number" 
              name="registration_number" 
              value={formData.registration_number} 
              onChange={handleChange} 
              required 
              className="w-full px-3 py-2 rounded-xl shadow-xl border-b bg-slate-100 border-slate-500 focus:border-slate-700 focus:outline-none"
              placeholder="What's your registration number?"
            />
          </div>

          <div className="mb-6">
            <input 
              type="text" 
              id="school_level" 
              name="school_level" 
              value={formData.school_level} 
              onChange={handleChange} 
              required 
              className="w-full px-3 py-2 rounded-xl shadow-xl border-b bg-slate-100 border-slate-500 focus:border-slate-700 focus:outline-none "
              placeholder="What level of education do you offer?"
            />
          </div>

          <div className="flex justify-between w-full">
            <Link to="/loginchoice" className="text-cyan-500 pr-4 py-1 pl-3 rounded-3xl hover:underline flex items-center bg-slate-950 lg:ml-[18px]">
              <img src="https://img.icons8.com/?size=80&id=1RH5tsh9xuwl&format=png" alt="" className=' w-4 h-4' />
                <p className='ml-1 font-medium'>Back</p>
              </Link>
            <button 
              type="button" 
              onClick={handleNext} 
              className="bg-slate-900 text-orange-500 px-6 py-1 rounded-full hover:bg-slate-600 transition duration-300"
            >
              Next
            </button>
          </div>
      </div>
    </div>
  )}

  {/* Step 2: Educational Details */}
  {currentStep === 2 && (
    <div className="min-h-screen text-slate-900 flex text-center flex-col items-center justify-center p-8">
      <img className='w-32 h-32 rounded-full shadow-lg md:mb-3' src={logo1} alt="" />
      <h1 className="text-4xl font-bold mb-4">Let's dive deeper into your school's profile</h1>
      <h2 className="text-xl mb-8 max-w-2xl text-center text-slate-700">
        Tell us more about your educational approach and location
      </h2>
      
      <div className="p-8 max-w-md w-full">
        <div className="mb-6">
          <input
            type="text"
            id="education_system"
            name="education_system"
            value={formData.education_system}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 rounded-xl shadow-xl border-b bg-slate-100 border-slate-500 focus:border-slate-700 focus:outline-none"
            placeholder="What education system do you follow?"
          />
        </div>

        <div className="mb-6">
          <input
            type="text"
            id="school_type"
            name="school_type"
            value={formData.school_type}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 rounded-xl shadow-xl border-b bg-slate-100 border-slate-500 focus:border-slate-700 focus:outline-none"
            placeholder="What type of school are you?"
          />
        </div>

        <div className="mb-6">
          <input
            type="text"
            id="postal_address"
            name="postal_address"
            value={formData.postal_address}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 rounded-xl shadow-xl border-b bg-slate-100 border-slate-500 focus:border-slate-700 focus:outline-none"
            placeholder="What's your postal address?"
          />
        </div>

        <div className="mb-6">
          <input
            type="text"
            id="physical_address"
            name="physical_address"
            value={formData.physical_address}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 rounded-xl shadow-xl border-b bg-slate-100 border-slate-500 focus:border-slate-700 focus:outline-none"
            placeholder="Where are you located?"
          />
        </div>

        <div className="flex justify-between w-full">
          <button
            type="button"
            onClick={handlePrevious}
            className="bg-slate-900 text-orange-500 px-6 py-1 rounded-full hover:bg-slate-600 transition duration-300"
          >
            Previous
          </button>
          <button
            type="button"
            onClick={handleNext}
            className="bg-slate-900 text-orange-500 px-6 py-1 rounded-full hover:bg-slate-600 transition duration-300"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  )}

  {/* Step 3: Location Details */}
  {currentStep === 3 && (
    <div className="min-h-screen text-slate-900 flex text-center flex-col items-center justify-center p-8">
      <img className='w-32 h-32 rounded-full shadow-lg md:mb-3' src={logo1} alt="School logo" />
      <h1 className="text-4xl font-bold mb-4">Pinpoint your location</h1>
      <h2 className="text-xl mb-8 max-w-2xl text-center text-slate-700">
        Help us understand where you're situated
      </h2>
     
      <div className="p-8 max-w-md w-full">
        <div className="mb-6">
          <input
            type="text"
            id="county"
            name="county"
            value={formData.county}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 rounded-xl shadow-xl border-b bg-slate-100 border-slate-500 focus:border-slate-700 focus:outline-none"
            placeholder="Which county are you in?"
          />
        </div>
        <div className="mb-6">
          <input
            type="text"
            id="sub_county"
            name="sub_county"
            value={formData.sub_county}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 rounded-xl shadow-xl border-b bg-slate-100 border-slate-500 focus:border-slate-700 focus:outline-none"
            placeholder="And which sub-county?"
          />
        </div>
        <div className="flex justify-between w-full">
          <button
            type="button"
            onClick={handlePrevious}
            className="bg-slate-900 text-orange-500 px-6 py-1 rounded-full hover:bg-slate-600 transition duration-300"
          >
            Previous
          </button>
          <button
            type="button"
            onClick={handleNext}
            className="bg-slate-900 text-orange-500 px-6 py-1 rounded-full hover:bg-slate-600 transition duration-300"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  )}

  {/* Step 4: Principal Details */}
  {currentStep === 4 && (
    <div className="min-h-screen text-slate-900 flex text-center flex-col items-center justify-center p-8">
      <img className='w-32 h-32 rounded-full shadow-lg md:mb-3' src={logo1} alt="School logo" />
      <h1 className="text-4xl font-bold mb-4">Who's in charge?</h1>
      <h2 className="text-xl mb-8 max-w-2xl text-center text-slate-700">
        Let's get to know your school's Administrator for easier communication and further enquiry.
      </h2>
     
      <div className="p-8 max-w-md w-full">
        <div className="mb-6">
          <input
            type="tel"
            id="official_phone_number"
            name="official_phone_number"
            value={formData.official_phone_number}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 rounded-xl shadow-xl border-b bg-slate-100 border-slate-500 focus:border-slate-700 focus:outline-none"
            placeholder="What's the official phone number?"
          />
        </div>
        <div className="mb-6">
          <input
            type="text"
            id="principal_name"
            name="principal_name"
            value={formData.principal_name}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 rounded-xl shadow-xl border-b bg-slate-100 border-slate-500 focus:border-slate-700 focus:outline-none"
            placeholder="Who's your principal?"
          />
        </div>
        <div className="mb-6">
          <input
            type="email"
            id="principal_email"
            name="principal_email"
            value={formData.principal_email}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 rounded-xl shadow-xl border-b bg-slate-100 border-slate-500 focus:border-slate-700 focus:outline-none"
            placeholder="What's the principal's email?"
          />
        </div>
        <div className="mb-6">
          <input
            type="tel"
            id="principal_phone"
            name="principal_phone"
            value={formData.principal_phone}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 rounded-xl shadow-xl border-b bg-slate-100 border-slate-500 focus:border-slate-700 focus:outline-none"
            placeholder="And their phone number?"
          />
        </div>
        <div className="flex justify-between w-full">
          <button
            type="button"
            onClick={handlePrevious}
            className="bg-slate-900 text-orange-500 px-6 py-1 rounded-full hover:bg-slate-600 transition duration-300"
          >
            Previous
          </button>
          <button
            type="button"
            onClick={handleNext}
            className="bg-slate-900 text-orange-500 px-6 py-1 rounded-full hover:bg-slate-600 transition duration-300"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  )}

  {/* Step 5: Contact Information */}
  {currentStep === 5 && (
    <div className="min-h-screen text-slate-900 flex text-center flex-col items-center justify-center p-8">
      <img className='w-32 h-32 rounded-full shadow-lg md:mb-3' src={logo1} alt="School logo" />
      <h1 className="text-4xl font-bold mb-4">You are one click away from completing registration</h1>
      <h2 className="text-xl mb-8 max-w-2xl text-center text-slate-700">
        TPConnect allows you to return to previous pages to review and ensure the accuracy of the information entered. 
        Please verify all details before submission to facilitate approval.
      </h2>
     
      <div className="p-8 max-w-md w-full">
        <div className="mb-6">
          <input
            type="email"
            id="official_email"
            name="official_email"
            value={formData.official_email}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 rounded-xl shadow-xl border-b bg-slate-100 border-slate-500 focus:border-slate-700 focus:outline-none"
            placeholder="What's your official email?"
          />
        </div>
        <div className="mb-6">
          <input
            type="url"
            id="website"
            name="website"
            value={formData.website}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 rounded-xl shadow-xl border-b bg-slate-100 border-slate-500 focus:border-slate-700 focus:outline-none"
            placeholder="Do you have a website?"
          />
        </div>
        <div className="mb-6">
          <input
            type="password"
            id="hashed_password"
            name="hashed_password"
            value={formData.hashed_password}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 rounded-xl shadow-xl border-b bg-slate-100 border-slate-500 focus:border-slate-700 focus:outline-none"
            placeholder="Choose a secure password"
          />
        </div>
        <div className="mb-6">
          <input
            type="password"
            id="confirm_pass"
            name="confirm_pass"
            value={formData.confirm_pass}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 rounded-xl shadow-xl border-b bg-slate-100 border-slate-500 focus:border-slate-700 focus:outline-none"
            placeholder="Confirm your password"
          />
        </div>
        <div className="mb-6">
          <label htmlFor="school_photo" className="block text-sm font-medium text-slate-700 mb-2">Show us your school:</label>
          <input 
            type="file" 
            id="school_photo" 
            name="school_photo" 
            onChange={handleFileChange} 
            accept="image/*" 
            className="w-full bg-slate-100 border border-slate-300 rounded-xl shadow-xl py-2 px-3 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent" 
          />
        </div>

        {error && <p className="text-red-500 mb-4">{error}</p>}
        {success && <p className="text-green-500 mb-4">{success}</p>}

        <div className="flex justify-between w-full">
          <button
            type="button"
            onClick={handlePrevious}
            className="bg-slate-900 text-orange-500 px-6 py-1 rounded-full hover:bg-slate-600 transition duration-300"
          >
            Previous
          </button>
          <button
            type="submit"
            onClick={handleSubmit}
            className="bg-slate-900 text-orange-500 px-6 py-1 rounded-full hover:bg-slate-600 transition duration-300"
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  )}

</form>
  );
}

export default HighschoolSignup;