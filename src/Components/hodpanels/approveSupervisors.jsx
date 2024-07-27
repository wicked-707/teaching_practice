import axios from 'axios';
import React, { useEffect, useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';

function AproveSupervisor() {
  const [supervisors, setSupervisors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPendingSupervisor = async () => {
      try {
        const response = await axios.get('/api/supervisors/pending');
        setSupervisors(response.data.pending_supervisors);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch pending supervisor');
        setLoading(false);
      }
    };

    fetchPendingSupervisor();
  }, []);

  const handleStatusUpdate = async (registrationId, status) => {
    console.log(registrationId, status);
    try {
      
      const response = await fetch(`http://localhost:5000/supervisors/updateStatus/${registrationId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ approval_status: status }),
      });
      console.log('Update response:', response);
  
      if (response.ok) {
        toast.success('Student status updated successfully', {
          duration: 3000,
          position: 'top-center'
        });
        setSupervisors(supervisors.filter(supervisor => supervisor.id !== registrationId));
      } else {
        throw new Error('Failed to update student status');
        // setError('Unexpected response from server');
      }
    } catch (err) {
      console.error('Error updating student status:', err);
      toast.error('Failed to update student statusss',{
        duration: 3000,
        position: 'top-center'
      });
    //   setError(`Failed to update student status: ${err.message}`);
    }
  };


  if (loading) return <p className='flex items-center justify-center h-[30vh]'>Loading...</p>;
  if (error) return <p className='flex items-center justify-center h-[30vh]'>{error}</p>;

  return (
    <main>
      <div>
        <h2 className="text-2xl font-bold mb-4">Approve Supervisors</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                {/* <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th> */}
                {/* <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">University</th> */}
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Course</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Approval Status</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white">
                {/* if there is no supervisor */}
              {!supervisors && (
                <tr>
                  <td colSpan={5}  className="px-4 py-2 text-center">
                    No pending supervisors
                  </td>
                </tr>
              )}

              {supervisors?.map((supervisor) => (
                <tr key={supervisor.id}>
                  <td className="px-4 py-2 whitespace-nowrap">{supervisor.supervisor_name}</td>
                  {/* <td className="px-4 py-2 whitespace-nowrap">{supervisor.email}</td> */}
                  {/* <td className="px-4 py-2 whitespace-nowrap">{supervisor.university_id}</td> */}
                  <td className="px-4 py-2 whitespace-nowrap">{supervisor.course_name}</td>
                  <td className="px-4 py-2 whitespace-nowrap">{supervisor.approval_status}</td>
                  <td className="px-4 py-2 whitespace-nowrap">
                    <button
                      className="bg-green-500 text-white px-2 py-1 rounded mr-2"
                      onClick={() => handleStatusUpdate(supervisor.id, 'approved')}
                    >
                      Approve
                    </button>
                    <button
                      className="bg-red-500 text-white px-2 py-1 rounded"
                      onClick={() => handleStatusUpdate(supervisor.id, 'rejected')}
                    >
                      Reject
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <Toaster />
    </main>
  );
}

export default AproveSupervisor;
