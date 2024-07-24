import React, { useState } from 'react';
import axios from 'axios';

const LessonObservationReport = () => {
  const [step, setStep] = useState(1);
  const [report, setReport] = useState({
    lessonPreparation: Array(10).fill(''), // 10 criteria
    lessonIntroduction: Array(5).fill(''), // 5 criteria
    teachingStrategy: Array(6).fill(''),   // 6 criteria
    instructionalProcedure: Array(4).fill(''), // 4 criteria
    teachingLearningResources: Array(5).fill(''), // 5 criteria
    lessonConclusion: Array(5).fill(''), // 5 criteria
    personality: Array(5).fill(''), // 5 criteria
    remarks: Array(7).fill(''), // Remarks for each section
  });

  const handleChange = (e, section, index) => {
    const { value } = e.target;
    setReport(prevState => {
      const updatedSection = [...prevState[section]];
      updatedSection[index] = value;
      return { ...prevState, [section]: updatedSection };
    });
  };

  const handleRemarksChange = (e, index) => {
    const { value } = e.target;
    setReport(prevState => {
      const updatedRemarks = [...prevState.remarks];
      updatedRemarks[index] = value;
      return { ...prevState, remarks: updatedRemarks };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/submit-lesson-observation-report', report, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      alert('Lesson Observation Report submitted successfully!');
    } catch (error) {
      console.error('Error submitting lesson observation report:', error);
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h2 className="text-xl font-semibold mb-2">Lesson Preparation (20 marks)</h2>
              {['Schemes of work', 'Record of work', 'Lesson plan', 'Lesson objectives', 'Lesson sequencing', 'Learning Activities', 'Learning Resources', 'Student Progress record', 'Self evaluation', 'T.P. file organization'].map((item, index) => (
                <div key={index} className="mb-4">
                  <input
                    type="number"
                    max="2"
                    value={report.lessonPreparation[index]}
                    onChange={(e) => handleChange(e, 'lessonPreparation', index)}
                    required
                    className="w-full border p-2 rounded-md"
                    placeholder={`${item} (2 marks)`}
                  />
                </div>
              ))}
            </div>
            <div>
              <textarea
                value={report.remarks[0]}
                onChange={(e) => handleRemarksChange(e, 0)}
                className="w-full h-full border p-2 rounded-md"
                placeholder="Remarks"
              />
            </div>
            <div>
              <h2 className="text-xl font-semibold mb-2">Lesson Introduction (10 marks)</h2>
              {['Arousing learners interest', 'Connection with learners', 'Statement of topic', 'Set induction', 'Articulate lessons objectives'].map((item, index) => (
                <div key={index} className="mb-4">
                  <input
                    type="number"
                    max="2"
                    value={report.lessonIntroduction[index]}
                    onChange={(e) => handleChange(e, 'lessonIntroduction', index)}
                    required
                    className="w-full border p-2 rounded-md"
                    placeholder={`${item} (2 marks)`}
                  />
                </div>
              ))}
            </div>
            <div>
              <textarea
                value={report.remarks[1]}
                onChange={(e) => handleRemarksChange(e, 1)}
                className="w-full h-full border p-2 rounded-md"
                placeholder="Remarks"
              />
            </div>
          </div>
        );
      case 2:
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h2 className="text-xl font-semibold mb-2">Teaching Strategy (24 marks)</h2>
              {['Selection of content', 'Sequencing of activities', 'Use of reinforcement', 'Mastery of content', 'Class management', 'Appropriateness of language use'].map((item, index) => (
                <div key={index} className="mb-4">
                  <input
                    type="number"
                    max="4"
                    value={report.teachingStrategy[index]}
                    onChange={(e) => handleChange(e, 'teachingStrategy', index)}
                    required
                    className="w-full border p-2 rounded-md"
                    placeholder={`${item} (4 marks)`}
                  />
                </div>
              ))}
            </div>
            <div>
              <textarea
                value={report.remarks[2]}
                onChange={(e) => handleRemarksChange(e, 2)}
                className="w-full h-full border p-2 rounded-md"
                placeholder="Remarks"
              />
            </div>
            <div>
              <h2 className="text-xl font-semibold mb-2">Instructional Procedure (16 marks)</h2>
              {['Appropriateness of methods used', 'Learners Involvement', 'Formative checks', 'Pace of delivery'].map((item, index) => (
                <div key={index} className="mb-4">
                  <input
                    type="number"
                    max="4"
                    value={report.instructionalProcedure[index]}
                    onChange={(e) => handleChange(e, 'instructionalProcedure', index)}
                    required
                    className="w-full border p-2 rounded-md"
                    placeholder={`${item} (4 marks)`}
                  />
                </div>
              ))}
            </div>
            <div>
              <textarea
                value={report.remarks[3]}
                onChange={(e) => handleRemarksChange(e, 3)}
                className="w-full h-full border p-2 rounded-md"
                placeholder="Remarks"
              />
            </div>
          </div>
        );
      case 3:
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h2 className="text-xl font-semibold mb-2">Teaching/Learning Resources (10 marks)</h2>
              {['Creativity in choice of resources', 'Effective use of resources', 'Presentation', 'Relevance of resources', 'Chalk wall use and organization'].map((item, index) => (
                <div key={index} className="mb-4">
                  <input
                    type="number"
                    max="2"
                    value={report.teachingLearningResources[index]}
                    onChange={(e) => handleChange(e, 'teachingLearningResources', index)}
                    required
                    className="w-full border p-2 rounded-md"
                    placeholder={`${item} (2 marks)`}
                  />
                </div>
              ))}
            </div>
            <div>
              <textarea
                value={report.remarks[4]}
                onChange={(e) => handleRemarksChange(e, 4)}
                className="w-full h-full border p-2 rounded-md"
                placeholder="Remarks"
              />
            </div>
            <div>
              <h2 className="text-xl font-semibold mb-2">Lesson Conclusion (10 marks)</h2>
              {['Lesson review', 'Assignments', 'Appropriateness in lesson choice', 'Achievement of Objectives', 'Creativeness in presentation'].map((item, index) => (
                <div key={index} className="mb-4">
                  <input
                    type="number"
                    max="2"
                    value={report.lessonConclusion[index]}
                    onChange={(e) => handleChange(e, 'lessonConclusion', index)}
                    required
                    className="w-full border p-2 rounded-md"
                    placeholder={`${item} (2 marks)`}
                  />
                </div>
              ))}
            </div>
            <div>
              <textarea
                value={report.remarks[5]}
                onChange={(e) => handleRemarksChange(e, 5)}
                className="w-full h-full border p-2 rounded-md"
                placeholder="Remarks"
              />
            </div>
          </div>
        );
      case 4:
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h2 className="text-xl font-semibold mb-2">Personality (10 marks)</h2>
              {['Command of Language', 'Confidence', 'Attitude contact', 'Attire', 'Connection with student'].map((item, index) => (
                <div key={index} className="mb-4">
                  <input
                    type="number"
                    max="2"
                    value={report.personality[index]}
                    onChange={(e) => handleChange(e, 'personality', index)}
                    required
                    className="w-full border p-2 rounded-md"
                    placeholder={`${item} (2 marks)`}
                  />
                </div>
              ))}
            </div>
            <div>
              <textarea
                value={report.remarks[6]}
                onChange={(e) => handleRemarksChange(e, 6)}
                className="w-full h-full border p-2 rounded-md"
                placeholder="Remarks"
              />
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <form onSubmit={handleSubmit} className="space-y-4">
        {renderStep()}
        <div className="flex justify-between">
          <button
            type="button"
            onClick={() => setStep(step - 1)}
            disabled={step === 1}
            className="bg-gray-500 text-white px-4 py-2 rounded-md disabled:opacity-50"
          >
            Previous
          </button>
          <button
            type="button"
            onClick={() => setStep(step + 1)}
            disabled={step === 4}
            className="bg-blue-500 text-white px-4 py-2 rounded-md disabled:opacity-50"
          >
            Next
          </button>
        </div>
        {step === 4 && (
          <button
            type="submit"
            className="w-full bg-green-500 text-white px-4 py-2 rounded-md"
          >
            Submit
          </button>
        )}
      </form>
    </div>
  );
};

