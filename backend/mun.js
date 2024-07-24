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

const JWT_SECRET = process.env.JWT_SECRET;





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


cloudinary.config({
  cloud_name: 'dmfa4ntvh',
  api_key: '275433718151248',
  api_secret: 'QYcCgy1iH5nCM47Ck-v7EOlLulo'
});

// Configure multer for Cloudinary upload
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'high_school_photos',
    allowed_formats: ['jpg', 'png', 'jpeg'],
    transformation: [{ width: 500, height: 500, crop: 'limit' }]
  }
});

const upload = multer({ storage: storage });


// Student signUp
app.post('/student', async (req, res) => {
  try {
    const {
      registration_id, first_name, last_name, id_number, date_of_birth, gender, email, phone_number,
      university_name, course_name, specialization, graduation_date,
      primary_teaching_subject, secondary_teaching_subject, kenya_county, hashed_password, confirm_pass
    } = req.body;

    // Input validation
    if (!first_name || !last_name || !id_number || !date_of_birth || !gender || !email || !phone_number ||
        !university_name || !course_name || !specialization || !graduation_date ||
        !primary_teaching_subject || !secondary_teaching_subject || !kenya_county || !hashed_password || !confirm_pass) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Check if passwords match
    if (hashed_password !== confirm_pass) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    // Check for existing student
    const existingStudent = await pool.query(
      'SELECT * FROM student WHERE registration_id = $1',
      [registration_id]
    );

    if (existingStudent.rows.length > 0) {
      return res.status(400).json({ msg: 'Student ID number already exists' });
    }

    // Hash the password
    // const hashedPass = await bcrypt.hash(hashed_password, 10);

    // Insert into database
    const newStudent = await pool.query(
      `INSERT INTO student (
        first_name, last_name, id_number, date_of_birth, gender, email, phone_number,
        university_name, course_name, specialization, graduation_date,
        primary_teaching_subject, secondary_teaching_subject, kenya_county, hashed_password, role
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16) RETURNING *`,
      [
        first_name, last_name, id_number, date_of_birth, gender, email, phone_number,
        university_name, course_name, specialization, graduation_date,
        primary_teaching_subject, secondary_teaching_subject, kenya_county, hashed_password, 'student-teacher'
      ]
    );

  // // Generate JWT token
  //   const token = jwt.sign({ userId: newStudent.id, role: newStudent.role }, JWT_SECRET, { expiresIn: '1h' });

  //   // Return token to client
  //   res.json({ token });

    res.json(newStudent.rows[0]); // Return the newly created student record
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error'); // Handle any unexpected errors
  }
});

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

    // Verify password
    // const isValidPassword = await bcrypt.compare(hashed_password, student.hashed_password);
    // if (!isValidPassword) {
    //   return res.status(400).json({ msg: 'Invalid email or password' });
    // }

    // Check for JWT_SECRET
    if (!process.env.JWT_SECRET) {
      throw new Error('JWT_SECRET is not defined in the environment variables');
    }

    // Generate token
    const token = jwt.sign(
      { 
        registration_id: student.registration_id,
        first_name: student.first_name,
        last_name: student.last_name,
        email: student.email,
        university_name: student.university_name,
        role: student.role
      },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    // Send response
    res.json({
      msg: 'Sign in successful',
      token,
      student
        });

  } catch (error) {
    console.error('Signin error:', error);
    res.status(500).json({ msg: 'Server error', error: error.message });
  }
});


// university signin

