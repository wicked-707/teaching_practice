import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Supervisors = () => {
  const [supervisors, setSupervisors] = useState([]);

  useEffect(() => {
    const fetchSupervisors = async () => {
      try {
        const response = await axios.get('/api/supervisors');
        setSupervisors(response.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchSupervisors();
  }, []);

  const deleteSupervisor = async (id) => {
    try {
      await axios.delete(`/api/supervisors/${id}`);
      setSupervisors(supervisors.filter(supervisor => supervisor.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Supervisors</h1>
      <table className="min-w-full bg-white">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b">Supervisor Name</th>
            <th className="py-2 px-4 border-b">Email</th>
            <th className="py-2 px-4 border-b">Approval Status</th>
            <th className="py-2 px-4 border-b">University ID</th>
            <th className="py-2 px-4 border-b">Course ID</th>
            <th className="py-2 px-4 border-b">Actions</th>
          </tr>
        </thead>
        <tbody>
          {supervisors.map((supervisor) => (
            <tr key={supervisor.id}>
              <td className="py-2 px-4 border-b">{supervisor.supervisor_name}</td>
              <td className="py-2 px-4 border-b">{supervisor.email}</td>
              <td className="py-2 px-4 border-b">{supervisor.approval_status}</td>
              <td className="py-2 px-4 border-b">{supervisor.university_id}</td>
              <td className="py-2 px-4 border-b">{supervisor.course_id}</td>
              <td className="py-2 px-4 border-b">
                <button
                  onClick={() => deleteSupervisor(supervisor.id)}
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

export default Supervisors;
