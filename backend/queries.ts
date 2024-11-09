export const CREATE_DATABASE = `
CREATE DATABASE IF NOT EXISTS interview_scheduler;
`

export const USE_DATABASE = `
USE interview_scheduler;
`

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

export const CREATE_FEEDBACK_TABLE = `
    CREATE TABLE IF NOT EXISTS feedback (
        id INT AUTO_INCREMENT PRIMARY KEY,
        candidate_id VARCHAR(20) NOT NULL,
        interviewer_id VARCHAR(20) NOT NULL,
        comments TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (candidate_id) REFERENCES student(id),
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

export const CREATE_FEEDBACK_TRIGGER = `
    CREATE TRIGGER IF NOT EXISTS after_feedback_insert
    AFTER INSERT ON feedback
    FOR EACH ROW
    BEGIN
        UPDATE interview_slot 
        SET status = 'completed'
        WHERE student_id = NEW.candidate_id 
        AND interviewer_id = NEW.interviewer_id
        AND status = 'scheduled';
    END;
`

export const CREATE_ADMIN_USER = `
CREATE USER IF NOT EXISTS 'admin_user'@'localhost' IDENTIFIED BY 'admin_password';
`

export const GRANT_ADMIN_PRIVILEGES = `
GRANT ALL PRIVILEGES ON interview_scheduler.* TO 'admin_user'@'localhost';
`

export const CREATE_INTERVIEWER_USER = `
CREATE USER IF NOT EXISTS 'interviewer_user'@'localhost' IDENTIFIED BY 'interviewer_password';
`

export const GRANT_INTERVIEWER_SELECT_STUDENT = `
GRANT SELECT ON interview_scheduler.student TO 'interviewer_user'@'localhost';
`

export const GRANT_INTERVIEWER_FEEDBACK = `
GRANT SELECT, INSERT, UPDATE ON interview_scheduler.feedback TO 'interviewer_user'@'localhost';
`

export const GRANT_INTERVIEWER_SLOT = `
GRANT SELECT, UPDATE ON interview_scheduler.interview_slot TO 'interviewer_user'@'localhost';
`

export const GRANT_INTERVIEWER_SELECT_SELF = `
GRANT SELECT ON interview_scheduler.interviewer TO 'interviewer_user'@'localhost';
`

export const CREATE_STUDENT_USER = `
CREATE USER IF NOT EXISTS 'student_user'@'localhost' IDENTIFIED BY 'student_password';
`

export const GRANT_STUDENT_SLOT = `
GRANT SELECT ON interview_scheduler.interview_slot TO 'student_user'@'localhost';
`

export const GRANT_STUDENT_SELF = `
GRANT SELECT, UPDATE ON interview_scheduler.student TO 'student_user'@'localhost';
`

export const GRANT_STUDENT_FEEDBACK = `
GRANT SELECT ON interview_scheduler.feedback TO 'student_user'@'localhost';
`

export const FLUSH_PRIVILEGES = `
FLUSH PRIVILEGES;
`
