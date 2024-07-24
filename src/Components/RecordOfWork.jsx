// src/components/RecordOfWork.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const RecordOfWork = () => {
  const [studentDetails, setStudentDetails] = useState({ name: '', studentNumber: '' });
  const [subjects, setSubjects] = useState([
    {
      name: '',
      formGrade: '',
      topic: '',
      year: '',
      term: '',
      records: [
        { date: '', description: '', remarks: '' },
      ],
    },
  ]);

  // Fetch student details from token
  useEffect(() => {
    const fetchStudentDetails = async () => {
      try {
        const response = await axios.get('/api/student-details', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        setStudentDetails(response.data);
      } catch (error) {
        console.error('Error fetching student details:', error);
      }
    };
    fetchStudentDetails();
  }, []);

  const addSubject = () => {
    setSubjects([...subjects, { name: '', formGrade: '', topic: '', year: '', term: '', records: [{ date: '', description: '', remarks: '' }] }]);
  };

  const addRecord = (subjectIndex) => {
    const updatedSubjects = [...subjects];
    updatedSubjects[subjectIndex].records.push({ date: '', description: '', remarks: '' });
    setSubjects(updatedSubjects);
  };

  const handleChange = (e, subjectIndex, recordIndex = null, field) => {
    const { name, value } = e.target;
    const updatedSubjects = [...subjects];
    if (recordIndex !== null) {
      updatedSubjects[subjectIndex].records[recordIndex][field] = value;
    } else {
      updatedSubjects[subjectIndex][name] = value;
    }
    setSubjects(updatedSubjects);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const recordOfWorkData = { studentDetails, subjects };
    try {
      await axios.post('/api/submit-record-of-work', recordOfWorkData, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      alert('Record of Work submitted successfully!');
    } catch (error) {
      console.error('Error submitting record of work:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Student Details</h2>
      <div>
        <label>Name: {studentDetails.name}</label>
      </div>
      <div>
        <label>Student Number: {studentDetails.studentNumber}</label>
      </div>

      <h2>Record of Work</h2>
      {subjects.map((subject, subjectIndex) => (
        <div key={subjectIndex}>
          <h3>Subject</h3>
          <div>
            <label>Subject Name: </label>
            <input type="text" value={subject.name} onChange={(e) => handleChange(e, subjectIndex, null, 'name')} required />
          </div>
          <div>
            <label>Form/Grade: </label>
            <input type="text" value={subject.formGrade} onChange={(e) => handleChange(e, subjectIndex, null, 'formGrade')} required />
          </div>
          <div>
            <label>Topic: </label>
            <input type="text" value={subject.topic} onChange={(e) => handleChange(e, subjectIndex, null, 'topic')} required />
          </div>
          <div>
            <label>Year: </label>
            <input type="text" value={subject.year} onChange={(e) => handleChange(e, subjectIndex, null, 'year')} required />
          </div>
          <div>
            <label>Term: </label>
            <input type="text" value={subject.term} onChange={(e) => handleChange(e, subjectIndex, null, 'term')} required />
          </div>
          {subject.records.map((record, recordIndex) => (
            <div key={recordIndex}>
              <h4>Record</h4>
              <div>
                <label>Date: </label>
                <input type="date" value={record.date} onChange={(e) => handleChange(e, subjectIndex, recordIndex, 'date')} required />
              </div>
              <div>
                <label>Brief Description of Work Covered: </label>
                <input type="text" value={record.description} onChange={(e) => handleChange(e, subjectIndex, recordIndex, 'description')} required />
              </div>
              <div>
                <label>Remarks: </label>
                <input type="text" value={record.remarks} onChange={(e) => handleChange(e, subjectIndex, recordIndex, 'remarks')} required />
              </div>
            </div>
          ))}
          <button type="button" onClick={() => addRecord(subjectIndex)}>Add Record</button>
          <hr />
        </div>
      ))}
      <button type="button" onClick={addSubject}>Add Subject</button>
      <button type="submit">Submit Record of Work</button>
    </form>
  );
};

export default RecordOfWork;
