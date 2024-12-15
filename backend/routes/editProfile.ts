export async function editProfile(req: Request, pool: any, corsHeaders: any) {
    if (req.method === "PUT") {
        try {
            const body = await req.json()
            const {
                username,
                name,
                email,
                srn,
                dob,
                fatherName,
                motherName,
                address,
                contact,
                yearOfPassing,
                branch,
                semester,
                cgpa,
            } = body

            // Update user profile
            await pool.execute(
                `UPDATE student SET 
                    fullname = ?,
                    dob = ?,
                    father_name = ?,
                    mother_name = ?,
                    address = ?,
                    email = ?,
                    contact = ?,
                    year_of_passing = ?,
                    srn = ?,
                    branch = ?,
                    semester = ?,
                    cgpa = ?
                WHERE username = ?`,
                [
                    name,
                    dob,
                    fatherName,
                    motherName,
                    address,
                    email,
                    contact,
                    yearOfPassing,
                    srn,
                    branch,
                    semester,
                    cgpa,
                    username,
                ]
            )

            console.log("Profile updated successfully")

            return Response.json(
                {
                    success: true,
                    message: "Profile updated successfully",
                },
                { headers: corsHeaders }
            )
        } catch (err) {
            console.error("Error executing query:", err)
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
