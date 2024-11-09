export async function interviewerProfile(req: Request, pool: any, corsHeaders: any) {
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

            // Fetch interviewer profile
            const [rows] = await pool.execute(
                `SELECT 
                    id,
                    username,
                    fullname,
                    email
                FROM interviewer 
                WHERE username = ?`,
                [username]
            )

            if (!rows || rows.length === 0) {
                return Response.json(
                    {
                        success: false,
                        error: "Interviewer not found",
                    },
                    { status: 404, headers: corsHeaders }
                )
            }

            return Response.json(rows[0], { headers: corsHeaders })
        } catch (err) {
            console.error("Error fetching interviewer profile:", err)
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
