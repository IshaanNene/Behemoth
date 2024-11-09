export async function scheduleInterview(req: Request, pool: any, corsHeaders: any) {
    if (req.method === "POST") {
        try {
            const body = await req.json()
            const { studentId, interviewerId, scheduledTime } = body as {
                studentId: string
                interviewerId: string
                scheduledTime: string
            }

            console.log({ studentId, interviewerId, scheduledTime })

            if (!studentId || !interviewerId || !scheduledTime) {
                return Response.json(
                    {
                        success: false,
                        error: "Student id, interviewer id and scheduled time are required",
                    },
                    { status: 400, headers: corsHeaders }
                )
            }

            // Verify student exists
            const [students] = await pool.execute("SELECT id FROM student WHERE id = ?", [studentId])

            if (!students || students.length === 0) {
                return Response.json(
                    {
                        success: false,
                        error: "Student not found",
                    },
                    { status: 404, headers: corsHeaders }
                )
            }

            // Verify interviewer exists
            const [interviewers] = await pool.execute("SELECT id FROM interviewer WHERE id = ?", [interviewerId])

            if (!interviewers || interviewers.length === 0) {
                return Response.json(
                    {
                        success: false,
                        error: "Interviewer not found",
                    },
                    { status: 404, headers: corsHeaders }
                )
            }

            // Schedule the interview
            const interviewId = Math.random().toString(36).substr(2, 9)
            await pool.execute(
                `INSERT INTO interview_slot (id, student_id, interviewer_id, scheduled_time, status) 
                VALUES (?, ?, ?, ?, ?)`,
                [interviewId, studentId, interviewerId, scheduledTime, "scheduled"]
            )

            return Response.json(
                {
                    success: true,
                    message: "Interview scheduled successfully",
                    interviewId,
                },
                { headers: corsHeaders }
            )
        } catch (err) {
            console.error("Error scheduling interview:", err)
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
