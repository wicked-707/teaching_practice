CREATE TABLE university (
    university_id SERIAL PRIMARY KEY,
    university_name VARCHAR(100) NOT NULL,
    registration_number VARCHAR(50) UNIQUE NOT NULL,
    charter_number VARCHAR(50) UNIQUE,
    official_email VARCHAR(100) UNIQUE NOT NULL,
    website VARCHAR(100),
    county VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE hods (
  hod_id SERIAL PRIMARY KEY,
  hod_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  university_id INTEGER REFERENCES university(university_id)
);

CREATE TABLE course (
  course_id SERIAL PRIMARY KEY,
  course_code VARCHAR(10) UNIQUE NOT NULL,
  course_name VARCHAR(255) NOT NULL
);


CREATE TABLE supervisors (
  id SERIAL PRIMARY KEY,
  supervisor_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  approval_status VARCHAR(50) DEFAULT 'pending',
  university_id INTEGER REFERENCES university(university_id),
  course_id INTEGER REFERENCES course(course_id),
  password VARCHAR(255) NOT NULL
);

CREATE TABLE student(
    registration_id SERIAL PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    id_number VARCHAR(20) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    phone_number VARCHAR(17) NOT NULL,
    university_id INTEGER REFERENCES university(university_id),
    graduation_date DATE,
    primary_teaching_subject INTEGER NOT NULL REFERENCES course(course_id),
    secondary_teaching_subject INTEGER REFERENCES course(course_id),
    kenya_county VARCHAR(50) NOT NULL,
    approval_status VARCHAR(20) DEFAULT 'pending',
    approval_date TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    password VARCHAR(255) NOT NULL
);




CREATE TABLE high_school (
    school_id SERIAL PRIMARY KEY,
    school_name VARCHAR(100) NOT NULL,
    registration_number VARCHAR(50) UNIQUE NOT NULL,
    school_level VARCHAR(20), --e.g., 'district Level', 'county Level', 'Extra-County', 'Regional', 'National', 'international'
    education_system VARCHAR(50) NOT NULL, -- e.g., '8-4-4', 'CBC', etc.
    school_type VARCHAR(50) NOT NULL, -- e.g., 'Public', 'Private',
    official_email VARCHAR(100) UNIQUE NOT NULL,
    website VARCHAR(100),
    principal_name VARCHAR(100) NOT NULL,
    principal_email VARCHAR(100) NOT NULL,
    county VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    password VARCHAR(255) NOT NULL
);

INSERT INTO high_school (
    school_name, 
    registration_number, 
    school_level, 
    education_system, 
    school_type, 
    official_email, 
    website, 
    principal_name, 
    principal_email, 
    county, 
    password
) VALUES
    ('Springfield High School', 'SPR12345', 'National', '8-4-4', 'Public', 'info@springfieldhigh.edu', 'http://www.springfieldhigh.edu', 'John Doe', 'john.doe@springfieldhigh.edu', 'Nairobi', 'securepassword123'),
    ('Greenwood Academy', 'GWD67890', 'Regional', 'CBC', 'Private', 'contact@greenwoodacademy.co.ke', 'http://www.greenwoodacademy.co.ke', 'Jane Smith', 'jane.smith@greenwoodacademy.co.ke', 'Kiambu', 'securepassword123'),
    ('Riverside School', 'RVS11223', 'County Level', '8-4-4', 'Public', 'admin@riversideschool.org', 'http://www.riversideschool.org', 'Emily Johnson', 'emily.johnson@riversideschool.org', 'Mombasa', 'securepassword123'),
    ('Sunset International School', 'SUN44556', 'International', 'CBC', 'Private', 'info@sunsetinternational.org', 'http://www.sunsetinternational.org', 'Michael Brown', 'michael.brown@sunsetinternational.org', 'Nakuru', 'securepassword123'),
    ('Pinewood High School', 'PIN78901', 'District Level', '8-4-4', 'Public', 'contact@pinewoodhigh.edu', 'http://www.pinewoodhigh.edu', 'Sarah Wilson', 'sarah.wilson@pinewoodhigh.edu', 'Uasin Gishu', 'securepassword123');




CREATE TABLE vacancy(
    vancancy_id SERIAL PRIMARY KEY,
    primary_subject varchar(50),
    secondary_subject varchar(50),
    positions_available INTEGER,
    stat_date DATE NOT NULL,
    end_date DATE NOT NULL,
    application_deadline DATE,
    coordinator_name VARCHAR(100),
    coordinator_email VARCHAR(100),
    coordinator_phone VARCHAR(20),
    accommodation_provided BOOLEAN,    
    stipend_amount DECIMAL(10, 2),
    school_id INTEGER NOT NULL,
    FOREIGN KEY (school_id) REFERENCES high_school (school_id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO vacancy (
    primary_subject, 
    secondary_subject, ;
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
) VALUES
    ('Mathematics', 'Physics', 2, '2024-08-01', '2024-12-01', '2024-11-15', 'John Doe', 'john.doe@springfieldhigh.edu', '0701234567', TRUE, 50000.00, 1),
    ('English', 'Literature', 3, '2024-09-01', '2025-01-01', '2024-12-15', 'Jane Smith', 'jane.smith@greenwoodacademy.co.ke', '0712345678', FALSE, 55000.00, 2),
    ('Biology', 'Chemistry', 1, '2024-07-15', '2024-11-15', '2024-10-15', 'Emily Johnson', 'emily.johnson@riversideschool.org', '0723456789', TRUE, 60000.00, 3),
    ('History', 'Geography', 2, '2024-08-15', '2025-01-15', '2024-12-01', 'Michael Brown', 'michael.brown@sunsetinternational.org', '0734567890', FALSE, 62000.00, 4),
    ('Computer Science', 'Mathematics', 4, '2024-09-01', '2025-02-01', '2024-11-30', 'Sarah Wilson', 'sarah.wilson@pinewoodhigh.edu', '0745678901', TRUE, 65000.00, 5);



-- courses:
INSERT INTO course (course_code, course_name) VALUES
('CHEM101', 'Chemistry'),
('MATH101', 'Mathematics'),
('ENG101', 'English'),
('LIT101', 'Literature'),
('HIST101', 'History'),
('KIS101', 'Kiswahili'),
('BIO101', 'Biology'),
('PHY101', 'Physics'),
('FRE101', 'French'),
('GEO101', 'Geography'),
('ECON101', 'Economics'),
('PSY101', 'Psychology'),
('SOC101', 'Sociology'),
('PHIL101', 'Philosophy'),
('MUS101', 'Music'),
('ART101', 'Art'),
('PE101', 'Physical Education'),
('COMP101', 'Computer Science'),
('BUS101', 'Business Studies'),
('HE101', 'Home Economics');


-- university data
{
  "university_name": "Tech Valley University",
  "registration_number": "TVU2024001",
  "charter_number": "TVU-CN1234",
  "official_email": "info@techvalley.edu",
  "website": "http://www.techvalley.edu",
  "county": "Nairobi"
}


-- student data
{
  "first_name": "John",
  "last_name": "Doe",
  "id_number": "12345678",
  "email": "john.doe@example.com",
  "phone_number": "+254700123456",
  "university_id": 1,
  "graduation_date": "2024-12-15",
  "primary_teaching_subject": 1,
  "secondary_teaching_subject": 2,
  "kenya_county": "Nairobi",
  "hashed_password": "password123",
  "confirm_pass": "password123"
}


-- high school data
{
  "school_name": "Example High School",
  "registration_number": "HS12345",
  "school_level": "National",
  "education_system": "8-4-4",
  "school_type": "Public",
  "official_email": "contact@example.com",
  "website": "http://example.com",
  "principal_name": "John Doe",
  "principal_email": "john.doe@example.com",
  "county": "Example County",
  "password":"123456789"
}


-- supervisors
{
  "supervisor_name": "Jane Doe",
  "email": "jane.doe@example.com",
  "university_id": 1,
  "course_id": 5,
  "password": "SecureP@ssw0rd"
}



CREATE TABLE schemes_of_work (
  scheme_id SERIAL PRIMARY KEY,
  student_id INTEGER REFERENCES student(registration_id) ON DELETE CASCADE,
  week_number INTEGER NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE lessons (
  lesson_id SERIAL PRIMARY KEY,
  scheme_id INTEGER REFERENCES schemes_of_work(scheme_id) ON DELETE CASCADE,
  lesson_number INTEGER NOT NULL,
  instructional_objectives TEXT,
  life_approach TEXT,
  teaching_activities TEXT,
  methods_strategies TEXT,
  resources_references TEXT,
  assessment TEXT,
  remarks TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


-- lesson data
{
  "student_id": 1,
  "week_number": 1,
  "lessons": [
    {
      "instructional_objectives": "Understand basic algebra concepts",
      "life_approach": "Relate algebra to real-life problem-solving",
      "teaching_activities": "Interactive examples, group work",
      "methods_strategies": "Lecture, discussion, hands-on activities",
      "resources_references": "Algebra textbook, online resources",
      "assessment": "Quiz at the end of the week",
      "remarks": "Ensure all students participate"
    },
    {
      "instructional_objectives": "Solve linear equations",
      "life_approach": "Use linear equations in budgeting",
      "teaching_activities": "Solve problems on board, pair work",
      "methods_strategies": "Demonstration, practice problems",
      "resources_references": "Worksheet, practice problems",
      "assessment": "Homework assignment",
      "remarks": "Review common mistakes"
    }
  ]
}


CREATE TABLE lesson_plan (
    lesson_plan_id SERIAL PRIMARY KEY,
    student_id INTEGER NOT NULL,
    subject_name VARCHAR(100) NOT NULL,
    topic_name VARCHAR(100) NOT NULL,
    subtopic_name VARCHAR(100) NOT NULL,
    lesson_date DATE NOT NULL,
    lesson_time TIME NOT NULL,
    lesson_objectives TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES student(registration_id) ON DELETE CASCADE
);


CREATE TABLE assessment_marks (
    mark_id SERIAL PRIMARY KEY,
    student_id INTEGER NOT NULL REFERENCES student(registration_id),
    total_marks INTEGER NOT NULL CHECK (total_marks > 0),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);





-- thanks for the good work, lets now handle creating records of work that is being submitted by each student provides:
-- Subject Name:
-- Form/Grade:
-- Topic:
-- Year:
-- Term: