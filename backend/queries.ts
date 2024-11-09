export const CREATE_STUDENTS_TABLE = `
    CREATE TABLE IF NOT EXISTS student (
        id VARCHAR(20) PRIMARY KEY,
        username VARCHAR(100) NOT NULL,
        password VARCHAR(100) NOT NULL,
        fullname VARCHAR(100) NULL,
        dob DATE NULL,
        year_of_passing INT NULL,
        srn VARCHAR(20) UNIQUE NULL,
        branch VARCHAR(50) NULL,
        program VARCHAR(50) NULL,
        semester INT NULL,
        cgpa DECIMAL(4,2) NULL,
        marks_10 DECIMAL(5,2) NULL,
        marks_12 DECIMAL(5,2) NULL,
        father_name VARCHAR(100) NULL,
        mother_name VARCHAR(100) NULL,
        address TEXT NULL,
        email VARCHAR(100) NULL,
        contact VARCHAR(20) NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )
`

export const CREATE_INTERVIEWERS_TABLE = `
    CREATE TABLE IF NOT EXISTS interviewer (
        id VARCHAR(20) PRIMARY KEY,
        username VARCHAR(100) NOT NULL,
        password VARCHAR(100) NOT NULL,
        fullname VARCHAR(100) NULL,
        email VARCHAR(100) UNIQUE NULL
    )
`

export const CREATE_ADMINS_TABLE = `
    CREATE TABLE IF NOT EXISTS admin (
        id VARCHAR(20) PRIMARY KEY,
        username VARCHAR(100) NOT NULL,
        password VARCHAR(100) NOT NULL,
        fullname VARCHAR(100) NULL,
        email VARCHAR(100) UNIQUE NULL
    )
`

export const CREATE_INTERVIEWS_TABLE = `
    CREATE TABLE IF NOT EXISTS interview (
        id INT AUTO_INCREMENT PRIMARY KEY,
        candidate_srn VARCHAR(20) NOT NULL,
        interview_date DATE NOT NULL,
        interviewer_id VARCHAR(20) NOT NULL,
        slot_id INT NOT NULL,
        status ENUM('scheduled', 'completed', 'cancelled') DEFAULT 'scheduled',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (candidate_srn) REFERENCES student(srn),
        FOREIGN KEY (interviewer_id) REFERENCES interviewer(id)
    )
`

export const CREATE_FEEDBACK_TABLE = `
    CREATE TABLE IF NOT EXISTS feedback (
        id INT AUTO_INCREMENT PRIMARY KEY,
        candidate_srn VARCHAR(20) NOT NULL,
        interviewer_id VARCHAR(20) NOT NULL,
        comments TEXT NOT NULL,
        score INT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (candidate_srn) REFERENCES student(srn),
        FOREIGN KEY (interviewer_id) REFERENCES interviewer(id)
    )
`

export const CREATE_INTERVIEW_SLOTS_TABLE = `
    CREATE TABLE IF NOT EXISTS interview_slot (
        id VARCHAR(20) PRIMARY KEY,
        student_id VARCHAR(100) NOT NULL,
        interviewer_id VARCHAR(100) NOT NULL,
        scheduled_time DATETIME NOT NULL,
        status ENUM('scheduled', 'completed', 'cancelled') DEFAULT 'scheduled',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (student_id) REFERENCES student(id),
        FOREIGN KEY (interviewer_id) REFERENCES interviewer(id)
    )
`
