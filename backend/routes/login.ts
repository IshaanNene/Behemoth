export async function login(req: Request, pool: any, corsHeaders: any) {
    if (req.method === "POST") {
        try {
            const body = await req.json()
            const { username, password, selectedRole } = body as {
                username: string
                password: string
                selectedRole: string
            }

            // First check if user exists
            const [existingUsers] = (await pool.execute(
                `SELECT * FROM ${selectedRole.toLowerCase()} WHERE username = ?`,
                [username]
            )) as any

            console.log("EXISTING USERS:", existingUsers)

            if (existingUsers.length > 0) {
                // User exists, verify password
                const [results] = (await pool.execute(
                    `SELECT * FROM ${selectedRole.toLowerCase()} WHERE username = ? AND password = ?`,
                    [username, password]
                )) as any

                console.log("RESULTS:", results)

                if (results.length > 0) {
                    const user = results[0]
                    return Response.json(
                        {
                            success: true,
                            role: user.role,
                            message: "Login successful",
                        },
                        { headers: corsHeaders }
                    )
                } else {
                    return Response.json(
                        {
                            success: false,
                            message: "Invalid password",
                        },
                        { status: 401, headers: corsHeaders }
                    )
                }
            } else {
                // Create new user
                const id = Math.random().toString(36).substr(2, 9)
                await pool.execute(
                    `INSERT INTO ${selectedRole.toLowerCase()} (id, username, password) VALUES (?, ?, ?)`,
                    [id, username, password]
                )

                return Response.json(
                    {
                        success: true,
                        message: "Account created and logged in successfully",
                    },
                    { headers: corsHeaders }
                )
            }
        } catch (err) {
            console.error("Error executing query:", err)
            return Response.json({ error: "Internal server error" }, { status: 500, headers: corsHeaders })
        }
    }
    return new Response("Method not allowed", { status: 405, headers: corsHeaders })
}
