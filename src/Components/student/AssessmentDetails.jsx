// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import { Link, useParams } from 'react-router-dom';

// const StudentSchemes = () => {
//     const { student_id }= useParams();
//   const [schemesOfWork, setSchemesOfWork] = useState([]);
//   const [studentInfo, setStudentInfo] = useState({});
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const fetchSchemesOfWork = async () => {
//       try {
//         // const response = await axios.get(`http://localhost:5000/schemes_of_work/1`);
//         const response = await axios.get(`http://localhost:5000/schemes_of_work/${student_id}`);
//         setStudentInfo(response.data.student);
//         setSchemesOfWork(response.data.schemes_of_work);
//         setLoading(false);
//       } catch (err) {
//         if (err.response && err.response.status === 404) {
//             setError('This student has not yet submitted any assessments materials');
//           } else {
//             setError('Error fetching data');
//           }
//           setLoading(false);
//         setLoading(false);
//       }
//     };

//     fetchSchemesOfWork();
//   }, [student_id]);

//   if (loading) {
//     return <div className="text-center mt-8">Loading...</div>;
//   }

//   if (error) {
//     return (
//     <div className="text-center mt-8 text-red-500 h-[70vh] flex items-center justify-center">
//        <div>
//        <p>{error}</p>
//         <p className='mt-4'>
//             <Link to="/supervisorportal" className="mt-12 bg-slate-900 text-orange-500 px-6 py-3 rounded-lg hover:bg-slate-800 transition duration-300">
//             Go Back
//       </Link>
//       </p>
//        </div>
//     </div>
//     )
//   }

//   return (
//     <div className="p-4">
//        <h2 className="text-2xl font-bold mb-4">Schemes of Work for {studentInfo.first_name} {studentInfo.last_name}</h2>
//        <p className="text-lg mb-4">Registration ID: {studentInfo.registration_id}</p>
//       {schemesOfWork.length === 0 && <p className='flex min-h-[50vh] justify-center items-center'>No schemes of work found for this student.</p>}

//       {schemesOfWork.map((scheme) => (
//         <div key={scheme.scheme_id} className="bg-gray-100 p-4 mb-4 rounded-lg shadow-lg">
//           <h3 className="text-xl font-semibold mb-2">Week {scheme.week_number}</h3>
//           <div>
//             {scheme.lessons.map((lesson) => (
//               <div key={lesson.lesson_id} className="bg-white p-4 mb-2 rounded-lg shadow">
//                 <h4 className="text-lg font-bold mb-1">Lesson {lesson.lesson_number}</h4>
//                 <p className="mb-1"><strong>Instructional Objectives:</strong> {lesson.instructional_objectives}</p>
//                 <p className="mb-1"><strong>Life Approach:</strong> {lesson.life_approach}</p>
//                 <p className="mb-1"><strong>Teaching Activities:</strong> {lesson.teaching_activities}</p>
//                 <p className="mb-1"><strong>Methods & Strategies:</strong> {lesson.methods_strategies}</p>
//                 <p className="mb-1"><strong>Resources & References:</strong> {lesson.resources_references}</p>
//                 <p className="mb-1"><strong>Assessment:</strong> {lesson.assessment}</p>
//                 <p className="mb-1"><strong>Remarks:</strong> {lesson.remarks}</p>
//               </div>
//             ))}
//           </div>
//         </div>
//       ))}
//     </div>
//   );
// };

// export default StudentSchemes;
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useParams } from 'react-router-dom';
import Grading from '../GradingT';
import StudentLessonPlans from './assessmentLessonPlans';

const GradingInstructions = () => {
  return (
    <div className="container mx-auto p-4">
        <Grading />
    </div>
  );
};

