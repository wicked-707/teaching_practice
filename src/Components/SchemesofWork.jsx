
// // src/components/AssessmentForm.jsx
// import React, { useState, useEffect } from 'react';
// import axios from 'axios';

// const SchemesofWork = () => {
//   const [studentDetails, setStudentDetails] = useState({ name: '', studentNumber: '' });
//   const [schoolDetails, setSchoolDetails] = useState({ schoolName: '', formGrade: '', primarySubject: '', year: '', term: '' });
//   const [schemesOfWork, setSchemesOfWork] = useState([{ week: 1, lessons: [{ lessonNumber: 1, objectives: '', lifeApproach: '', activities: '', methods: '', resources: '', assessment: '', remarks: '' }] }]);

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

//   const addWeek = () => {
//     setSchemesOfWork([...schemesOfWork, { week: schemesOfWork.length + 1, lessons: [{ lessonNumber: 1, objectives: '', lifeApproach: '', activities: '', methods: '', resources: '', assessment: '', remarks: '' }] }]);
//   };

//   const addLesson = (weekIndex) => {
//     const updatedSchemesOfWork = [...schemesOfWork];
//     updatedSchemesOfWork[weekIndex].lessons.push({ lessonNumber: updatedSchemesOfWork[weekIndex].lessons.length + 1, objectives: '', lifeApproach: '', activities: '', methods: '', resources: '', assessment: '', remarks: '' });
//     setSchemesOfWork(updatedSchemesOfWork);
//   };

//   const handleChange = (e, weekIndex, lessonIndex) => {
//     const { name, value } = e.target;
//     const updatedSchemesOfWork = [...schemesOfWork];
//     updatedSchemesOfWork[weekIndex].lessons[lessonIndex][name] = value;
//     setSchemesOfWork(updatedSchemesOfWork);
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     const assessmentData = { studentDetails, schoolDetails, schemesOfWork };
//     try {
//       await axios.post('/api/submit-assessment', assessmentData, {
//         headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
//       });
//       alert('Assessment submitted successfully!');
//     } catch (error) {
//       console.error('Error submitting assessment:', error);
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

//       <h2>School Details</h2>
//       <div>
//         <label>School Name: </label>
//         <input type="text" value={schoolDetails.schoolName} onChange={(e) => setSchoolDetails({ ...schoolDetails, schoolName: e.target.value })} required />
//       </div>
//       <div>
//         <label>Form/Grade: </label>
//         <input type="text" value={schoolDetails.formGrade} onChange={(e) => setSchoolDetails({ ...schoolDetails, formGrade: e.target.value })} required />
//       </div>
//       <div>
//         <label>Primary Subject: </label>
//         <input type="text" value={schoolDetails.primarySubject} onChange={(e) => setSchoolDetails({ ...schoolDetails, primarySubject: e.target.value })} required />
//       </div>
//       <div>
//         <label>Year: </label>
//         <input type="text" value={schoolDetails.year} onChange={(e) => setSchoolDetails({ ...schoolDetails, year: e.target.value })} required />
//       </div>
//       <div>
//         <label>Term: </label>
//         <input type="text" value={schoolDetails.term} onChange={(e) => setSchoolDetails({ ...schoolDetails, term: e.target.value })} required />
//       </div>

//       <h2>Schemes of Work</h2>
//       {schemesOfWork.map((week, weekIndex) => (
//         <div key={weekIndex}>
//           <h3>Week {week.week}</h3>
//           {week.lessons.map((lesson, lessonIndex) => (
//             <div key={lessonIndex}>
//               <h4>Lesson {lesson.lessonNumber}</h4>
//               <div>
//                 <label>Instructional Objectives/Learning outcomes: </label>
//                 <input type="text" name="objectives" value={lesson.objectives} onChange={(e) => handleChange(e, weekIndex, lessonIndex)} required />
//               </div>
//               <div>
//                 <label>Life Approach: </label>
//                 <input type="text" name="lifeApproach" value={lesson.lifeApproach} onChange={(e) => handleChange(e, weekIndex, lessonIndex)} required />
//               </div>
//               <div>
//                 <label>Teaching activities: </label>
//                 <input type="text" name="activities" value={lesson.activities} onChange={(e) => handleChange(e, weekIndex, lessonIndex)} required />
//               </div>
//               <div>
//                 <label>Methods/strategies: </label>
//                 <input type="text" name="methods" value={lesson.methods} onChange={(e) => handleChange(e, weekIndex, lessonIndex)} required />
//               </div>
//               <div>
//                 <label>Resources/references: </label>
//                 <input type="text" name="resources" value={lesson.resources} onChange={(e) => handleChange(e, weekIndex, lessonIndex)} required />
//               </div>
//               <div>
//                 <label>Assessment: </label>
//                 <input type="text" name="assessment" value={lesson.assessment} onChange={(e) => handleChange(e, weekIndex, lessonIndex)} required />
//               </div>
//               <div>
//                 <label>Remarks: </label>
//                 <input type="text" name="remarks" value={lesson.remarks} onChange={(e) => handleChange(e, weekIndex, lessonIndex)} required />
//               </div>
//             </div>
//           ))}
//           <button type="button" onClick={() => addLesson(weekIndex)}>Add Lesson</button>
//         </div>
//       ))}
//       <button type="button" onClick={addWeek}>Add Week</button>
//       <button type="submit">Submit Assessment</button>
//     </form>
//   );
// };

