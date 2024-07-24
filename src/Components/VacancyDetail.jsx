// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { useParams } from 'react-router-dom';

// const VacancyDetail = () => {
//   const { vancancy_id } = useParams();
//   console.log(vancancy_id);
//   const [vacancyDetails, setVacancyDetails] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const fetchVacancyDetails = async () => {
//     if (!vancancy_id || vancancy_id === ':vancancy_id') {
//       console.error('Invalid vancancy_id:', vancancy_id);
//       setError('Invalid Vacancy ID');
//       setLoading(false);
//       return;
//     }

//     try {
//       console.log('Fetching vacancy details for ID:', vancancy_id);
//       const response = await axios.get(`http://localhost:5000/api/vacancy/${vancancy_id}`,{
//         headers:{
//           'Content-Type': 'application/json',
//         },
        
//       });

//       const data = response.data;  // Define data here
//       console.log('Data:', data);
//       setVacancyDetails(data);

//       console.log('Response:', response);
//       setVacancyDetails(response.data);
//       setLoading(false);
//     } catch (err) {
//       console.error('Error fetching vacancy details:', err);
//       // setError(`Error fetching vacancy details: ${err.message}`);
//       setLoading(false);
//     }
//   };

//   fetchVacancyDetails();
// }, [vancancy_id]);

//   if (loading) return <div>Loading...</div>;
//   if (error) return <div>{error}</div>;
//   if (!vacancyDetails) return <div>Vacancy not found</div>;

//   return (
//     <div>
//       <h1>{vacancyDetails.primary_subject} - {vacancyDetails.secondary_subject}</h1>
//       <p>Positions Available: {vacancyDetails.positions_available}</p>
//       <p>Start Date: {vacancyDetails.start_date}</p>
//       <p>End Date: {vacancyDetails.end_date}</p>
//       <p>Application Deadline: {vacancyDetails.application_deadline}</p>
//       <p>Application Method: {vacancyDetails.application_method}</p>
//       <p>Coordinator Name: {vacancyDetails.coordinator_name}</p>
//       <p>Coordinator Email: {vacancyDetails.coordinator_email}</p>
//       <p>Coordinator Phone: {vacancyDetails.coordinator_phone}</p>
//       <p>Accommodation Provided: {vacancyDetails.accommodation_provided ? 'Yes' : 'No'}</p>
//       <p>Stipend Amount: {vacancyDetails.stipend_amount}</p>
//       <h2>School Information</h2>
//       <p>School Name: {vacancyDetails.school_name}</p>
//       <p>Official Email: {vacancyDetails.official_email}</p>
//       <p>Official Phone Number: {vacancyDetails.official_phone_number}</p>
//       <p>County: {vacancyDetails.county}</p>
//       <img src={vacancyDetails.school_photo_url} alt="School" />
//     </div>
//   );
// };

// export default VacancyDetail;
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { format } from 'date-fns';

const Vacancy = () => {
  const { vancancy_id } = useParams();
  const [vacancy, setVacancy] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  console.log(vancancy_id);

  useEffect(() => {
    const fetchVacancy = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/vacancy/${vancancy_id}`);
        setVacancy(response.data);
      } catch (error) {
        setError('Error fetching vacancy details');
      } finally {
        setLoading(false);
      }
    };

    fetchVacancy();
  }, [vancancy_id]);

  if (loading) {
    return <div className="text-center mt-5">Loading...</div>;
  }

  if (error) {
    return <div className="text-center mt-5 text-red-500">{error}</div>;
  }

  const formatDate = (dateString) => {
    return format(new Date(dateString), 'PPPP');
  };

  return (
    <div className="max-w-3xl mx-auto p-5 bg-white shadow-lg rounded-lg mt-5">
      {vacancy && (
        <div>
          <h1 className="text-2xl font-bold mb-4">{vacancy.primary_subject}</h1>
          <p className="text-gray-700 mb-2">
            <strong>Secondary Subject:</strong> {vacancy.secondary_subject}
          </p>
          <p className="text-gray-700 mb-2">
            <strong>Positions Available:</strong> {vacancy.positions_available}
          </p>
          <p className="text-gray-700 mb-2">
            <strong>Start Date:</strong> {formatDate(vacancy.start_date)}
          </p>
          <p className="text-gray-700 mb-2">
            <strong>End Date:</strong> {formatDate(vacancy.end_date)}
          </p>
          <p className="text-gray-700 mb-2">
            <strong>Application Deadline:</strong> {vacancy.application_deadline}
          </p>
          <p className="text-gray-700 mb-2">
            <strong>Coordinator Name:</strong> {vacancy.coordinator_name}
          </p>
          <p className="text-gray-700 mb-2">
            <strong>Coordinator Email:</strong> {vacancy.coordinator_email}
          </p>
          <p className="text-gray-700 mb-2">
            <strong>Coordinator Phone:</strong> {vacancy.coordinator_phone}
          </p>
          <p className="text-gray-700 mb-2">
            <strong>Accommodation Provided:</strong> {vacancy.accommodation_provided ? 'Yes' : 'No'}
          </p>
          <p className="text-gray-700 mb-2">
            <strong>Stipend Amount:</strong> {vacancy.stipend_amount}
          </p>
          <p className="text-gray-700 mb-2">
            <strong>School ID:</strong> {vacancy.school_id}
          </p>

          <button
            className="mt-4 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700 transition duration-200"
          >
            <a href="mailto:${vacancy.coordinator_email}?subject=Application for ${vacancy.primary_subject} Vacancy&body=Dear ${vacancy.coordinator_name},%0D%0A%0D%0AI am interested in applying for the ${vacancy.primary_subject} position. Please provide me with further details on the application process.%0D%0A%0D%0AThank you.%0D%0A%0D%0ABest regards,`">Apply Now</a>
          </button>
        </div>
      )}
    </div>
  );
};

export default Vacancy;
