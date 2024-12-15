export async function candidateProfileJoin(req: Request, pool: any, corsHeaders: any) {
    if (req.method === "GET") {
        try {
            const url = new URL(req.url)
            const interviewerId = url.searchParams.get("interviewerId")

            if (!interviewerId) {
                return Response.json(
                    { success: false, error: "Interviewer ID is required" },
                    { status: 400, headers: corsHeaders }
                )
            }

            // Fetch all students with their interview slot information
            const [rows] = await pool.execute(
                `SELECT 
                    s.*,
                    CASE 
                        WHEN sl.id IS NOT NULL THEN TRUE
                        ELSE FALSE
                    END as has_interview,
                    sl.id as slot_id,
                    sl.scheduled_time,
                    sl.status as slot_status
                FROM student s
                LEFT JOIN interview_slot sl ON s.id = sl.student_id 
                    AND sl.interviewer_id = ?
                ORDER BY sl.scheduled_time DESC`,
                [interviewerId]
            )

            if (!rows || rows.length === 0) {
                return Response.json(
                    {
                        success: false,
                        error: "No students found",
                    },
                    { status: 404, headers: corsHeaders }
                )
            }

            return Response.json(
                {
                    success: true,
                    candidates: rows,
                },
                { headers: corsHeaders }
            )
        } catch (err) {
            console.error("Error fetching candidates:", err)
            return Response.json(
                {
                    success: false,
                    error: "Internal server error",
                },
                { status: 500, headers: corsHeaders }
            )
        }
    }
    return new Response("Method not allowed", { status: 405, headers: corsHeaders })
}
