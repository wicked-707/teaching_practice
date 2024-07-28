import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Universities = () => {
  const [universities, setUniversities] = useState([]);

  useEffect(() => {
    const fetchUniversities = async () => {
      try {
        const response = await axios.get('/api/universities');
        setUniversities(response.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchUniversities();
  }, []);

  const deleteUniversity = async (id) => {
    try {
      await axios.delete(`/api/universities/${id}`);
      setUniversities(universities.filter(university => university.university_id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="container mx-auto overflow-x-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Universities</h1>
      <table className="min-w-full bg-white">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b">University Name</th>
            <th className="py-2 px-4 border-b">Registration Number</th>
            <th className="py-2 px-4 border-b">Charter Number</th>
            <th className="py-2 px-4 border-b">Official Email</th>
            <th className="py-2 px-4 border-b">Website</th>
            <th className="py-2 px-4 border-b">County</th>
            <th className="py-2 px-4 border-b">Actions</th>
          </tr>
        </thead>
        <tbody>
          {universities.map((university) => (
            <tr key={university.university_id}>
              <td className="py-2 px-4 border-b">{university.university_name}</td>
              <td className="py-2 px-4 border-b">{university.registration_number}</td>
              <td className="py-2 px-4 border-b">{university.charter_number}</td>
              <td className="py-2 px-4 border-b">{university.official_email}</td>
              <td className="py-2 px-4 border-b">{university.website}</td>
              <td className="py-2 px-4 border-b">{university.county}</td>
              <td className="py-2 px-4 border-b">
                <button
                  onClick={() => deleteUniversity(university.university_id)}
                  className="bg-red-500 text-white px-4 py-2 rounded"
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

export default Universities;
