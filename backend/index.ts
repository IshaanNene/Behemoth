import { serve } from "bun"
import mysql from "mysql2/promise"
import { join } from "path"
import { file } from "bun"
import {
    CREATE_ADMINS_TABLE,
    CREATE_INTERVIEWERS_TABLE,
    CREATE_INTERVIEWS_TABLE,
    CREATE_STUDENTS_TABLE,
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

        const tables = [CREATE_STUDENTS_TABLE, CREATE_INTERVIEWERS_TABLE, CREATE_ADMINS_TABLE, CREATE_INTERVIEWS_TABLE]

        for (const table of tables) {
            await connection.query(table)
        }

        connection.release()
        console.log("Database tables initialized successfully")
    } catch (err) {
        console.error("Error initializing database tables:", err)
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
                        const { username, password } = body

                        // Query to check user credentials
                        const [results] = await pool.execute(
                            "SELECT * FROM users WHERE username = ? AND password = ?",
                            [username, password]
                        )

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
                                    message: "Invalid username or password",
                                },
                                { status: 401, headers: corsHeaders }
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
        return new Response("Internal Server Error", { status: 500, headers: corsHeaders })
    },
})

console.log(`Server running at http://localhost:${server.port}`)
