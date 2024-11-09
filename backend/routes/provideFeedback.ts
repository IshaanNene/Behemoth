export async function provideFeedback(req: Request, pool: any, corsHeaders: any) {
    if (req.method === "POST") {
        try {
            const body = await req.json()
            const { studentUsername, interviewerUsername, comments } = body

            // Validate required fields
            if (!studentUsername || !interviewerUsername || !comments) {
                return Response.json(
                    {
                        success: false,
                        error: "Missing required fields",
                    },
                    { status: 400, headers: corsHeaders }
                )
            }

            // Get student ID and interviewer ID from usernames
            const [studentRows] = await pool.execute("SELECT id FROM student WHERE username = ?", [studentUsername])

            const [interviewerRows] = await pool.execute("SELECT id FROM interviewer WHERE username = ?", [
                interviewerUsername,
            ])

            if (studentRows.length === 0 || interviewerRows.length === 0) {
                return Response.json(
                    {
                        success: false,
                        error: "Student or interviewer not found",
                    },
                    { status: 404, headers: corsHeaders }
                )
            }

            const studentId = studentRows[0].id
            const interviewerId = interviewerRows[0].id

            // Insert feedback (status update will happen automatically via trigger)
            await pool.execute(
                `INSERT INTO feedback (
                    candidate_id,
                    interviewer_id,
                    comments
                ) VALUES (?, ?, ?)`,
                [studentId, interviewerId, comments]
            )

            return Response.json(
                {
                    success: true,
                    message: "Feedback submitted successfully",
                },
                { headers: corsHeaders }
            )
        } catch (err) {
            console.error("Error submitting feedback:", err)
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
