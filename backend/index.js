const express = require('express');
// const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const { Pool } = require('pg');
require('dotenv').config();
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

// const DB_USER = 'postgres';
// const DB_PASSWORD = '960X513OV';
// const DB_HOST = 'localhost';
// const DB_PORT = 5432;
// const DB_NAME = 'tp';


const app = express();
const port = 5000;

// Middleware
app.use(express.json());


app.use(cors({
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Access-Control-Allow-Origin']
}));

// const JWT_SECRET = process.env.JWT_SECRET;
const JWT_SECRET = '191cedcb0d23f2334a73f6dfdb9ae36972e3c57b624012ba8d962679334601e46f7e2686bcb4e480fb403961a58c33d740d814540d9cd94814f7712adc650dc4';





// PostgreSQL Pool

const pool = new Pool({
  user: 'postgres',
  password: 'drowssap',
  host: 'localhost',
  port: 5432,
  database: 'tp',
  // JWT_SECRET:'191cedcb0d23f2334a73f6dfdb9ae36972e3c57b624012ba8d962679334601e46f7e2686bcb4e480fb403961a58c33d740d814540d9cd94814f7712adc650dc4',
  ssl: false, // Set to true if your PostgreSQL server requires SSL
  auth: {
    method: 'scram-sha-256' // Adjust based on your PostgreSQL authentication method
  }
});

pool.connect((err, client, release) => {
  if (err) {
    return console.error('Error acquiring client', err.stack);
  }
  console.log('Connected to PostgreSQL database');
  release();
});

// homepage for server
app.get('/', (req, res) => {
  res.send('Welcome to the API');
});



