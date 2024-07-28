import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ManageVacancies = () => {
  const [vacancies, setVacancies] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchVacancies = async () => {
      try {
        const token = localStorage.getItem('token');
        const headers = { Authorization: `Bearer ${token}` };
        
        const response = await axios.get('/api/vacancies', { headers });
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

    fetchVacancies();
  }, []);

  const handleDelete = async (vacancyId) => {
    try {
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };

      await axios.delete(`/api/vacancies/${vacancyId}`, { headers });
      setVacancies(vacancies.filter(vacancy => vacancy.vacancy_id !== vacancyId));
    } catch (err) {
      console.error('Error deleting vacancy:', err.message);
      setError(err.message);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Manage Vacancies</h1>
      {error && <p className="text-red-500">{error}</p>}
      <table className="min-w-full bg-white border border-gray-300">
        <thead>
          <tr>
            <th className="border px-4 py-2">Primary Subject</th>
            <th className="border px-4 py-2">Secondary Subject</th>
            <th className="border px-4 py-2">Positions Available</th>
            <th className="border px-4 py-2">Start Date</th>
            <th className="border px-4 py-2">End Date</th>
            <th className="border px-4 py-2">Application Deadline</th>
            <th className="border px-4 py-2">Coordinator Name</th>
            <th className="border px-4 py-2">Coordinator Email</th>
            <th className="border px-4 py-2">Coordinator Phone</th>
            <th className="border px-4 py-2">Accommodation Provided</th>
            <th className="border px-4 py-2">Stipend Amount</th>
            <th className="border px-4 py-2">School Name</th>
            <th className="border px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {vacancies.map(vacancy => (
            <tr key={vacancy.vacancy_id}>
              <td className="border px-4 py-2">{vacancy.primary_subject}</td>
              <td className="border px-4 py-2">{vacancy.secondary_subject}</td>
              <td className="border px-4 py-2">{vacancy.positions_available}</td>
              <td className="border px-4 py-2">{vacancy.start_date}</td>
              <td className="border px-4 py-2">{vacancy.end_date}</td>
              <td className="border px-4 py-2">{vacancy.application_deadline}</td>
              <td className="border px-4 py-2">{vacancy.coordinator_name}</td>
              <td className="border px-4 py-2">{vacancy.coordinator_email}</td>
              <td className="border px-4 py-2">{vacancy.coordinator_phone}</td>
              <td className="border px-4 py-2">{vacancy.accommodation_provided ? 'Yes' : 'No'}</td>
              <td className="border px-4 py-2">{vacancy.stipend_amount}</td>
              <td className="border px-4 py-2">{vacancy.school_name}</td>
              <td className="border px-4 py-2">
                <button 
                  onClick={() => handleDelete(vacancy.vacancy_id)} 
                  className="text-red-500 hover:text-red-700"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ManageVacancies;
