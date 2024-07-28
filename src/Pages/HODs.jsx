import React, { useEffect, useState } from 'react';
import axios from 'axios';

const HODs = () => {
  const [hods, setHODs] = useState([]);

  useEffect(() => {
    const fetchHODs = async () => {
      try {
        const response = await axios.get('/api/hods');
        setHODs(response.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchHODs();
  }, []);

  const deleteHOD = async (id) => {
    try {
      await axios.delete(`/api/hods/${id}`);
      setHODs(hods.filter(hod => hod.hod_id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Heads of Department (HODs)</h1>
      <table className="min-w-full bg-white">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b">HOD Name</th>
            <th className="py-2 px-4 border-b">Email</th>
            <th className="py-2 px-4 border-b">University ID</th>
            <th className="py-2 px-4 border-b">Actions</th>
          </tr>
        </thead>
        <tbody>
          {hods.map((hod) => (
            <tr key={hod.hod_id}>
              <td className="py-2 px-4 border-b">{hod.hod_name}</td>
              <td className="py-2 px-4 border-b">{hod.email}</td>
              <td className="py-2 px-4 border-b">{hod.university_id}</td>
              <td className="py-2 px-4 border-b">
                <button
                  onClick={() => deleteHOD(hod.hod_id)}
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

export default HODs;
