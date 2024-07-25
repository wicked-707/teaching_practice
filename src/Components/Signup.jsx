import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Signup = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [universities, setUniversities] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    id_number: '',
    email: '',
    phone_number: '',
    university_id: '',
    graduation_date: '',
    primary_teaching_subject: '',
    secondary_teaching_subject: '',
    kenya_county: '',
    hashed_password: '',
    confirm_pass: ''
  });
  const [formErrors, setFormErrors] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Fetch universities and subjects
    

const fetchUniversities = async () => {
  setIsLoading(true);
  try {
    // console.log('Fetching universities...');
    const response = await axios.get('/api/universities');
    // console.log('Raw universities data:', response.data);
    const data = Array.isArray(response.data) ? response.data : [];
    // console.log('Processed universities data:', data);
    setUniversities(data);
  } catch (error) {
    // console.error('Error fetching universities:', error);
    setUniversities([]);
  } finally {
    setIsLoading(false);
  }
};

    const fetchSubjects = async () => {
  try {
    const response = await axios.get('/api/courses', {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });
    // console.log('Subjects data:', response.data);
    setSubjects(Array.isArray(response.data) ? response.data : []);
  } catch (error) {
    // console.error('Error fetching subjects:', error);
    console.log('Error response:', error.response);
  }
};

    // const fetchSubjects = async () => {
    //   try {
    //     const response = await axios.get('/courses');
    //     setSubjects(Array.isArray(response.data) ? response.data : []); // Assuming response.data is an array of courses
    //   } catch (error) {
    //     console.error('Error fetching subjects:', error);
    //   }
    // };

    fetchUniversities();
    // console.log('Universities state:', universities);
    fetchSubjects();
  }, [universities]);

  const validateStep = () => {
    const errors = {};
    if (currentStep === 1) {
      if (!formData.first_name) errors.first_name = 'First name is required';
      if (!formData.last_name) errors.last_name = 'Last name is required';
      if (!formData.id_number) errors.id_number = 'ID number is required';
      if (!/^\d{8}$/.test(formData.id_number)) errors.id_number = 'ID number must be 8 digits';
    } else if (currentStep === 2) {
      if (!formData.email) errors.email = 'Email is required';
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) errors.email = 'Invalid email address';
      if (!formData.phone_number) errors.phone_number = 'Phone number is required';
      if (!/^\+254\d{9}$/.test(formData.phone_number)) errors.phone_number = 'Phone number must be in the format +254700123456';
      if (!formData.university_id) errors.university_id = 'University is required';
      if (!formData.graduation_date) errors.graduation_date = 'Graduation date is required';
    } else if (currentStep === 3) {
      if (!formData.primary_teaching_subject) errors.primary_teaching_subject = 'Primary teaching subject is required';
      if (!formData.secondary_teaching_subject) errors.secondary_teaching_subject = 'Secondary teaching subject is required';
      if (!formData.kenya_county) errors.kenya_county = 'Kenya county is required';
      if (!formData.hashed_password) errors.hashed_password = 'Password is required';
      if (formData.hashed_password.length < 8) errors.hashed_password = 'Password must be at least 8 characters';
      if (formData.hashed_password !== formData.confirm_pass) errors.confirm_pass = 'Passwords do not match';
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleNext = () => {
    if (validateStep()) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    setCurrentStep(currentStep - 1);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (validateStep()) {
      // Submit the form
      try {
        await axios.post('/api/student', formData);
        alert('Student registered successfully');
      } catch (error) {
        console.error('There was an error registering the student:', error);
      }
    }
  };

  const handleChange = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div>
            <h2>Step 1: Personal Information</h2>
            <div>
              <label>First Name</label>
              <input type="text" name="first_name" value={formData.first_name} onChange={handleChange} />
              {formErrors.first_name && <p>{formErrors.first_name}</p>}
            </div>
            <div>
              <label>Last Name</label>
              <input type="text" name="last_name" value={formData.last_name} onChange={handleChange} />
              {formErrors.last_name && <p>{formErrors.last_name}</p>}
            </div>
            <div>
              <label>ID Number</label>
              <input type="text" name="id_number" value={formData.id_number} onChange={handleChange} />
              {formErrors.id_number && <p>{formErrors.id_number}</p>}
            </div>
          </div>
        );
      case 2:
        return (
          <div>
            <h2>Step 2: Contact Information</h2>
            <div>
              <label>Email</label>
              <input type="email" name="email" value={formData.email} onChange={handleChange} />
              {formErrors.email && <p>{formErrors.email}</p>}
            </div>
            <div>
              <label>Phone Number</label>
              <input type="text" name="phone_number" value={formData.phone_number} onChange={handleChange} />
              {formErrors.phone_number && <p>{formErrors.phone_number}</p>}
            </div>
            <div>
              <label>University</label>
              
                <select 
                  name="university_id" 
                  value={formData.university_id} 
                  onChange={(e) => {
                    const selectedUniversity = universities.find(u => u.university_id.toString() === e.target.value);
                    setFormData({
                      ...formData,
                      university_id: selectedUniversity ? selectedUniversity.university_id : '',
                      university_name: selectedUniversity ? selectedUniversity.university_name : ''
                    });
                  }}
                >
                  <option value="">Select University</option>
                  {universities.map((university) => (
                    <option key={university.university_id} value={university.university_id.toString()}>
                      {university.university_name}
                    </option>
                  ))}
                </select>
             
              {formErrors.university_id && <p>{formErrors.university_id}</p>}
            </div>
            <div>
              <label>Graduation Date</label>
              <input type="date" name="graduation_date" value={formData.graduation_date} onChange={handleChange} />
              {formErrors.graduation_date && <p>{formErrors.graduation_date}</p>}
            </div>
          </div>
        );
      case 3:
        return (
          <div>
            <h2>Step 3: Teaching Information</h2>
            <div>
  <label>Primary Teaching Subject</label>
  <select 
    name="primary_teaching_subject" 
    value={formData.primary_teaching_subject} 
    onChange={(e) => {
      const selectedSubject = subjects.find(s => s.course_id.toString() === e.target.value);
      setFormData({
        ...formData,
        primary_teaching_subject: selectedSubject ? selectedSubject.course_id : '',
        primary_teaching_subject_name: selectedSubject ? selectedSubject.course_name : ''
      });
    }}
  >
    <option value="">Select Subject</option>
    {subjects.map((subject) => (
      <option key={subject.course_id} value={subject.course_id.toString()}>
        {subject.course_name}
      </option>
    ))}
  </select>
  {formErrors.primary_teaching_subject && <p>{formErrors.primary_teaching_subject}</p>}
</div>
<div>
  <label>Secondary Teaching Subject</label>
  <select 
    name="secondary_teaching_subject" 
    value={formData.secondary_teaching_subject} 
    onChange={(e) => {
      const selectedSubject = subjects.find(s => s.course_id.toString() === e.target.value);
      setFormData({
        ...formData,
        secondary_teaching_subject: selectedSubject ? selectedSubject.course_id : '',
        secondary_teaching_subject_name: selectedSubject ? selectedSubject.course_name : ''
      });
    }}
  >
    <option value="">Select Subject</option>
    {subjects.map((subject) => (
      <option key={subject.course_id} value={subject.course_id.toString()}>
        {subject.course_name}
      </option>
    ))}
  </select>
  {formErrors.secondary_teaching_subject && <p>{formErrors.secondary_teaching_subject}</p>}
</div>
            <div>
              <label>Kenya County</label>
              <input type="text" name="kenya_county" value={formData.kenya_county} onChange={handleChange} />
              {formErrors.kenya_county && <p>{formErrors.kenya_county}</p>}
            </div>
            <div>
              <label>Password</label>
              <input type="password" name="hashed_password" value={formData.hashed_password} onChange={handleChange} />
              {formErrors.hashed_password && <p>{formErrors.hashed_password}</p>}
            </div>
            <div>
              <label>Confirm Password</label>
              <input type="password" name="confirm_pass" value={formData.confirm_pass} onChange={handleChange} />
              {formErrors.confirm_pass && <p>{formErrors.confirm_pass}</p>}
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {renderStep()}
      <div>
        {currentStep > 1 && <button type="button" onClick={handleBack}>Back</button>}
        {currentStep < 3 ? <button type="button" onClick={handleNext}>Next</button> : <button type="submit">Submit</button>}
      </div>
    </form>
  );
};

export default Signup;