export default LessonObservationReport;

// // src/components/LessonObservationReport.jsx
// import React, { useState } from 'react';
// import axios from 'axios';

// const LessonObservationReport = () => {
//   const [step, setStep] = useState(1);
//   const [report, setReport] = useState({
//     lessonPreparation: Array(10).fill(''), // 10 criteria
//     lessonIntroduction: Array(5).fill(''), // 5 criteria
//     teachingStrategy: Array(6).fill(''),   // 6 criteria
//     instructionalProcedure: Array(4).fill(''), // 4 criteria
//     teachingLearningResources: Array(5).fill(''), // 5 criteria
//     lessonConclusion: Array(5).fill(''), // 5 criteria
//     personality: Array(5).fill(''), // 5 criteria
//     remarks: Array(7).fill(''), // Remarks for each section
//   });

//   const handleChange = (e, section, index) => {
//     const { value } = e.target;
//     setReport(prevState => {
//       const updatedSection = [...prevState[section]];
//       updatedSection[index] = value;
//       return { ...prevState, [section]: updatedSection };
//     });
//   };

//   const handleRemarksChange = (e, index) => {
//     const { value } = e.target;
//     setReport(prevState => {
//       const updatedRemarks = [...prevState.remarks];
//       updatedRemarks[index] = value;
//       return { ...prevState, remarks: updatedRemarks };
//     });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       await axios.post('/api/submit-lesson-observation-report', report, {
//         headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
//       });
//       alert('Lesson Observation Report submitted successfully!');
//     } catch (error) {
//       console.error('Error submitting lesson observation report:', error);
//     }
//   };

