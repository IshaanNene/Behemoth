export async function scheduleInterview(req: Request, pool: any, corsHeaders: any) {
    if (req.method === "POST") {
        try {
            const body = await req.json()
            const { studentId, interviewerId, scheduledTime } = body as {
                studentId: string
                interviewerId: string
                scheduledTime: string
            }

            if (!studentId || !interviewerId || !scheduledTime) {
                return Response.json(
                    {
                        success: false,
                        error: "Student id, interviewer id and scheduled time are required",
                    },
                    { status: 400, headers: corsHeaders }
                )
            }

            // Call the stored procedure
            const [results] = await pool.execute(
                "CALL schedule_interview(?, ?, ?, @interview_id, @success, @message)",
                [studentId, interviewerId, scheduledTime]
            )

            // Get the output parameters
            const [[outputParams]] = await pool.execute(
                "SELECT @interview_id as interviewId, @success as success, @message as message"
            )

            if (!outputParams.success) {
                return Response.json(
                    {
                        success: false,
                        error: outputParams.message,
                    },
                    { status: 400, headers: corsHeaders }
                )
            }

            return Response.json(
                {
                    success: true,
                    message: outputParams.message,
                    interviewId: outputParams.interviewId,
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
