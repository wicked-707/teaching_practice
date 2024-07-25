// // src/components/LessonPlan.jsx
// import React, { useState, useEffect } from 'react';
// import axios from 'axios';

// const LessonPlan = () => {
//   const [studentDetails, setStudentDetails] = useState({ name: '', studentNumber: '' });
//   const [subjects, setSubjects] = useState([
//     {
//       name: '',
//       topics: [
//         {
//           name: '',
//           subtopics: [
//             {
//               name: '',
//               date: '',
//               time: '',
//               objectives: {
//                 introduction: { time: '', content: '', teacherActivity: '', learnersActivity: '', resources: '' },
//                 development: { time: '', content: '', teacherActivity: '', learnersActivity: '', resources: '' },
//                 conclusion: { time: '', content: '', teacherActivity: '', learnersActivity: '', resources: '' },
//               },
//             },
//           ],
//         },
//       ],
//     },
//   ]);

//   // Fetch student details from token
//   useEffect(() => {
//     const fetchStudentDetails = async () => {
//       try {
//         const response = await axios.get('/api/student-details', {
//           headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
//         });
//         setStudentDetails(response.data);
//       } catch (error) {
//         console.error('Error fetching student details:', error);
//       }
//     };
//     fetchStudentDetails();
//   }, []);

//   const addSubject = () => {
//     setSubjects([...subjects, { name: '', topics: [{ name: '', subtopics: [newSubtopic()] }] }]);
//   };

//   const addTopic = (subjectIndex) => {
//     const updatedSubjects = [...subjects];
//     updatedSubjects[subjectIndex].topics.push({ name: '', subtopics: [newSubtopic()] });
//     setSubjects(updatedSubjects);
//   };

//   const addSubtopic = (subjectIndex, topicIndex) => {
//     const updatedSubjects = [...subjects];
//     updatedSubjects[subjectIndex].topics[topicIndex].subtopics.push(newSubtopic());
//     setSubjects(updatedSubjects);
//   };

//   const newSubtopic = () => ({
//     name: '',
//     date: '',
//     time: '',
//     objectives: {
//       introduction: { time: '', content: '', teacherActivity: '', learnersActivity: '', resources: '' },
//       development: { time: '', content: '', teacherActivity: '', learnersActivity: '', resources: '' },
//       conclusion: { time: '', content: '', teacherActivity: '', learnersActivity: '', resources: '' },
//     },
//   });

//   const handleChange = (e, subjectIndex, topicIndex, subtopicIndex, group, field) => {
//     const { name, value } = e.target;
//     const updatedSubjects = [...subjects];
//     if (group) {
//       updatedSubjects[subjectIndex].topics[topicIndex].subtopics[subtopicIndex].objectives[group][field] = value;
//     } else {
//       updatedSubjects[subjectIndex].topics[topicIndex].subtopics[subtopicIndex][field] = value;
//     }
//     setSubjects(updatedSubjects);
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     const lessonPlanData = { studentDetails, subjects };
//     try {
//       await axios.post('/api/submit-lesson-plan', lessonPlanData, {
//         headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
//       });
//       alert('Lesson Plan submitted successfully!');
//     } catch (error) {
//       console.error('Error submitting lesson plan:', error);
//     }
//   };

//   return (
//     <form onSubmit={handleSubmit}>
//       <h2>Student Details</h2>
//       <div>
//         <label>Name: {studentDetails.name}</label>
//       </div>
//       <div>
//         <label>Student Number: {studentDetails.studentNumber}</label>
//       </div>

//       <h2>Lesson Plan</h2>
//       {subjects.map((subject, subjectIndex) => (
//         <div key={subjectIndex}>
//           <h3>Subject</h3>
//           <div>
//             <label>Subject Name: </label>
//             <input type="text" value={subject.name} onChange={(e) => handleChange(e, subjectIndex)} name="name" required />
//           </div>
//           {subject.topics.map((topic, topicIndex) => (
//             <div key={topicIndex}>
//               <h4>Topic</h4>
//               <div>
//                 <label>Topic Name: </label>
//                 <input type="text" value={topic.name} onChange={(e) => handleChange(e, subjectIndex, topicIndex)} name="name" required />
//               </div>
//               {topic.subtopics.map((subtopic, subtopicIndex) => (
//                 <div key={subtopicIndex}>
//                   <h5>Subtopic</h5>
//                   <div>
//                     <label>Subtopic Name: </label>
//                     <input type="text" value={subtopic.name} onChange={(e) => handleChange(e, subjectIndex, topicIndex, subtopicIndex)} name="name" required />
//                   </div>
//                   <div>
//                     <label>Date: </label>
//                     <input type="date" value={subtopic.date} onChange={(e) => handleChange(e, subjectIndex, topicIndex, subtopicIndex)} name="date" required />
//                   </div>
//                   <div>
//                     <label>Time: </label>
//                     <input type="time" value={subtopic.time} onChange={(e) => handleChange(e, subjectIndex, topicIndex, subtopicIndex)} name="time" required />
//                   </div>
//                   <h6>Lesson Objectives</h6>
//                   {['introduction', 'development', 'conclusion'].map((group) => (
//                     <div key={group}>
//                       <h7>{group.charAt(0).toUpperCase() + group.slice(1)}</h7>
//                       {['time', 'content', 'teacherActivity', 'learnersActivity', 'resources'].map((field) => (
//                         <div key={field}>
//                           <label>{field.charAt(0).toUpperCase() + field.slice(1)}: </label>
//                           <input type="text" value={subtopic.objectives[group][field]} onChange={(e) => handleChange(e, subjectIndex, topicIndex, subtopicIndex, group, field)} name={field} required />
//                         </div>
//                       ))}
//                     </div>
//                   ))}
//                   <button type="button" onClick={() => addSubtopic(subjectIndex, topicIndex)}>Add Subtopic</button>
//                 </div>
//               ))}
//               <button type="button" onClick={() => addTopic(subjectIndex)}>Add Topic</button>
//             </div>
//           ))}
//           <button type="button" onClick={addSubject}>Add Subject</button>
//         </div>
//       ))}
//       <button type="submit">Submit Lesson Plan</button>
//     </form>
//   );
// };

