import React, { useEffect, useState } from 'react';
import axios from 'axios';

const HighSchool = () => {
  const [highSchools, setHighSchools] = useState([]);

  useEffect(() => {
    const fetchHighSchools = async () => {
      try {
        const response = await axios.get('/api/highSchools');
        setHighSchools(response.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchHighSchools();
  }, []);

  return (
    <div className="container overflow-x-auto mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">High Schools</h1>
      <table className="min-w-full bg-white">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b">School Name</th>
            <th className="py-2 px-4 border-b">Registration Number</th>
            <th className="py-2 px-4 border-b">School Level</th>
            <th className="py-2 px-4 border-b">Education System</th>
            <th className="py-2 px-4 border-b">School Type</th>
            <th className="py-2 px-4 border-b">Official Email</th>
            <th className="py-2 px-4 border-b">Website</th>
            <th className="py-2 px-4 border-b">Principal Name</th>
            <th className="py-2 px-4 border-b">Principal Email</th>
            <th className="py-2 px-4 border-b">County</th>
            <th className="py-2 px-4 border-b">Created At</th>
            <th className="py-2 px-4 border-b">Updated At</th>
          </tr>
        </thead>
        <tbody>
          {highSchools.map((school) => (
            <tr key={school.school_id}>
              <td className="py-2 px-4 border-b">{school.school_name}</td>
              <td className="py-2 px-4 border-b">{school.registration_number}</td>
              <td className="py-2 px-4 border-b">{school.school_level}</td>
              <td className="py-2 px-4 border-b">{school.education_system}</td>
              <td className="py-2 px-4 border-b">{school.school_type}</td>
              <td className="py-2 px-4 border-b">{school.official_email}</td>
              <td className="py-2 px-4 border-b">{school.website}</td>
              <td className="py-2 px-4 border-b">{school.principal_name}</td>
              <td className="py-2 px-4 border-b">{school.principal_email}</td>
              <td className="py-2 px-4 border-b">{school.county}</td>
              <td className="py-2 px-4 border-b">{new Date(school.created_at).toLocaleString()}</td>
              <td className="py-2 px-4 border-b">{new Date(school.updated_at).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default HighSchool;