// Fetch all courses
app.get('/courses', async (req, res) => {
  try {
    const allCourses = await pool.query('SELECT * FROM course');
    res.json(allCourses.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Fetch all universities
app.get('/universities', async (req, res) => {
  try {
    const allUniversities = await pool.query('SELECT * FROM university');
    res.json(allUniversities.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});


// -----------------------------------------------------------------------------------

// Student signUp
app.post('/student', async (req, res) => {
  try {
    const {
      first_name, last_name, id_number,email, phone_number,
      university_id, graduation_date,
      primary_teaching_subject, secondary_teaching_subject, kenya_county, hashed_password, confirm_pass
    } = req.body;

    // Check if passwords match
    if (hashed_password !== confirm_pass) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    // Check for existing student
    const existingStudent = await pool.query(
      'SELECT * FROM student WHERE id_number = $1 OR email = $2',
      [id_number, email]
    );

    if (existingStudent.rows.length > 0) {
      return res.status(400).json({ msg: 'Student with this ID number or email already exists' });
    }

    // Hash the password
    // const hashedPass = await bcrypt.hash(hashed_password, 10);

    // Insert into database
    const newStudent = await pool.query(
      `INSERT INTO student (
        first_name, last_name, id_number,  email, phone_number,
        university_id, graduation_date, primary_teaching_subject, secondary_teaching_subject,
        kenya_county, password
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, 
                $8, $9, $10, $11)
       RETURNING *`,
      [
        first_name, last_name, id_number, email, phone_number,
        university_id, graduation_date, primary_teaching_subject, secondary_teaching_subject,
        kenya_county, hashed_password
      ]
    );

    // Return the newly created student record
    res.json(newStudent.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error'); // Handle any unexpected errors
  }
});


//----------------------------------------------------------------------------------

// Route to register a new university
app.post('/register/universities', async (req, res) => {
  const {
    university_name,
    registration_number,
    charter_number,
    official_email,
    website,
    county
  } = req.body;

  try {
    // Validate input
    if (!university_name || !registration_number || !official_email || !county) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Insert data into the university table
    const result = await pool.query(
      `INSERT INTO university (
         university_name, 
         registration_number, 
         charter_number, 
         official_email, 
         website, 
         county
       ) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [university_name, registration_number, charter_number, official_email, website, county]
    );

    // Respond with the newly created university
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// HOD signup route
app.post('/hods/signup', async (req, res) => {
  const { hod_name, email, password, university_id } = req.body;

  // Input validation
  if (!hod_name || !email || !password || !university_id) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    // Check if email already exists
    const emailCheck = await pool.query('SELECT * FROM hods WHERE email = $1', [email]);
    if (emailCheck.rows.length > 0) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    // Insert new HOD into the database
    const newHod = await pool.query(
      'INSERT INTO hods (hod_name, email, password, university_id) VALUES ($1, $2, $3, $4) RETURNING *',
      [hod_name, email, password, university_id]
    );

    res.status(201).json({ message: 'HOD registered successfully', hod: newHod.rows[0] });
  } catch (error) {
    console.error('Error registering HOD:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// HOD signin route
app.post('/hods/signin', async (req, res) => {
  const { email, pass } = req.body;

  // Validate input
  if (!email || !pass) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  try {
    // Check if HOD exists
    const hodResult = await pool.query(
      'SELECT * FROM hods WHERE email = $1',
      [email]
    );

    if (hodResult.rows.length === 0) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    const hod = hodResult.rows[0];

    // Validate password
    const validPassword = await bcrypt.compare(pass, hod.password);
    if (!validPassword) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        id: hod.id,
        email: hod.email,
        university_id: hod.university_id,
        department_id: hod.department_id,
      },
      JWT_SECRET,
      { expiresIn: '1h' }
    );

    // Return success response with token
    res.status(200).json({
      message: 'Signin successful',
      token,
    });
  } catch (error) {
    console.error('Error in HOD signin:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// supervisor signUp route
app.post('/supervisor/signup', async (req, res) => {
  try {
    const { supervisor_name, email, university_id, course_id, password } = req.body;

    // Validate input
    if (!supervisor_name || !email || !university_id || !course_id || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Check if email already exists
    const emailCheck = await pool.query(
      'SELECT * FROM supervisors WHERE email = $1',
      [email]
    );

    if (emailCheck.rows.length > 0) {
      return res.status(400).json({ message: 'Email already in use' });
    }

    // Insert new supervisor into database
    const newSupervisor = await pool.query(
      'INSERT INTO supervisors (supervisor_name, email, university_id, course_id, password) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [supervisor_name, email, university_id, course_id, password]
    );

    // Return success response
    res.status(201).json({
      message: 'Supervisor created successfully',
      supervisor: {
        id: newSupervisor.rows[0].id,
        supervisor_name: newSupervisor.rows[0].supervisor_name,
        email: newSupervisor.rows[0].email,
        university_id: newSupervisor.rows[0].university_id,
        course_id: newSupervisor.rows[0].course_id
      }
    });

  } catch (error) {
    console.error('Error in supervisor signup:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Supervisor signin route
app.post('/supervisor/signin', async (req, res) => {
  const { email, password } = req.body;
  console.log(email, password);

  // Validate input
  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  try {
    // Check if supervisor exists
    const supervisorResult = await pool.query(
      'SELECT * FROM supervisors WHERE email = $1',
      [email]
    );

    if (supervisorResult.rows.length === 0) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    const supervisor = supervisorResult.rows[0];

    // Validate password
    // const validPassword = await bcrypt.compare(password, supervisor.password);

    if (password !== supervisor.password) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        id: supervisor.id,
        name: supervisor.supervisor_name,
        email: supervisor.email,
        university_id: supervisor.university_id,
        course_id: supervisor.course_id,
        approval_status: supervisor.approval_status,
        course: supervisor.course_id,
        role: "supervisor",
      },
      '191cedcb0d23f2334a73f6dfdb9ae36972e3c57b624012ba8d962679334601e46f7e2686bcb4e480fb403961a58c33d740d814540d9cd94814f7712adc650dc4',
      { expiresIn: '1h' }
    );

    // Return success response with token
    res.status(200).json({
      message: 'Signin successful',
      token,
    });
  } catch (error) {
    console.error('Error in supervisor signin:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});



// ALL UNVERIFIED STUDENTS
// Fetch all students with pending status
app.get('/students/pending', async (req, res) => {
  try {
    const query = `
      SELECT 
        registration_id, 
        first_name, 
        last_name, 
        id_number, 
        email, 
        phone_number, 
        university_id, 
        graduation_date, 
        primary_teaching_subject, 
        secondary_teaching_subject, 
        kenya_county, 
        approval_status, 
        approval_date, 
        created_at, 
        updated_at
      FROM 
        student 
      WHERE 
        approval_status = 'pending'
    `;
    
    const result = await pool.query(query);
    console.log(result);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'No pending students found' });
    }
    
    res.json({ students: result.rows });
  } catch (error) {
    console.error('Error fetching pending students:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});



// VERIFY THE STUDENTS
// Update student status and approval date
app.put('/students/:registration_id/status', async (req, res) => {
  const { registration_id } = req.params;
  const { approval_status } = req.body;
  
  // Validate input
  if (!['verified', 'rejected'].includes(approval_status)) {
    return res.status(400).json({ message: 'Invalid approval status. It must be either "verified" or "rejected".' });
  }

  try {
    const query = `
      UPDATE student 
      SET 
        approval_status = $1, 
        approval_date = CURRENT_TIMESTAMP,
        updated_at = CURRENT_TIMESTAMP
      WHERE 
        registration_id = $2
      RETURNING *
    `;

    const result = await pool.query(query, [approval_status, registration_id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Student not found' });
    }

    res.json({ message: 'Student status updated successfully', student: result.rows[0] });
  } catch (error) {
    console.error('Error updating student status:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});



// LOGIN THE STUDENT
// student signin
app.post('/student/signin', async (req, res) => {
    console.log('Received body:', req.body);

  if(req.get('Content-Type') !== 'application/json') {
    return res.status(415).send('Unsupported Media Type');
  }
  try {
    const { email, hashed_password } = req.body;

    // Validate input
    if (!email || !hashed_password) {
      return res.status(400).json({ msg: 'Please provide both email and password' });
    }

    // Check if the student exists
    const result = await pool.query('SELECT * FROM student WHERE email = $1', [email]);
    
    if (result.rows.length === 0) {
      return res.status(400).json({ msg: 'Invalid email or password' });
    }

    const student = result.rows[0];
    console.log(student);

    // Verify password
    // const isValidPassword = await bcrypt.compare(hashed_password, student.hashed_password);
    if (hashed_password !== student.password) {
      return res.status(400).json({ msg: 'Invalid email or passworddd' });
    }

    // // Check for JWT_SECRET
    // if (!process.env.JWT_SECRET) {
    //   throw new Error('JWT_SECRET is not defined in the environment variables');
    // }

    // Generate token
    const token = jwt.sign(
      { 
        registration_id: student.registration_id,
        first_name: student.first_name,
        last_name: student.last_name,
        email: student.email,
        university_name: student.university_id,
        role: "student"
      },
      '191cedcb0d23f2334a73f6dfdb9ae36972e3c57b624012ba8d962679334601e46f7e2686bcb4e480fb403961a58c33d740d814540d9cd94814f7712adc650dc4',
      { expiresIn: '1h' }
    );

    // Send response
    res.json({
      msg: 'Sign in successful',
      token,
      // student
        });

  } catch (error) {
    console.error('Signin errorrrr:', error);
    res.status(500).json({ msg: 'Server error', error: error.message });
  }
});


// -----------------------------------------------------------------------------------











// University signup
app.post('/university', async (req, res) => {
  try {
    const { 
      university_name, registration_number, charter_number,
      official_email, website, county 
    } = req.body;

  

    // Check for existing university
    const existingUniversity = await pool.query(
      'SELECT * FROM university WHERE registration_number = $1 OR official_email = $2',
      [registration_number, official_email]
    );

    if (existingUniversity.rows.length > 0) {
      return res.status(400).json({ msg: 'University with this registration number or email already exists' });
    }

    // Insert into database
    const newUniversity = await pool.query(
      `INSERT INTO university (
        university_name, registration_number, charter_number, official_email, website, county
      ) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [
        university_name, registration_number, charter_number,
        official_email, website, county
      ]
    );

    // Return the newly created university record
    res.json(newUniversity.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error'); // Handle any unexpected errors
  }
});

// -----------------------------------------------------------------------------------










// HIGH SCHOOL SIGNUP
app.post('/high_school', async (req, res) => {
  try {
    const {
      school_name, registration_number, school_level,
      education_system, school_type, official_email,
      website, principal_name, principal_email,
      county,password
    } = req.body;


    // Insert into database
    const newHighSchool = await pool.query(
      `INSERT INTO high_school (
        school_name, registration_number, school_level,
        education_system, school_type, official_email,
        website, principal_name, principal_email,
        county, password
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING *`,
      [
        school_name, registration_number, school_level,
        education_system, school_type, official_email,
        website, principal_name, principal_email,
        county, password
      ]
    );
    res.json(newHighSchool.rows[0]);
 
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});



//  HIGH SCHOOL SIGN IN
app.post('/high_school/signin', async (req, res) => {
  console.log('Received body:', req.body);

  try {
    const { official_email, password } = req.body;


    // Check if the high school exists
    const result = await pool.query('SELECT * FROM high_school WHERE official_email = $1', [official_email]);

    if (result.rows.length === 0) {
      return res.status(400).json({ msg: 'Invalid email or password' });
    }

    const high_school = result.rows[0];

    // Verify password
    // const isValidPassword = await bcrypt.compare(hashed_password, high_school.password);
    if (password !== high_school.password) {
      return res.status(400).json({ msg: 'Invalid email or password' });
    }

    // Generate token
    const token = jwt.sign(
      { 
        school_id: high_school.school_id,
        school_name: high_school.school_name,
        official_email: high_school.official_email,
        role: 'highschool'
      },
     '191cedcb0d23f2334a73f6dfdb9ae36972e3c57b624012ba8d962679334601e46f7e2686bcb4e480fb403961a58c33d740d814540d9cd94814f7712adc650dc4',
      { expiresIn: '1h' }
    );

    // Send response
    res.json({
      msg: 'Sign in successful',
      token,
      high_school
    });

  } catch (error) {
    console.error('Signin error:', error);
    res.status(500).json({ msg: 'Server error', error: error.message });
  }
});


// -----------------------------------------------------------------------------------













// HOD signUp
app.post('/hods', async (req, res) => {
  try {
    const { hod_name, email, university_id, password } = req.body;

    // Hash the password
    // const hashedPassword = await bcrypt.hash(password, 10);

    // Check for existing HOD
    const existingHod = await pool.query(
      'SELECT * FROM hods WHERE email = $1',
      [email]
    );

    if (existingHod.rows.length > 0) {
      return res.status(400).json({ msg: 'HOD with this email already exists' });
    }

    // Insert into database
    const newHod = await pool.query(
      `INSERT INTO hods (
        hod_name, email, password, university_id
      ) VALUES ($1, $2, $3, $4) RETURNING *`,
      [
        hod_name, email, password, university_id
      ]
    );
    // Return the newly created HOD record
    res.json(newHod.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error'); // Handle any unexpected errors
  }
});





// HOD login
app.post('/hod/login', async (req, res) => {
  try {
    const { email, password } = req.body;

  

    // Check if HOD exists
    const hodResult = await pool.query(
      'SELECT * FROM hods WHERE email = $1',
      [email]
    );

    if (hodResult.rows.length === 0) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    const hod = hodResult.rows[0];

    // Compare the provided password with the hashed password in the database
    // const isMatch = await bcrypt.compare(password, hod.password);

    if (password !== hod.password) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    // Fetch university details
    const universityResult = await pool.query(
      'SELECT university_name FROM university WHERE university_id = $1',
      [hod.university_id]
    );

    if (universityResult.rows.length === 0) {
      return res.status(500).json({ message: 'University details not found' });
    }

    const university = universityResult.rows[0];

    // Generate JWT token
    const token = jwt.sign(
      {
        hod_id: hod.hod_id,
        hod_name: hod.hod_name,
        email: hod.email,
        university_name: university.university_name,
        role: "hod"
      },
      '191cedcb0d23f2334a73f6dfdb9ae36972e3c57b624012ba8d962679334601e46f7e2686bcb4e480fb403961a58c33d740d814540d9cd94814f7712adc650dc4',
      { expiresIn: '1h' }
    );

    // Send response
    res.json({
      msg: 'Sign in successful',
      token,
      hod: {
        hod_id: hod.hod_id,
        hod_name: hod.hod_name,
        email: hod.email,
        university_name: university.university_name
      }
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error'); // Handle any unexpected errors
  }
});

// -----------------------------------------------------------------------------------










// supervisors signUp
app.post('/supervisors', async (req, res) => {
  try {
    const { supervisor_name, email, university_id, course_id, password } = req.body;

    const newSupervisors = await pool.query(
      `INSERT INTO supervisors (
        supervisor_name, email, approval_status, university_id, course_id, password
      ) VALUES ($1, $2, 'pending', $3, $4, $5) RETURNING *`,
      [supervisor_name, email, university_id, course_id, password]
    ); 

    res.json(newSupervisors.rows[0]);
 
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});


// ALL UNVERIFIED SUPERVISORS
// Fetch all supervisors with pending status
app.get('/supervisors/pending', async (req, res) => {
  try {
    const query = `
      SELECT 
        id, 
        supervisor_name, 
        email, 
        approval_status, 
        university_id, 
        course_id
      FROM 
        supervisors
      WHERE 
        approval_status = 'pending'
    `;

    const result = await pool.query(query);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'No pending supervisors found' });
    }

    res.json({ pending_supervisors: result.rows });
  } catch (error) {
    console.error('Error fetching pending supervisors:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});




// Update supervisor status and approval date
app.put('/supervisors/:id/status', async (req, res) => {
  const { id } = req.params;
  const { approval_status } = req.body;
  
  // Validate input
  if (!['verified', 'rejected'].includes(approval_status)) {
    return res.status(400).json({ message: 'Invalid approval status. It must be either "verified" or "rejected".' });
  }

  try {
    const query = `
      UPDATE supervisors 
      SET 
        approval_status = $1
      WHERE 
        id = $2
      RETURNING *
    `;

    const result = await pool.query(query, [approval_status, id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Supervisor not found' });
    }

    res.json({ message: 'Supervisor status updated successfully', supervisor: result.rows[0] });
  } catch (error) {
    console.error('Error updating supervisor status:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});


// SUPERVISOR login
app.post('/supervisors/signin', async (req, res) => {
  console.log('Received body:', req.body);

  try {
    const { email, password } = req.body;

    // Check if the supervisor exists
    const result = await pool.query('SELECT * FROM supervisors WHERE email = $1', [email]);

    if (result.rows.length === 0) {
      return res.status(400).json({ msg: 'Invalid email or password' });
    }

    const supervisor = result.rows[0];

  
    if (password !== supervisor.password) {
      return res.status(400).json({ msg: 'Invalid email or password' });
    }


    // Generate token
    const token = jwt.sign(
      { 
        id: supervisor.id,
        supervisor_name: supervisor.supervisor_name,
        email: supervisor.email,
        approval_status: supervisor.approval_status,
        university_id: supervisor.university_id,
        course_id: supervisor.course_id,
        role: 'supervisor'
      },
      '191cedcb0d23f2334a73f6dfdb9ae36972e3c57b624012ba8d962679334601e46f7e2686bcb4e480fb403961a58c33d740d814540d9cd94814f7712adc650dc4',
      { expiresIn: '1h' }
    );

    // Send response
    res.json({
      msg: 'Sign in successful',
      token,
      supervisor
    });

  } catch (error) {
    console.error('Signin error:', error);
    res.status(500).json({ msg: 'Server error', error: error.message });
  }
});









// ================================================================================



// Endpoint to handle POST requests to insert into vacancy table
app.post('/vacancy', async (req, res) => {
  try {
      const {
          primary_subject,
          secondary_subject,
          positions_available,
          stat_date,
          end_date,
          application_deadline,
          coordinator_name,
          coordinator_email,
          coordinator_phone,
          accommodation_provided,
          stipend_amount,
          school_id
      } = req.body;


      // Insert new vacancy into the database
      const newVacancy = await pool.query(
          `INSERT INTO vacancy (
              primary_subject,
              secondary_subject,
              positions_available,
              stat_date,
              end_date,
              application_deadline,
              coordinator_name,
              coordinator_email,
              coordinator_phone,
              accommodation_provided,
              stipend_amount,
              school_id
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
          RETURNING *`,
          [
              primary_subject,
              secondary_subject,
              positions_available,
              stat_date,
              end_date,
              application_deadline,
              coordinator_name,
              coordinator_email,
              coordinator_phone,
              accommodation_provided,
              stipend_amount,
              school_id
          ]
      );

      // Send response
      res.json(newVacancy.rows[0]);
  } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
  }
});


// GET all vacancies
app.get('/vacancies', async (req, res) => {
  try {
    const query = `
      SELECT 
        v.vancancy_id, 
        v.primary_subject, 
        v.secondary_subject, 
        v.positions_available, 
        v.stat_date AS start_date, 
        v.end_date, 
        v.application_deadline,
        v.coordinator_name,
        v.coordinator_email,
        v.coordinator_phone,
        v.accommodation_provided,
        v.stipend_amount,
        h.school_id,
        h.school_name
      FROM 
        vacancy v
      JOIN 
        high_school h ON v.school_id = h.school_id
      WHERE 
        v.application_deadline >= CURRENT_DATE
      ORDER BY 
        v.application_deadline ASC
    `;
    
    const result = await pool.query(query);
    console.log(result); // Log the result for debugging purposes
    res.json({ vacancies: result.rows });
  } catch (err) {
    console.error('Error fetching vacancies:', err);
    res.status(500).json({ message: 'Server error while fetching vacancies' });
  }
});


// VACANCY BY ID
app.get('/vacancy/:vancancy_id', async (req, res) => {
  try {
    const { vancancy_id } = req.params;
    const query = `
      SELECT 
        v.vancancy_id, 
        v.primary_subject, 
        v.secondary_subject, 
        v.positions_available,
        v.stat_date AS start_date, 
        v.end_date, 
        v.application_deadline,
        v.coordinator_name, 
        v.coordinator_email, 
        v.coordinator_phone,
        v.accommodation_provided, 
        v.stipend_amount,
        h.school_id
      FROM vacancy v
      JOIN high_school h ON v.school_id = h.school_id
      WHERE v.vancancy_id = $1
    `;
    const result = await pool.query(query, [vancancy_id]);
    console.log(result);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Vacancy not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching vacancy details:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// ================================================================================================================================================================





// Endpoint to submit schemes of work for a specific week
app.post('/schemes_of_work', async (req, res) => {
  const { student_id, week_number, lessons } = req.body;

  try {
    // Insert the scheme of work
    const schemeResult = await pool.query(
      `INSERT INTO schemes_of_work (student_id, week_number) VALUES ($1, $2) RETURNING scheme_id`,
      [student_id, week_number]
    );

    const scheme_id = schemeResult.rows[0].scheme_id;

    // Insert the lessons
    const lessonPromises = lessons.map((lesson, index) => {
      return pool.query(
        `INSERT INTO lessons (
          scheme_id, 
          lesson_number, 
          instructional_objectives, 
          life_approach, 
          teaching_activities, 
          methods_strategies, 
          resources_references, 
          assessment, 
          remarks
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
        [
          scheme_id,
          index + 1,
          lesson.instructional_objectives,
          lesson.life_approach,
          lesson.teaching_activities,
          lesson.methods_strategies,
          lesson.resources_references,
          lesson.assessment,
          lesson.remarks
        ]
      );
    });

    await Promise.all(lessonPromises);

    res.status(201).json({ message: 'Scheme of work submitted successfully' });
  } catch (error) {
    console.error('Error submitting scheme of work:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});



// POST endpoint to add a lesson plan
app.post('/lesson-plan', async (req, res) => {
  try {
      const {
          student_id,
          subject_name,
          topic_name,
          subtopic_name,
          lesson_date,
          lesson_time,
          lesson_objectives
      } = req.body;


      const newLessonPlan = await pool.query(
          `INSERT INTO lesson_plan (
              student_id, 
              subject_name, 
              topic_name, 
              subtopic_name, 
              lesson_date, 
              lesson_time, 
              lesson_objectives
          ) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
          [
              student_id,
              subject_name,
              topic_name,
              subtopic_name,
              lesson_date,
              lesson_time,
              lesson_objectives
          ]
      );
      res.json(newLessonPlan.rows[0]);
  } catch (err) {
    console.error('Error adding lesson plan:', err);
      res.status(500).send('Server error');
  }
});




// get all student

app.get('/students/verified', async (req, res) => {
  try {
    const query = `
      SELECT 
        registration_id, 
        first_name, 
        last_name, 
        id_number, 
        email, 
        phone_number, 
        university_id, 
        graduation_date, 
        primary_teaching_subject, 
        secondary_teaching_subject, 
        kenya_county, 
        approval_status, 
        approval_date, 
        created_at, 
        updated_at
      FROM 
        student 
      WHERE 
        approval_status = 'verified'
    `;
    
    const result = await pool.query(query);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'No verified students found' });
    }
    
    res.json({ students: result.rows });
  } catch (error) {
    console.error('Error fetching verified students:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});




// FETCH BY SUBJECT
app.get('/students/subject/:subjectId', async (req, res) => {
  const { subjectId } = req.params;
  
  try {
    const query = `
      SELECT 
        registration_id, 
        first_name, 
        last_name, 
        id_number, 
        email, 
        phone_number, 
        university_id, 
        graduation_date, 
        primary_teaching_subject, 
        secondary_teaching_subject, 
        kenya_county, 
        approval_status, 
        approval_date, 
        created_at, 
        updated_at
      FROM 
        student 
      WHERE 
        primary_teaching_subject = $1
    `;
    
    const result = await pool.query(query, [subjectId]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'No students found for this subject' });
    }
    
    res.json({ students: result.rows });
  } catch (error) {
    console.error('Error fetching students by primary subject:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});









// FETCH ALL THE SCHEME OF WORK FOR A SINGLE STUDENT:
app.get('/schemes_of_work/:student_id', async (req, res) => {
  const { student_id } = req.params;

  try {
    const query = `
      SELECT 
        s.registration_id,
        s.first_name,
        s.last_name,
        sow.scheme_id, 
        sow.week_number, 
        l.lesson_id, 
        l.lesson_number, 
        l.instructional_objectives, 
        l.life_approach, 
        l.teaching_activities, 
        l.methods_strategies, 
        l.resources_references, 
        l.assessment, 
        l.remarks
      FROM 
        schemes_of_work sow
      LEFT JOIN 
        lessons l 
      ON 
        sow.scheme_id = l.scheme_id
      LEFT JOIN
        student s
      ON
        sow.student_id = s.registration_id
      WHERE 
        sow.student_id = $1
      ORDER BY 
        sow.week_number, l.lesson_number
    `;

    const result = await pool.query(query, [student_id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'No schemes of work found for this student' });
    }

    const studentInfo = {
      registration_id: result.rows[0].registration_id,
      first_name: result.rows[0].first_name,
      last_name: result.rows[0].last_name,
    };

    // Group the results by scheme_id and format the response
    const schemesOfWork = {};
    
    result.rows.forEach(row => {
      if (!schemesOfWork[row.scheme_id]) {
        schemesOfWork[row.scheme_id] = {
          scheme_id: row.scheme_id,
          week_number: row.week_number,
          lessons: []
        };
      }

      if (row.lesson_id) {
        schemesOfWork[row.scheme_id].lessons.push({
          lesson_id: row.lesson_id,
          lesson_number: row.lesson_number,
          instructional_objectives: row.instructional_objectives,
          life_approach: row.life_approach,
          teaching_activities: row.teaching_activities,
          methods_strategies: row.methods_strategies,
          resources_references: row.resources_references,
          assessment: row.assessment,
          remarks: row.remarks
        });
      }
    });

    res.json({
      student: studentInfo,
      schemes_of_work: Object.values(schemesOfWork)
    });
  } catch (error) {
    console.error('Error fetching schemes of work:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});



// GET ALL Lesson Plan
// GET endpoint to fetch lesson plans for a specific student
app.get('/lesson-plans/:student_id', async (req, res) => {
  const { student_id } = req.params;

  try {
    const query = `
      SELECT 
        student_id,
        subject_name,
        topic_name,
        subtopic_name,
        lesson_date,
        lesson_time,
        lesson_objectives
      FROM 
        lesson_plan
      WHERE 
        student_id = $1
      ORDER BY 
        lesson_date, lesson_time
    `;

    const result = await pool.query(query, [student_id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'No lesson plans found for this student' });
    }

    res.json({ lesson_plans: result.rows });
  } catch (error) {
    console.error('Error fetching lesson plans:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});


// Endpoint to add assessment marks
app.post('/grading/assessment-marks/:student_id', async (req, res) => {
  try {
    const { student_id } = req.params;
    const { marks } = req.body;

    console.log(student_id, marks);

    // Insert the assessment marks
    const result = await pool.query(
      `INSERT INTO assessment_marks (
        student_id, 
        total_marks
      ) VALUES ($1, $2) RETURNING *`,
      [student_id, marks]
    );

    res.status(201).json({ message: 'Assessment marks added successfully', assessment_marks: result.rows[0] });
  } catch (error) {
    console.error('Error adding assessment marks:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});































































// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ msg: 'Server error', error: err.message });
});



// Middleware to authenticate JWT tokens
const authenticateJWT = (req, res, next) => {
  const token = req.header('Authorization');

  if (!token) {
    return res.status(401).json({ message: 'Access denied' });
  }

  try {
    const decoded = jwt.verify(token, 'your_jwt_secret');
    req.user = decoded;
    next();
  } catch (error) {
    res.status(400).json({ message: 'Invalid token' });
  }
};


// Protected Routes
app.get('/student', authenticateJWT, (req, res) => {
  if (req.user.role !== 'student-teacher') {
    return res.status(403).json({ message: 'Access denied' });
  }
  res.status(200).json({ message: 'Welcome to the student-teacher portal' });
});

app.get('/hod', authenticateJWT, (req, res) => {
  if (req.user.role !== 'hod') {
    return res.status(403).json({ message: 'Access denied' });
  }
  res.status(200).json({ message: 'Welcome to the HOD portal' });
});

app.get('/highschool', authenticateJWT, (req, res) => {
  if (req.user.role !== 'highschool') {
    return res.status(403).json({ message: 'Access denied' });
  }
  res.status(200).json({ message: 'Welcome to the highschool portal' });
});

const secretKey='OjazGiWFIoxCtcyduO5yDrnhqJYUzV31';
// Middleware to verify token
const verifyToken = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) {
    return res.status(401).send('Access Denied');
  }
  try {
    const verified = jwt.verify(token, secretKey);
    req.user = verified;
    next();
  } catch (err) {
    res.status(400).send('Invalid Token');
  }
};



// Get school details by ID route
app.get('/school/:id', verifyToken, async (req, res) => {
  try {
    const token = req.headers['authorization'].split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const decodedToken = jwt.verify(token, JWT_SECRET);
    const school_id = decodedToken.school_id;


    // Fetch the school details from the database
    const query = 'SELECT * FROM high_school WHERE school_id = $1';
    const values = [school_id];
    const { rows } = await pool.query(query, values);

    if (rows.length === 0) {
      return res.status(404).json({ message: 'School not found' });
    }

    res.status(200).json({ school: rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});


// Route to handle form submissions
app.post('/messages', async (req, res) => {
  const { name, email, subject, message } = req.body;

  try {
    const result = await pool.query(
      'INSERT INTO messages (name, email, subject, message) VALUES ($1, $2, $3, $4) RETURNING *',
      [name, email, subject, message]
    );
    res.status(201).json(result.rows[0]);
    console.log(res);
  } catch (error) {
    console.error('Error saving message:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.listen(port, () => {
    console.log(`Listening at port ${port}`);
});
