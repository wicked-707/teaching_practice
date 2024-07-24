CREATE DATABASE tp;

CREATE TABLE student(
    registration_id SERIAL PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    id_number VARCHAR(20) UNIQUE NOT NULL,
    date_of_birth DATE NOT NULL,
    gender VARCHAR(10) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    phone_number VARCHAR(17) NOT NULL,
    university_name VARCHAR(100) NOT NULL,
    course_name VARCHAR(100) NOT NULL,
    specialization VARCHAR(100) NOT NULL,
    graduation_date DATE,
    primary_teaching_subject VARCHAR(50) NOT NULL,
    secondary_teaching_subject VARCHAR(50),
    kenya_county VARCHAR(50) NOT NULL,
    approval_status VARCHAR(20) DEFAULT 'Pending',
    approved_by VARCHAR(100),
    approval_date TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    hash_password VARCHAR(255) NOT NULL
);


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





CREATE TABLE high_school (
    school_id SERIAL PRIMARY KEY,
    school_name VARCHAR(100) NOT NULL,
    establishment_date DATE NOT NULL,
    registration_number VARCHAR(50) UNIQUE NOT NULL,
    school_level VARCHAR(20), --e.g., 'district Level', 'county Level', 'Extra-County', 'Regional', 'National', 'international'
    education_system VARCHAR(50) NOT NULL, -- e.g., '8-4-4', 'CBC', etc.
    school_type VARCHAR(50) NOT NULL, -- e.g., 'Public', 'Private',
    official_email VARCHAR(100) UNIQUE NOT NULL,
    official_phone_number VARCHAR(20) NOT NULL,
    website VARCHAR(100),
    postal_address VARCHAR(100) NOT NULL,
    physical_address TEXT NOT NULL,
    principal_name VARCHAR(100) NOT NULL,
    principal_email VARCHAR(100) NOT NULL,
    principal_phone VARCHAR(20) NOT NULL,
    county VARCHAR(50) NOT NULL,
    sub_county VARCHAR(50) NOT NULL,
    approval_status VARCHAR(20) DEFAULT 'Pending',
    approved_by VARCHAR(100),
    approval_date TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- CREATE TYPE accommodation_option AS ENUM ('Do Not Offer Accommodation', 'Offer Accommodation - Free', 'Offer Accommodation - Under Charges');


CREATE TABLE vacancy(
    vancancy_id SERIAL PRIMARY KEY,
    primary_subject varchar(50),
    secondary_subject varchar(50),
    positions_available INTEGER,
    stat_date DATE NOT NULL,
    end_date DATE NOT NULL,
    application_deadline DATE,
    application_method VARCHAR(50),
    coordinator_name VARCHAR(100),
    coordinator_email VARCHAR(100),
    coordinator_phone VARCHAR(20),
    accommodation_provided VARCHAR(50),    
    stipend_amount DECIMAL(10, 2),
    school_id INTEGER NOT NULL,
    FOREIGN KEY (school_id) REFERENCES high_school (school_id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);















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
















-- CREATE TABLE university (
--     university_id SERIAL PRIMARY KEY,
--     university_name VARCHAR(100) NOT NULL,
--     establishment_date DATE NOT NULL,
--     registration_number VARCHAR(50) UNIQUE NOT NULL,
--     charter_number VARCHAR(50) UNIQUE,
--     accreditation_status VARCHAR(50) NOT NULL,
--     official_email VARCHAR(100) UNIQUE NOT NULL,
--     official_phone_number VARCHAR(20) NOT NULL,
--     website VARCHAR(100),
--     postal_address VARCHAR(100) NOT NULL,
--     physical_address TEXT NOT NULL,
--     county VARCHAR(50) NOT NULL,
--     category VARCHAR(20),
--     approval_status VARCHAR(20) DEFAULT 'Pending',
--     approved_by VARCHAR(100),
--     approval_date TIMESTAMP,
--     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
--     updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
-- );