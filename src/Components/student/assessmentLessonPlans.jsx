import React, { useEffect, useState } from 'react';
import axios from 'axios';

const StudentLessonPlans = ({ studentId }) => {
  const [lessonPlans, setLessonPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLessonPlans = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/lesson-plans/${studentId}`);
        setLessonPlans(response.data.lesson_plans);
        setLoading(false);
      } catch (err) {
        if (err.response && err.response.status === 404) {
          setError('No lesson plans found for this student');
        } else {
          setError('Error fetching data');
        }
        setLoading(false);
      }
    };

    fetchLessonPlans();
  }, [studentId]);

  if (loading) {
    return <div className="text-center mt-8">Loading...</div>;
  }

  if (error) {
    return <div className="text-center mt-8 text-red-500 h-[50vh] flex items-center justify-center">{error}</div>;
  }

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Lesson Plans for Student {studentId}</h2>
      {lessonPlans.length === 0 ? (
        <div className="text-center mt-8">No lesson plans found for this student</div>
      ) : (
        lessonPlans.map((lessonPlan, index) => (
          <div key={index} className="bg-gray-100 p-4 mb-4 rounded-lg shadow-lg">
            <h3 className="text-xl font-semibold mb-2">{lessonPlan.subject_name}</h3>
            <p className="mb-1"><strong>Topic Name:</strong> {lessonPlan.topic_name}</p>
            <p className="mb-1"><strong>Subtopic Name:</strong> {lessonPlan.subtopic_name}</p>
            <p className="mb-1"><strong>Lesson Date:</strong> {lessonPlan.lesson_date}</p>
            <p className="mb-1"><strong>Lesson Time:</strong> {lessonPlan.lesson_time}</p>
            <p className="mb-1"><strong>Lesson Objectives:</strong> {lessonPlan.lesson_objectives}</p>
          </div>
        ))
      )}
    </div>
  );
};

export default StudentLessonPlans;
