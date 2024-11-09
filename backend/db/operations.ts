import { pool } from './connection';

export async function getInterviewerStats() {
    const [rows] = await pool.execute(`
        SELECT 
            iv.fullname,
            COUNT(i.id) as total_interviews,
            AVG(f.score) as average_score,
            COUNT(CASE WHEN i.status = 'completed' THEN 1 END) as completed_interviews
        FROM interviewer iv
        LEFT JOIN interview i ON iv.id = i.interviewer_id
        LEFT JOIN feedback f ON iv.id = f.interviewer_id
        GROUP BY iv.id, iv.fullname
        HAVING total_interviews > 0
    `);
    return rows;
}

export async function scheduleInterview(candidateSrn: string, interviewerId: string, date: string, slotId: number) {
    const [result] = await pool.execute(
        'CALL schedule_interview(?, ?, ?, ?)',
        [candidateSrn, interviewerId, date, slotId]
    );
    return result;
}

// Add more database operations as needed 