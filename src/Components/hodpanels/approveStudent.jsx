import axios from 'axios';
import React, { useEffect, useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';

function ApproveStudent() {
  const [pendingStudents, setPendingStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPendingStudents = async () => {
        try {
          const response = await axios.get('/api/students/pending');
          setPendingStudents(response.data.students);
          console.log(pendingStudents);
          setLoading(false);
        } catch (err) {
          setError('Failed to fetch pending students');
          setLoading(false);
        }
      };

      fetchPendingStudents();
  }, []);


  const handleStatusUpdate = async (registrationId, status) => {
    console.log(registrationId, status);
    try {
      
      const response = await fetch(`http://localhost:5000/students/updateStatus/${registrationId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ approval_status: status }),
      });
      
      console.log('Update response:', response.data);
  
      if (response.ok) {
        toast.success('Student status updated successfully', {
          duration: 3000,
          position: 'top-center'
        });
        setPendingStudents(pendingStudents.filter(student => student.registration_id !== registrationId));
      } else {
        throw new Error('Failed to update student status');
        // setError('Unexpected response from server');
      }
    } catch (err) {
      console.error('Error updating student status:', err);
      toast.error('Failed to update student status',{
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
     <div className="pending-students p-4">
          <h2 className="text-xl font-bold mb-4">Pending Students</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">ID Number</th>
                  {/* <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Email</th> */}
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Phone</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Graduation Year</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Subjects</th>
                  {/* <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">County</th> */}
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Registration Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {!pendingStudents && (
                  <tr>
                    <td colSpan="8" className="px-6 py-4 whitespace-nowrap text-center">No pending students found</td>
                  </tr>
                )}
                {/* Map through the pending students and display them */}
                {pendingStudents?.map((student) => (
                  <tr key={student.registration_id}>
                    <td className="px-6 py-4 whitespace-nowrap">{`${student.first_name} ${student.last_name}`}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{student.id_number}</td>
                    {/* <td className="px-6 py-4 whitespace-nowrap">{student.email}</td> */}
                    <td className="px-6 py-4 whitespace-nowrap">{student.phone_number}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{new Date(student.graduation_date).toLocaleDateString()}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{student.primary_teaching_subject} & {student.secondary_teaching_subject}</td>
                    {/* <td className="px-6 py-4 whitespace-nowrap">{student.kenya_county}</td> */}
                    <td className="px-6 py-4 whitespace-nowrap">{new Date(student.created_at).toLocaleDateString()}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleStatusUpdate(student.registration_id, 'verified')}
                          className="bg-green-500 text-white px-2 py-1 rounded"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleStatusUpdate(student.registration_id, 'rejected')}
                          className="bg-red-500 text-white px-2 py-1 rounded"
                        >
                          Reject
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Toaster/>
        </div>
    </main>
  );
}

export default ApproveStudent;