//   const renderStep = () => {
//     switch (step) {
//       case 1:
//         return (
//           <div>
//             <h2>Lesson Preparation (20 marks)</h2>
//             {['Schemes of work', 'Record of work', 'Lesson plan', 'Lesson objectives', 'Lesson sequencing', 'Learning Activities', 'Learning Resources', 'Student Progress record', 'Self evaluation', 'T.P. file organization'].map((item, index) => (
//               <div key={index}>
//                 <label>{item} (2 marks):</label>
//                 <input
//                   type="number"
//                   max="2"
//                   value={report.lessonPreparation[index]}
//                   onChange={(e) => handleChange(e, 'lessonPreparation', index)}
//                   required
//                   className="ml-2 border p-1"
//                 />
//               </div>
//             ))}
//             <div>
//               <label>Remarks:</label>
//               <textarea
//                 value={report.remarks[0]}
//                 onChange={(e) => handleRemarksChange(e, 0)}
//                 className="w-full border p-2"
//               />
//             </div>
//             <h2>Lesson Introduction (10 marks)</h2>
//             {['Arousing learners interest', 'Connection with learners', 'Statement of topic', 'Set induction', 'Articulate lessons objectives'].map((item, index) => (
//               <div key={index}>
//                 <label>{item} (2 marks):</label>
//                 <input
//                   type="number"
//                   max="2"
//                   value={report.lessonIntroduction[index]}
//                   onChange={(e) => handleChange(e, 'lessonIntroduction', index)}
//                   required
//                   className="ml-2 border p-1"
//                 />
//               </div>
//             ))}
//             <div>
//               <label>Remarks:</label>
//               <textarea
//                 value={report.remarks[1]}
//                 onChange={(e) => handleRemarksChange(e, 1)}
//                 className="w-full border p-2"
//               />
//             </div>
//           </div>
//         );
//       case 2:
//         return (
//           <div>
//             <h2>Teaching Strategy (24 marks)</h2>
//             {['Selection of content', 'Sequencing of activities', 'Use of reinforcement', 'Mastery of content', 'Class management', 'Appropriateness of language use'].map((item, index) => (
//               <div key={index}>
//                 <label>{item} (4 marks):</label>
//                 <input
//                   type="number"
//                   max="4"
//                   value={report.teachingStrategy[index]}
//                   onChange={(e) => handleChange(e, 'teachingStrategy', index)}
//                   required
//                   className="ml-2 border p-1"
//                 />
//               </div>
//             ))}
//             <div>
//               <label>Remarks:</label>
//               <textarea
//                 value={report.remarks[2]}
//                 onChange={(e) => handleRemarksChange(e, 2)}
//                 className="w-full border p-2"
//               />
//             </div>
//             <h2>Instructional Procedure (16 marks)</h2>
//             {['Appropriateness of methods used', 'Learners Involvement', 'Formative checks', 'Pace of delivery'].map((item, index) => (
//               <div key={index}>
//                 <label>{item} (4 marks):</label>
//                 <input
//                   type="number"
//                   max="4"
//                   value={report.instructionalProcedure[index]}
//                   onChange={(e) => handleChange(e, 'instructionalProcedure', index)}
//                   required
//                   className="ml-2 border p-1"
//                 />
//               </div>
//             ))}
//             <div>
//               <label>Remarks:</label>
//               <textarea
//                 value={report.remarks[3]}
//                 onChange={(e) => handleRemarksChange(e, 3)}
//                 className="w-full border p-2"
//               />
//             </div>
//           </div>
//         );
//       case 3:
//         return (
//           <div>
//             <h2>Teaching/Learning Resources (10 marks)</h2>
//             {['Creativity in choice of resources', 'Effective use of resources', 'Presentation', 'Relevance of resources', 'Chalk wall use and organization'].map((item, index) => (
//               <div key={index}>
//                 <label>{item} (2 marks):</label>
//                 <input
//                   type="number"
//                   max="2"
//                   value={report.teachingLearningResources[index]}
//                   onChange={(e) => handleChange(e, 'teachingLearningResources', index)}
//                   required
//                   className="ml-2 border p-1"
//                 />
//               </div>
//             ))}
//             <div>
//               <label>Remarks:</label>
//               <textarea
//                 value={report.remarks[4]}
//                 onChange={(e) => handleRemarksChange(e, 4)}
//                 className="w-full border p-2"
//               />
//             </div>
//             <h2>Lesson Conclusion (10 marks)</h2>
//             {['Lesson review', 'Assignments', 'Appropriateness in lesson choice', 'Achievement of Objectives', 'Creativeness in presentation'].map((item, index) => (
//               <div key={index}>
//                 <label>{item} (2 marks):</label>
//                 <input
//                   type="number"
//                   max="2"
//                   value={report.lessonConclusion[index]}
//                   onChange={(e) => handleChange(e, 'lessonConclusion', index)}
//                   required
//                   className="ml-2 border p-1"
//                 />
//               </div>
//             ))}
//             <div>
//               <label>Remarks:</label>
//               <textarea
//                 value={report.remarks[5]}
//                 onChange={(e) => handleRemarksChange(e, 5)}
//                 className="w-full border p-2"
//               />
//             </div>
//           </div>
//         );
//       case 4:
//         return (
//           <div>
//             <h2>Personality (10 marks)</h2>
//             {['Command of Language', 'Confidence', 'Attitude contact', 'Attire', 'Connection with student'].map((item, index) => (
//               <div key={index}>
//                 <label>{item} (2 marks):</label>
//                 <input
//                   type="number"
//                   max="2"
//                   value={report.personality[index]}
//                   onChange={(e) => handleChange(e, 'personality', index)}
//                   required
//                   className="ml-2 border p-1"
//                 />
//               </div>
//             ))}
//             <div>
//               <label>Remarks:</label>
//               <textarea
//                 value={report.remarks[6]}
//                 onChange={(e) => handleRemarksChange(e, 6)}
//                 className="w-full border p-2"
//               />
//             </div>
//           </div>
//         );
//       default:
//         return <p>Unknown step</p>;
//     }
//   };

//   return (
//     <form onSubmit={handleSubmit} className="p-6">
//       <h1 className="text-2xl font-bold mb-4">Lesson Observation Report</h1>
//       {renderStep()}
//       <div className="mt-4">
//         {step > 1 && (
//           <button
//             type="button"
//             onClick={() => setStep(step - 1)}
//             className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded mr-2"
//           >
//             Previous
//           </button>
//         )}
//         {step < 4 ? (
//           <button
//             type="button"
//             onClick={() => setStep(step + 1)}
//             className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
//           >
//             Next
//           </button>
//         ) : (
//           <button
//             type="submit"
//             className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
//           >
//             Submit
//           </button>
//         )}
//       </div>
//     </form>
//   );
// };

// export default LessonObservationReport;
