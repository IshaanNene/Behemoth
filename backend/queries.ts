export const CREATE_STUDENTS_TABLE = `
    CREATE TABLE IF NOT EXISTS student (
        id VARCHAR(20) PRIMARY KEY,
        username VARCHAR(100) NOT NULL,
        password VARCHAR(100) NOT NULL,
        fullname VARCHAR(100) NULL,
        email VARCHAR(100) UNIQUE NULL
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
        student_id VARCHAR(20),
        interviewer_id VARCHAR(20),
        date_time DATETIME NOT NULL,
        status ENUM('scheduled', 'completed', 'cancelled') DEFAULT 'scheduled',
        FOREIGN KEY (student_id) REFERENCES students(id),
        FOREIGN KEY (interviewer_id) REFERENCES interviewers(id)
    )
`