// export default LessonPlan;

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { getCurrentStudent } from '../Services/AuthService';

const LessonPlanForm = () => {
    const [studentId, setStudentId] = useState('');
    const [formData, setFormData] = useState({
        student_id: studentId,
        subject_name: '',
        topic_name: '',
        subtopic_name: '',
        lesson_date: '',
        lesson_time: '',
        lesson_objectives: ''
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    useEffect(() => {
        const studentToken = getCurrentStudent();
        if (studentToken) {
            try {
                const decodedToken = jwtDecode(studentToken);
                if (decodedToken && decodedToken.registration_id) {
                    setFormData(prevData => ({
                        ...prevData,
                        student_id: decodedToken.registration_id
                    }));
                } else {
                    setError('Invalid token format');
                }
            } catch (error) {
                setError('Error decoding token');
            }
        } else {
            setError('No student token found');
        }
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        console.log(studentId);


        try {
            const response = await axios.post('http://localhost:5000/lesson-plan', formData);

            setSuccess('Lesson plan submitted successfully!');
            setFormData({
                student_id: formData.student_id, 
                subject_name: '',
                topic_name: '',
                subtopic_name: '',
                lesson_date: '',
                lesson_time: '',
                lesson_objectives: ''
            });
            // alert('Lesson plan submitted successfully!');
        } catch (err) {
        //   alert('Failed to submit lesson plan. Please try again.');
            setError('Failed to submit lesson plan. Please try again.');
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-4">Submit Lesson Plan</h2>
            {error && <p className="text-red-500 mb-4">{error}</p>}
            {success && <p className="text-green-500 mb-4">{success}</p>}
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="student_id" className="block text-sm font-medium text-gray-700">Student ID</label>
                        <input
                            type="number"
                            id="student_id"
                            name="student_id"
                            value={studentId}
                            disabled
                            min={1}
                            required
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                    </div>
                    <div>
                        <label htmlFor="subject_name" className="block text-sm font-medium text-gray-700">Subject Name</label>
                        <input
                            type="text"
                            id="subject_name"
                            name="subject_name"
                            value={formData.subject_name}
                            onChange={handleChange}
                            required
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                    </div>
                    <div>
                        <label htmlFor="topic_name" className="block text-sm font-medium text-gray-700">Topic Name</label>
                        <input
                            type="text"
                            id="topic_name"
                            name="topic_name"
                            value={formData.topic_name}
                            onChange={handleChange}
                            required
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                    </div>
                    <div>
                        <label htmlFor="subtopic_name" className="block text-sm font-medium text-gray-700">Subtopic Name</label>
                        <input
                            type="text"
                            id="subtopic_name"
                            name="subtopic_name"
                            value={formData.subtopic_name}
                            onChange={handleChange}
                            required
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                    </div>
                    <div>
                        <label htmlFor="lesson_date" className="block text-sm font-medium text-gray-700">Date</label>
                        <input
                            type="date"
                            id="lesson_date"
                            name="lesson_date"
                            value={formData.lesson_date}
                            onChange={handleChange}
                            required
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                    </div>
                    <div>
                        <label htmlFor="lesson_time" className="block text-sm font-medium text-gray-700">Time</label>
                        <input
                            type="time"
                            id="lesson_time"
                            name="lesson_time"
                            value={formData.lesson_time}
                            onChange={handleChange}
                            required
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                    </div>
                </div>
                <div>
                    <label htmlFor="lesson_objectives" className="block text-sm font-medium text-gray-700">Lesson Objectives</label>
                    <textarea
                        id="lesson_objectives"
                        name="lesson_objectives"
                        value={formData.lesson_objectives}
                        onChange={handleChange}
                        required
                        rows="4"
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    ></textarea>
                </div>
                <div>
                    <button
                        type="submit"
                        className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                        Submit
                    </button>
                </div>
            </form>
        </div>
    );
};

export default LessonPlanForm;

