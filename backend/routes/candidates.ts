export async function candidates(req: Request, pool: any, corsHeaders: any) {
    if (req.method === "GET") {
        try {
            // Fetch all students
            const [rows] = await pool.execute(
                `SELECT 
                    id,
                    fullname,
                    username,
                    dob,
                    year_of_passing,
                    srn,
                    branch,
                    semester,
                    cgpa,
                    marks_10,
                    marks_12, 
                    father_name,
                    mother_name,
                    address,
                    email,
                    contact,
                    created_at,
                    updated_at
                FROM student`
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
