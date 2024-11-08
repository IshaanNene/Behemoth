import { serve } from "bun"
import mysql from "mysql2/promise"
import { join } from "path"
import { file } from "bun"
import {
    CREATE_ADMINS_TABLE,
    CREATE_INTERVIEWERS_TABLE,
    CREATE_INTERVIEWS_TABLE,
    CREATE_STUDENTS_TABLE,
    CREATE_FEEDBACK_TABLE,
    CREATE_INTERVIEW_SLOTS_TABLE,
} from "./queries"

// mysql://root:uGrAydpKmiGsVQAyyEAfcAzZLMiePrkC@autorack.proxy.rlwy.net:37165/railway
// Database connection pool
const pool = mysql.createPool({
    host: "autorack.proxy.rlwy.net",
    port: 37165,
    user: "root",
    password: "uGrAydpKmiGsVQAyyEAfcAzZLMiePrkC",
    database: "railway",
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
})

// Create tables if they don't exist
const initDb = async () => {
    try {
        const connection = await pool.getConnection()

        // Drop all existing tables first
        // await connection.query("DROP TABLE IF EXISTS feedback")
        // await connection.query("DROP TABLE IF EXISTS interview_slot")
        // await connection.query("DROP TABLE IF EXISTS interview")
        // await connection.query("DROP TABLE IF EXISTS student")
        // await connection.query("DROP TABLE IF EXISTS interviewer")
        // await connection.query("DROP TABLE IF EXISTS admin")

        // Recreate tables
        const tables = [
            CREATE_STUDENTS_TABLE,
            CREATE_INTERVIEWERS_TABLE,
            CREATE_ADMINS_TABLE,
            CREATE_INTERVIEWS_TABLE,
            CREATE_FEEDBACK_TABLE,
            CREATE_INTERVIEW_SLOTS_TABLE,
        ]

        for (const table of tables) {
            await connection.query(table)
        }

        connection.release()
        console.log(">>> Database tables dropped and recreated successfully\n")
    } catch (err) {
        console.error("Error reinitializing database tables:", err)
    }
}

// Initialize database tables
initDb()

// Serve static files
async function serveStatic(path: string) {
    const filePath = join(import.meta.dir, "..", path)
    try {
        const f = await file(filePath)
        return new Response(f)
    } catch (err) {
        return new Response("File not found", { status: 404 })
    }
}

// CORS headers
const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
}

const server = serve({
    port: process.env.PORT || 6969,
    async fetch(req) {
        const url = new URL(req.url)

        // Handle CORS preflight requests
        if (req.method === "OPTIONS") {
            return new Response(null, {
                headers: corsHeaders,
            })
        }

        // Handle static files
        if (url.pathname.startsWith("/static/")) {
            const response = await serveStatic(url.pathname)
            return new Response(response.body, {
                status: response.status,
                headers: { ...response.headers, ...corsHeaders },
            })
        }

        // Routes
        switch (url.pathname) {
            case "/":
                return Response.json({ message: "Hello, World!" }, { headers: corsHeaders })

            case "/login":
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

            default:
                return new Response("Not found", { status: 404, headers: corsHeaders })
        }
    },
    error(error) {
        console.error(error)
        return Response.json(
            {
                success: false,
                message: "Internal Server Error",
            },
            { status: 500, headers: corsHeaders }
        )
    },
})

console.log(`Server running at http://localhost:${server.port}`)