const SchemesofWork = ({ schemesOfWork, studentInfo }) => {
  return (
    <div className="p-4">
      {schemesOfWork.length === 0 && <p className='flex min-h-[50vh] justify-center items-center'>No schemes of work found for this student.</p>}

      {schemesOfWork.map((scheme) => (
        <div key={scheme.scheme_id} className="bg-gray-100 p-4 mb-4 rounded-lg shadow-lg">
          <h3 className="text-xl font-semibold mb-2">Week {scheme.week_number}</h3>
          <div>
            {scheme.lessons.map((lesson) => (
              <div key={lesson.lesson_id} className="bg-white p-4 mb-2 rounded-lg shadow">
                <h4 className="text-lg font-bold mb-1">Lesson {lesson.lesson_number}</h4>
                <p className="mb-1"><strong>Instructional Objectives:</strong> {lesson.instructional_objectives}</p>
                <p className="mb-1"><strong>Life Approach:</strong> {lesson.life_approach}</p>
                <p className="mb-1"><strong>Teaching Activities:</strong> {lesson.teaching_activities}</p>
                <p className="mb-1"><strong>Methods & Strategies:</strong> {lesson.methods_strategies}</p>
                <p className="mb-1"><strong>Resources & References:</strong> {lesson.resources_references}</p>
                <p className="mb-1"><strong>Assessment:</strong> {lesson.assessment}</p>
                <p className="mb-1"><strong>Remarks:</strong> {lesson.remarks}</p>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

// const Lesson_plan = () => {
//   return (
//     <div className="container mx-auto p-4">
//       Lesson Plan
//     </div>
//   );
// };

const StudentAssessmentDashboard = () => {
  const { student_id } = useParams();
  const [schemesOfWork, setSchemesOfWork] = useState([]);
  const [studentInfo, setStudentInfo] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activePanel, setActivePanel] = useState('scheme_of_work');
  const [marks, setMarks]=useState();

  useEffect(() => {
    const fetchSchemesOfWork = async () => {

      try {
        const response = await axios.get(`http://localhost:5000/schemes_of_work/${student_id}`);
        setStudentInfo(response.data.student);
        setSchemesOfWork(response.data.schemes_of_work);
        setLoading(false);
      } catch (err) {
        if (err.response && err.response.status === 404) {
          setError('This student has not yet submitted any assessments materials');
        } else {
          setError('Error fetching data');
        }
        setLoading(false);
      }
    };

    fetchSchemesOfWork();
  }, [student_id]);

  if (loading) {
    return <div className="text-center mt-8">Loading...</div>;
  }

  const SubmitGrade = async (student_id) => {
    try {
      const response = await fetch(`http://localhost:5000/grading/assessment-marks/${student_id}`,{
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ marks }),
      });
      setMarks('');
      alert('Marks Sumbmitted Successfully');
      console.log(response.data);
    } catch (err) {
      alert('Failed to submit marks');
      console.error(err);
    }
  };


  return (
    <div className="container mx-auto p-4">
       <h2 className="text-2xl font-bold mb-4 text-center">Assesment Materials</h2>
       <div className='flex gap-3 flex-wrap'>
        <p className="text-lg mb-4"><b>Student Name:</b> {studentInfo.first_name} {studentInfo.last_name}</p>
        <p className="text-lg mb-4"><b>Registration ID:</b> {student_id}</p>
       </div>
       <div >
            <label htmlFor="finalGrade" className='text-lg '>Final Marks</label>
            <input type="number" id="finalGrade" max={100} onChange={(e) => setMarks(e.target.value)} min={1} name="finalGrade" className='border mx-2  border-gray-300 rounded-md px-4 py-2 mb-4' />
            <button
                  className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mt-4"
                  onClick={() => SubmitGrade(student_id)}
                >
                  Submit
                </button>
       </div>

      <div className="flex mb-4">
        <button
          onClick={() => setActivePanel('scheme_of_work')}
          className={`mr-2 px-4 py-2 rounded ${activePanel === 'scheme_of_work' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
        >
          Scheme Of Work
        </button>
        <button
          onClick={() => setActivePanel('lesson_plan')}
          className={`mr-2 px-4 py-2 rounded ${activePanel === 'lesson_plan' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
        >
          Lesson Plan
        </button>
        <button
          onClick={() => setActivePanel('studentGradingInstructions')}
          className={`px-4 py-2 rounded ${activePanel === 'studentGradingInstructions' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
        >
          Student Grading Instructions
        </button>
      </div>

      {activePanel === 'scheme_of_work' && <SchemesofWork schemesOfWork={schemesOfWork} studentInfo={studentInfo} />}
      {activePanel === 'lesson_plan' && <StudentLessonPlans studentId={student_id} />}
      {activePanel === 'studentGradingInstructions' && <GradingInstructions />}
    </div>
  );
};

export default StudentAssessmentDashboard;