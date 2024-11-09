-- Create admin user with full privileges
CREATE USER IF NOT EXISTS 'admin_user'@'localhost' IDENTIFIED BY 'admin_password';
GRANT ALL PRIVILEGES ON interview_scheduler.* TO 'admin_user'@'localhost';

-- Create interviewer user with limited privileges
CREATE USER IF NOT EXISTS 'interviewer_user'@'localhost' IDENTIFIED BY 'interviewer_password';

-- Interviewer privileges
GRANT SELECT ON interview_scheduler.student TO 'interviewer_user'@'localhost';
GRANT SELECT, INSERT, UPDATE ON interview_scheduler.feedback TO 'interviewer_user'@'localhost';
GRANT SELECT, UPDATE ON interview_scheduler.interview_slot TO 'interviewer_user'@'localhost';
GRANT SELECT ON interview_scheduler.interviewer TO 'interviewer_user'@'localhost';

-- Create student user with minimal privileges
CREATE USER IF NOT EXISTS 'student_user'@'localhost' IDENTIFIED BY 'student_password';

-- Student privileges
GRANT SELECT ON interview_scheduler.interview_slot TO 'student_user'@'localhost';
GRANT SELECT, UPDATE ON interview_scheduler.student TO 'student_user'@'localhost';
GRANT SELECT ON interview_scheduler.feedback TO 'student_user'@'localhost';

-- Apply privileges
FLUSH PRIVILEGES; 