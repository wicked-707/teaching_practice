import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ProtectedRoute from './ProtectedRoutes';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';
import { getCurrentStudent } from '../Services/AuthService';

function Vacancy() {
  const [school, setSchool] = useState(null);
  const [error, setError] = useState([]);
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState([]);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    primary_subject: '',
    secondary_subject: '',
    positions_available: '',
    stat_date: '',
    end_date: '',
    application_deadline: '',
    application_method: '',
    coordinator_name: '',
    coordinator_email: '',
    coordinator_phone: '',
    accommodation_provided: '',
    stipend_amount: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    const fetchSchoolData = async () => {
      try {
        const studentToken = getCurrentStudent();
        console.log(studentToken);

        if (!studentToken) {
          navigate('/signin', { state: { from: location.pathname } });
          return;
        }

        const decodedToken = jwtDecode(studentToken);

        if (!decodedToken) {
          console.log(decodedToken);
          setError('Invalid token format');
          setLoading(false);
          return;
        }

        const userRoles = decodedToken.role;
        console.log(userRoles);
        if (!userRoles.includes('highschool')) {
          setError('Access denied');
          setLoading(false);
          return;
        }

        const schoolData = {
          id: decodedToken.school_id,
          Name: decodedToken.school_name,
          email: decodedToken.official_email,
          roles: decodedToken.role,
        };
        console.log(schoolData);

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

  const submitForm = async () => {
    try {
      const studentToken = getCurrentStudent();
      if (!studentToken) {
        throw new Error('No token found');
      }

      const decodedToken = jwtDecode(studentToken);
      const school_id = decodedToken.school_id;

      const currentTime = Math.floor(Date.now() / 1000);
      if (decodedToken.exp < currentTime) {
        throw new Error('Token has expired');
      }

      const fullFormData = {
        ...formData,
        school_id,
      };

      const response = await axios.post('http://localhost:5000/vacancy/add', fullFormData, {
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${studentToken}`,
        },
      });

      setMessage('Vacancy created successfully!');
      alert('Vacancy created successfully!');
      // Reset form or redirect if needed
    } catch (error) {
      console.error('Error uploading vacancy:', error);
      setError('Failed to create vacancy');
      alert('Failed to create vacancy');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (step === 5) {  // Only submit if we're on the final confirmation step
      submitForm();
    }
  };

  const nextStep = () => {
    setStep(step + 1);
  };

  const prevStep = () => {
    setStep(step - 1);
  };

  const renderStep = () => {
    switch(step) {
      case 1:
        return (
          <>
            <h1 className="text-4xl font-bold mb-4">Basic Information</h1>
            <h2 className="text-xl mb-8 max-w-2xl text-center text-slate-700">
              Let's start with the fundamental details of the vacancy.
            </h2>
            <div className="mb-6">
              <input
                type="text"
                name="primary_subject"
                value={formData.primary_subject}
                onChange={handleChange}
                placeholder="Primary Subject"
                required
                className="w-full px-3 py-2 rounded-xl shadow-xl border-b bg-slate-100 border-slate-500 focus:border-slate-700 focus:outline-none"
              />
            </div>
            <div className="mb-6">
              <input
                type="text"
                name="secondary_subject"
                value={formData.secondary_subject}
                onChange={handleChange}
                placeholder="Secondary Subject (if any)"
                className="w-full px-3 py-2 rounded-xl shadow-xl border-b bg-slate-100 border-slate-500 focus:border-slate-700 focus:outline-none"
              />
            </div>
            <div className="mb-6">
              <input
                type="number"
                name="positions_available"
                value={formData.positions_available}
                onChange={handleChange}
                placeholder="Number of Positions Available"
                required
                className="w-full px-3 py-2 rounded-xl shadow-xl border-b bg-slate-100 border-slate-500 focus:border-slate-700 focus:outline-none"
              />
            </div>
          </>
        );
      case 2:
        return (
          <>
            <h1 className="text-4xl font-bold mb-4">Important Dates</h1>
            <h2 className="text-xl mb-8 max-w-2xl text-center text-slate-700">
              Please provide the key dates for this vacancy.
            </h2>
            <div className="mb-6">
              <label htmlFor="Start_date">Starting Date:</label>
              <input
                type="date"
                name="stat_date"
                value={formData.stat_date}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 rounded-xl shadow-xl border-b bg-slate-100 border-slate-500 focus:border-slate-700 focus:outline-none"
              />
            </div>
            <div className="mb-6">
              <label htmlFor="application_deadline">Completion Date:</label>
              <input
                type="date"
                name="end_date"
                value={formData.end_date}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 rounded-xl shadow-xl border-b bg-slate-100 border-slate-500 focus:border-slate-700 focus:outline-none"
              />
            </div>
            <div className="mb-6">
              <label htmlFor="application_deadline">Application Deadline:</label>
              <input
                type="date"
                name="application_deadline"
                value={formData.application_deadline}
                placeholder='Application Deadline'
                onChange={handleChange}
                className="w-full px-3 py-2 rounded-xl shadow-xl border-b bg-slate-100 border-slate-500 focus:border-slate-700 focus:outline-none"
              />
            </div>
          </>
        );
      case 3:
        return (
          <>
            <h1 className="text-4xl font-bold mb-4">Coordinator Details</h1>
            <h2 className="text-xl mb-8 max-w-2xl text-center text-slate-700">
              Who should applicants contact about this vacancy?
            </h2>
            <div className="mb-6">
              <input
                type="text"
                name="coordinator_name"
                value={formData.coordinator_name}
                onChange={handleChange}
                placeholder="Coordinator Name"
                className="w-full px-3 py-2 rounded-xl shadow-xl border-b bg-slate-100 border-slate-500 focus:border-slate-700 focus:outline-none"
              />
            </div>
            <div className="mb-6">
              <input
                type="email"
                name="coordinator_email"
                value={formData.coordinator_email}
                onChange={handleChange}
                placeholder="Coordinator Email"
                className="w-full px-3 py-2 rounded-xl shadow-xl border-b bg-slate-100 border-slate-500 focus:border-slate-700 focus:outline-none"
              />
            </div>
            <div className="mb-6">
              <input
                type="tel"
                name="coordinator_phone"
                value={formData.coordinator_phone}
                onChange={handleChange}
                placeholder="Coordinator Phone"
                className="w-full px-3 py-2 rounded-xl shadow-xl border-b bg-slate-100 border-slate-500 focus:border-slate-700 focus:outline-none"
              />
            </div>
          </>
        );
      case 4:
        return (
          <>
            <h1 className="text-4xl font-bold mb-4">Additional Information</h1>
            <h2 className="text-xl mb-8 max-w-2xl text-center text-slate-700">
              Let's finish up with some final details.
            </h2>
            <div className="mb-6">
              <input
                type="text"
                name="application_method"
                value={formData.application_method}
                onChange={handleChange}
                placeholder="Application Method"
                className="w-full px-3 py-2 rounded-xl shadow-xl border-b bg-slate-100 border-slate-500 focus:border-slate-700 focus:outline-none"
              />
            </div>
            <div className="mb-6">
              <select
                name="accommodation_provided"
                value={formData.accommodation_provided}
                onChange={handleChange}
                className="w-full px-3 py-2 rounded-xl shadow-xl border-b bg-slate-100 border-slate-500 focus:border-slate-700 focus:outline-none"
              >
                <option value="">Accommodation Provided?</option>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>
            </div>
            <div className="mb-6">
              <input
                type="number"
                name="stipend_amount"
                value={formData.stipend_amount}
                onChange={handleChange}
                placeholder="Stipend Amount"
                step="0.01"
                className="w-full px-3 py-2 rounded-xl shadow-xl border-b bg-slate-100 border-slate-500 focus:border-slate-700 focus:outline-none"
              />
            </div>
          </>
        );
      case 5:
        return (
          <>
            <h1 className="text-4xl font-bold mb-4">Review and Submit</h1>
            <h2 className="text-xl mb-8 max-w-2xl text-center text-slate-700">
              Please review your inputs before submitting.
            </h2>
            <div className="mb-6">
              <p><strong>Primary Subject:</strong> {formData.primary_subject}</p>
              <p><strong>Secondary Subject:</strong> {formData.secondary_subject}</p>
              <p><strong>Positions Available:</strong> {formData.positions_available}</p>
              <p><strong>Start Date:</strong> {formData.stat_date}</p>
              <p><strong>End Date:</strong> {formData.end_date}</p>
              <p><strong>Application Deadline:</strong> {formData.application_deadline}</p>
              <p><strong>Coordinator Name:</strong> {formData.coordinator_name}</p>
              <p><strong>Coordinator Email:</strong> {formData.coordinator_email}</p>
              <p><strong>Coordinator Phone:</strong> {formData.coordinator_phone}</p>
              <p><strong>Application Method:</strong> {formData.application_method}</p>
              <p><strong>Accommodation Provided:</strong> {formData.accommodation_provided}</p>
              <p><strong>Stipend Amount:</strong> {formData.stipend_amount}</p>
            </div>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen text-slate-900 flex flex-col items-center justify-center p-8">
      <form onSubmit={handleSubmit} className="p-8 max-w-md w-full">
        {renderStep()}
        <div className="flex justify-between w-full mt-6">
          {step > 1 && (
            <button
              type="button"
              onClick={prevStep}
              className="text-cyan-500 pr-4 py-1 pl-3 rounded-3xl hover:underline flex items-center bg-slate-950"
            >
              <img src="https://img.icons8.com/?size=80&id=1RH5tsh9xuwl&format=png" alt="" className="w-4 h-4" />
              <span className="ml-1 font-medium">Back</span>
            </button>
          )}
          {step < 5 ? (
            <button
              type="button"
              onClick={nextStep}
              className="bg-slate-900 text-orange-500 px-6 py-1 rounded-full hover:bg-slate-600 transition duration-300"
            >
              {step === 4 ? "Review" : "Next"}
            </button>
          ) : (
            <button
              type="submit"
              className="bg-slate-900 text-orange-500 px-6 py-1 rounded-full hover:bg-slate-600 transition duration-300"
            >
              Submit Vacancy
            </button>
          )}
        </div>
      </form>
    </div>
  );
}

export default Vacancy;