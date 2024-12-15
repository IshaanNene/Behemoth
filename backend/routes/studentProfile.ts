export async function studentProfile(req: Request, pool: any, corsHeaders: any) {
    if (req.method === "GET") {
        try {
            const url = new URL(req.url)
            const username = url.searchParams.get("username")

            if (!username) {
                return Response.json(
                    {
                        success: false,
                        error: "Username is required",
                    },
                    { status: 400, headers: corsHeaders }
                )
            }

            // Fetch student profile
            const [rows] = await pool.execute(
                `SELECT 
                    id,
                    fullname as name,
                    dob as dateOfBirth,
                    year_of_passing as yearOfPassing,
                    srn,
                    branch,
                    semester,
                    cgpa,
                    marks_10 as tenthMarks,
                    marks_12 as twelfthMarks,
                    father_name as fatherName,
                    mother_name as motherName,
                    address,
                    email,
                    contact as contactNumber,
                    created_at,
                    updated_at
                FROM student 
                WHERE username = ?`,
                [username]
            )

            if (!rows || rows.length === 0) {
                return Response.json(
                    {
                        success: false,
                        error: "Student not found",
                    },
                    { status: 404, headers: corsHeaders }
                )
            }

            return Response.json(rows[0], { headers: corsHeaders })
        } catch (err) {
            console.error("Error fetching student profile:", err)
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