// export default SchemesofWork;
import React, { useState } from 'react';
import { useEffect } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { getCurrentStudent } from '../Services/AuthService';

const SchemeOfWorkForm = () => {
  const [weekNumber, setWeekNumber] = useState('');
  const [student_id, setStudentId] = useState('');
  const [lessons, setLessons] = useState([
    { instructionalObjectives: '', lifeApproach: '', teachingActivities: '', methodsStrategies: '', resourcesReferences: '', assessment: '', remarks: '' }
  ]);

  const handleLessonChange = (index, event) => {
    const values = [...lessons];
    values[index][event.target.name] = event.target.value;
    setLessons(values);
  };

  const addLesson = () => {
    setLessons([...lessons, { instructionalObjectives: '', lifeApproach: '', teachingActivities: '', methodsStrategies: '', resourcesReferences: '', assessment: '', remarks: '' }]);
  };

  const removeLesson = (index) => {
    const values = [...lessons];
    values.splice(index, 1);
    setLessons(values);
  };

  useEffect(() => {
    const studentToken = getCurrentStudent()
    console.log(studentToken)

    const decodedToken = jwtDecode(studentToken);
    if (!decodedToken) {
      setError('Invalid token format');
      setLoading(false);
      return;
    }
    setStudentId(decodedToken.registration_id);

    
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const payload = {
      student_id: student_id, 
      week_number: weekNumber,
      lessons: lessons.map((lesson, index) => ({
        lesson_number: index + 1,
        instructional_objectives: lesson.instructionalObjectives,
        life_approach: lesson.lifeApproach,
        teaching_activities: lesson.teachingActivities,
        methods_strategies: lesson.methodsStrategies,
        resources_references: lesson.resourcesReferences,
        assessment: lesson.assessment,
        remarks: lesson.remarks,
      }))
    };

    try {
      const response = await axios.post('http://localhost:5000/schemes_of_work', payload);
      alert('Scheme of work submitted successfully!');
      // Reset form after submission
      setWeekNumber('');
      setLessons([{ instructionalObjectives: '', lifeApproach: '', teachingActivities: '', methodsStrategies: '', resourcesReferences: '', assessment: '', remarks: '' }]);
    } catch (error) {
      console.error('There was an error submitting the scheme of work!', error);
      alert('Error submitting the scheme of work');
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-8 bg-white shadow-md rounded">
      <h2 className="text-2xl font-bold mb-6">Submit Scheme of Work</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Week Number:
          </label>
          <input
            type="number"
            value={weekNumber}
            min={1}
            max={12}
            onChange={(e) => setWeekNumber(e.target.value)}
            required
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>

        {lessons.map((lesson, index) => (
          <div key={index} className="mb-6 p-4 border border-gray-200 rounded">
            <h3 className="text-lg font-semibold mb-4">Lesson {index + 1}</h3>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Instructional Objectives:
              </label>
              <input
                type="text"
                name="instructionalObjectives"
                value={lesson.instructionalObjectives}
                onChange={(event) => handleLessonChange(index, event)}
                required
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Life Approach:
              </label>
              <input
                type="text"
                name="lifeApproach"
                value={lesson.lifeApproach}
                onChange={(event) => handleLessonChange(index, event)}
                required
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Teaching Activities:
              </label>
              <input
                type="text"
                name="teachingActivities"
                value={lesson.teachingActivities}
                onChange={(event) => handleLessonChange(index, event)}
                required
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Methods/Strategies:
              </label>
              <input
                type="text"
                name="methodsStrategies"
                value={lesson.methodsStrategies}
                onChange={(event) => handleLessonChange(index, event)}
                required
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Resources/References:
              </label>
              <input
                type="text"
                name="resourcesReferences"
                value={lesson.resourcesReferences}
                onChange={(event) => handleLessonChange(index, event)}
                required
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Assessment:
              </label>
              <input
                type="text"
                name="assessment"
                value={lesson.assessment}
                onChange={(event) => handleLessonChange(index, event)}
                required
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Remarks:
              </label>
              <input
                type="text"
                name="remarks"
                value={lesson.remarks}
                onChange={(event) => handleLessonChange(index, event)}
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>
            <button
              type="button"
              onClick={() => removeLesson(index)}
              className="bg-red-500 text-white p-2 rounded"
            >
              Remove Lesson
            </button>
          </div>
        ))}

        <button
          type="button"
          onClick={addLesson}
          className="bg-blue-500 text-white p-2 rounded mb-6"
        >
          Add Lesson
        </button>
        <button type="submit" className="bg-green-500 text-white p-2 rounded">
          Submit Scheme of Work
        </button>
      </form>
    </div>
  );
};

export default SchemeOfWorkForm;