app.post('/uni/signin', async (req, res) => {
    console.log('Received body:', req.body);

  if(req.get('Content-Type') !== 'application/json') {
    return res.status(415).send('Unsupported Media Type');
  }
  try {
    const { official_email, pass } = req.body;

    // Validate input
    if (!official_email || !pass) {
      return res.status(400).json({ msg: 'Please provide both email and password' });
    }

    // Check if the student exists
    const result = await pool.query('SELECT * FROM university WHERE official_email = $1', [official_email]);
    
    if (result.rows.length === 0) {
      return res.status(400).json({ msg: 'Invalid email or password' });
    }

    const university = result.rows[0];

    // Verify password
    // const isValidPassword = await bcrypt.compare(hashed_password, student.hashed_password);
    // if (!isValidPassword) {
    //   return res.status(400).json({ msg: 'Invalid email or password' });
    // }

    // Check for JWT_SECRET
    if (!process.env.JWT_SECRET) {
      throw new Error('JWT_SECRET is not defined in the environment variables');
    }

    // Generate token
    const token = jwt.sign(
      { 
        university_id: university.university_id,
        university_name: university.university_name,
        official_email: university.official_email,
        registration_number: university.registration_number,
        // role: university.role
      },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    // Send response
    res.json({
      msg: 'Sign in successful',
      token,
      university
        });

  } catch (error) {
    console.error('Signin error:', error);
    res.status(500).json({ msg: 'Server error', error: error.message });
  }
});



// university signup
app.post('/university', async (req, res) => {
  try {
    const {university_name, establishment_date, registration_number, charter_number,
          accreditation_status, official_email, official_phone_number, website,
          postal_address, physical_address, county, category, pass, confirm_pass, role}
          = req.body;

    const newUniversity = await pool.query(
        `INSERT INTO university (
          university_name, establishment_date, registration_number, charter_number,
          accreditation_status, official_email, official_phone_number, website,
          postal_address, physical_address, county, category, pass, confirm_pass
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14) RETURNING *`,
        [university_name, establishment_date, registration_number, charter_number,
          accreditation_status, official_email, official_phone_number, website,
          postal_address, physical_address, county, category, pass, confirm_pass]
    ); 

    res.json(newUniversity.rows[0]);
 
  } catch (err) {
    console.error(err.message);
    res.status(500).send('server error');
  }
});

// schools signup
app.post('/high_school', upload.single('school_photo'), async (req, res) => {
  try {
    const {
      school_id, school_name, establishment_date, registration_number, school_level,
      education_system, school_type, official_email, official_phone_number,
      website, postal_address, physical_address, principal_name, principal_email,
      principal_phone, county, sub_county, hashed_password, confirm_pass,
    } = req.body;

    const school_photo_url = req.file ? req.file.path : null;
    const role = 'highschool';

    const newHigh_school = await pool.query(
      `INSERT INTO high_school (
        school_name, establishment_date, registration_number, school_level,
        education_system, school_type, official_email, official_phone_number,
        website, postal_address, physical_address, principal_name, principal_email,
        principal_phone, county, sub_county, hashed_password, confirm_pass, role, school_photo_url
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20) RETURNING *`,
      [school_name, establishment_date, registration_number, school_level,
        education_system, school_type, official_email, official_phone_number,
        website, postal_address, physical_address, principal_name, principal_email,
        principal_phone, county, sub_county, hashed_password, confirm_pass, role, school_photo_url]
    );


    res.json(newHigh_school.rows[0]);
 
  } catch (err) {
    console.error(err.message);
    res.status(500).send('server error');
  }
});

// highscool signin
app.post('/high_school/signin', async (req, res) => {
    console.log('Received body:', req.body);

  if(req.get('Content-Type') !== 'application/json') {
    return res.status(415).send('Unsupported Media Type');
  }
  try {
    const { official_email, hashed_password } = req.body;

    // Validate input
    if (!official_email || !hashed_password) {
      return res.status(400).json({ msg: 'Please provide both email and password' });
    }

    // Check if the student exists
    const result = await pool.query('SELECT * FROM high_school WHERE official_email = $1', [official_email]);
    
    if (result.rows.length === 0) {
      return res.status(400).json({ msg: 'Invalid email or password' });
    }

    const high_school = result.rows[0];

    // Verify password
    // const isValidPassword = await bcrypt.compare(hashed_password, student.hashed_password);
    // if (!isValidPassword) {
    //   return res.status(400).json({ msg: 'Invalid email or password' });
    // }

    // Check for JWT_SECRET
    if (!process.env.JWT_SECRET) {
      throw new Error('JWT_SECRET is not defined in the environment variables');
    }

    // Generate token
    const token = jwt.sign(
      { 
        school_id: high_school.school_id,
        school_name: high_school.school_name,
        official_email: high_school.official_email,
        role: high_school.role
      },
      process.env.JWT_SECRET,
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


// hod signUp
app.post('/hods', async (req, res) => {
  try {
    const {hod_name, email, department_id, hod_number, pass, confirm_pass}
          = req.body;

    // Hash the password
    const hashedPassword = await bcrypt.hash(pass, 10); // Hash with salt rounds = 10

    const newHods = await pool.query(
      `INSERT INTO hods (
        hod_name, email, department_id, hod_number, pass, role
      ) VALUES ($1, $2, $3, $4, $5, 'hod') RETURNING *`,
      [hod_name, email, department_id, hod_number, hashedPassword]
    );

    res.json(newHods.rows[0]);
 
  } catch (err) {
    console.error(err.message);
    res.status(500).send('server error');
  }
});

// supervisors signUp
app.post('/supervisors', async (req, res) => {
  try {
    const {supervisor_name, email, sup_number, department_id,  pass, confirm_pass}
          = req.body;

    const newSupervisors = await pool.query(
        `INSERT INTO supervisors (
          supervisor_name, email, sup_number, department_id,  pass, confirm_pass
        ) VALUES ($1, $2, $3, $4, $5, $6,) RETURNING *`,
        [supervisor_name, email, sup_number, department_id,  pass, confirm_pass]
    ); 

    res.json(newSupervisors.rows[0]);
 
  } catch (err) {
    console.error(err.message);
    res.status(500).send('server error');
  }
});

// departments
app.post('/departments', async (req, res) => {
  try {
    const {dep_name, university_id}
          = req.body;

    const newDepartments = await pool.query(
        `INSERT INTO departments (
          dep_name, university_id
        ) VALUES ($1, $2) RETURNING *`,
        [dep_name, university_id]
    ); 

    res.json(newDepartments.rows[0]);
 
  } catch (err) {
    console.error(err.message);
    res.status(500).send('server error');
  }
});

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
            application_method,
            coordinator_name,
            coordinator_email,
            coordinator_phone,
            accommodation_provided,
            stipend_amount
        } = req.body;

        const newVacancy = await pool.query(
            `INSERT INTO vacancy (
                primary_subject,
                secondary_subject,
                positions_available,
                stat_date,
                end_date,
                application_deadline,
                application_method,
                coordinator_name,
                coordinator_email,
                coordinator_phone,
                accommodation_provided,
                stipend_amount
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
            RETURNING *`,
            [
                primary_subject,
                secondary_subject,
                positions_available,
                stat_date,
                end_date,
                application_deadline,
                application_method,
                coordinator_name,
                coordinator_email,
                coordinator_phone,
                accommodation_provided,
                stipend_amount
            ]
        );

        res.json(newVacancy.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});



// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ msg: 'Server error', error: err.message });
});

// hod Login endpoint
// app.post('/signin', async (req, res) => {
//   const { email, password } = req.body;

//   try {
//     // Example query for student login
//     const student = await pool.query(
//       'SELECT * FROM student WHERE email = $1',
//       [email]
//     );

//     if (student.rows.length === 0) {
//       return res.status(404).json({ message: 'Student not found' });
//     }

//     // Compare passwords
//     const isMatch = await bcrypt.compare(password, student.rows[0].pass);

//     if (!isMatch) {
//       return res.status(401).json({ message: 'Invalid credentials' });
//     }

//     // Generate and return JWT for student
//     const token = jwt.sign(
//       { userId: student.rows[0].id, role: 'student' },
//       process.env.JWT_SECRET,
//       { expiresIn: '1h' }
//     );

//     res.json({ token });

//   } catch (error) {
//     console.error(error.message);
//     res.status(500).json({ message: 'Server error' });
//   }
// });


// HOD Login endpoint
app.post('/hods', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Example query for hods login
    const hods = await pool.query(
      'SELECT * FROM hods WHERE email = $1',
      [email]
    );

    if (hods.rows.length === 0) {
      return res.status(404).json({ message: 'hods not found' });
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, hods.rows[0].pass);

    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate and return JWT for hods
    const token = jwt.sign(
      { userId: hods.rows[0].id, role: 'student' },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({ token });

  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

//supervisors Login endpoint
app.post('/supervisors', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Example query for supervisors login
    const supervisors = await pool.query(
      'SELECT * FROM supervisors WHERE email = $1',
      [email]
    );

    if (supervisors.rows.length === 0) {
      return res.status(404).json({ message: 'supervisors not found' });
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, supervisors.rows[0].pass);

    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate and return JWT for supervisors
    const token = jwt.sign(
      { userId: supervisors.rows[0].id, role: 'supervisors' },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({ token });

  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// high school Login endpoint
app.post('/highschool_signin', async (req, res) => {
  const { email, hashed_password } = req.body;

  try {
    // Example query for high_school login
    const high_school = await pool.query(
      'SELECT * FROM high_school WHERE email = $1',
      [email]
    );

    if (high_school.rows.length === 0) {
      return res.status(404).json({ message: 'high_school not found' });
    }

    // Compare passwords
    // const isMatch = await bcrypt.compare(password, high_school.rows[0].pass);

    // if (!isMatch) {
    //   return res.status(401).json({ message: 'Invalid credentials' });
    // }

    // Generate and return JWT for high_school
    const token = jwt.sign(
      { userId: high_school.rows[0].id, role: 'highschool' },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({ token });

  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Server error' });
  }
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

// Upload vacancy route
app.post('/vacancy/add', verifyToken, async (req, res) => {
  try {
    const token = req.headers['authorization'].split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const decodedToken = jwt.verify(token, JWT_SECRET);
    const school_id = decodedToken.school_id;

    const vacancyData = req.body;
    // Handle the vacancy data
    console.log(vacancyData);
    
    const {
      primary_subject,
      secondary_subject,
      positions_available,
      stat_date,
      end_date,
      application_deadline,
      application_method,
      coordinator_name,
      coordinator_email,
      coordinator_phone,
      accommodation_provided,
      stipend_amount
    } = req.body;

    const query = `
      INSERT INTO vacancy (
        primary_subject, secondary_subject, positions_available, 
        stat_date, end_date, application_deadline, application_method,
        coordinator_name, coordinator_email, coordinator_phone,
        accommodation_provided, stipend_amount, school_id
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
      RETURNING *
    `;

    const values = [
      primary_subject, secondary_subject, positions_available,
      stat_date, end_date, application_deadline, application_method,
      coordinator_name, coordinator_email, coordinator_phone,
      accommodation_provided, stipend_amount, school_id
    ];

    const { rows } = await pool.query(query, values);
    return res.status(201).json({ message: 'Vacancy created', vacancy_id: rows[0].vacancy_id });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Server error' });
  }
});

// getting all vacancies
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
        v.application_method,
        v.coordinator_name,
        v.coordinator_email,
        v.coordinator_phone,
        v.accommodation_provided,
        v.stipend_amount,
        h.school_id,
        h.school_name,
        h.official_email,
        h.official_phone_number,
        h.county,
        h.school_photo_url
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
    console.log(result) // Assuming db.query handles the database query execution
    res.json({ vacancies: result.rows });
  } catch (err) {
    console.error('Error fetching vacancies:', err);
    res.status(500).json({ message: 'Server error while fetching vacancies' });
  }
});

// get vacancy by Id

app.get('/vacancy/:vancancy_id', async (req, res) => {
  try {
    const {vancancy_id} = req.params;
    const query = `
      SELECT 
        v.primary_subject, v.secondary_subject, v.positions_available,
        v.stat_date, v.end_date, v.application_deadline, v.application_method,
        v.coordinator_name, v.coordinator_email, v.coordinator_phone,
        v.accommodation_provided, v.stipend_amount,
        h.school_name AS school_name, h.official_email, h.official_phone_number,
        h.county, h.school_photo_url
      FROM vacancy v
      JOIN high_school h ON v.school_id = h.school_id
      WHERE v.vancancy_id = $2
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
// app.get('/vacancy/:vancancy_id', async (req, res) => {
//   try {
//     const { vancancy_id } = req.params;

//     // Ensure that vancancy_id is an integer
//     const vacancyIdInt = parseInt(vancancy_id, 10);
//     if (isNaN(vacancyIdInt)) {
//       return res.status(400).json({ message: 'Invalid vacancy ID' });
//     }
//     console.log(vacancyIdInt);

//     const query = `
//       SELECT 
//         v.vancancy_id, 
//         v.primary_subject, 
//         v.secondary_subject, 
//         v.positions_available, 
//         v.stat_date AS start_date, 
//         v.end_date, 
//         v.application_deadline,
//         v.application_method,
//         v.coordinator_name,
//         v.coordinator_email,
//         v.coordinator_phone,
//         v.accommodation_provided,
//         v.stipend_amount,
//         h.school_id,
//         h.school_name,
//         h.official_email,
//         h.official_phone_number,
//         h.county,
//         h.school_photo_url
//       FROM 
//         vacancy v
//       JOIN 
//         high_school h ON v.school_id = h.school_id
//       WHERE 
//         v.vancancy_id = $1
//     `;

//     const result = await pool.query(query, [vacancyIdInt]);

//     if (result.rows.length === 0) {
//       return res.status(404).json({ message: 'Vacancy not found' });
//     }

//     res.json(result.rows[0]);
//   } catch (err) {
//     console.error('Error fetching vacancy:', err);
//     res.status(500).json({ message: 'Server error while fetching vacancy' });
//   }
// });

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
