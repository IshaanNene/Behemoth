import { serve } from "bun"
import mysql from "mysql2/promise"
import { join } from "path"
import { file } from "bun"
import {
    CREATE_ADMINS_TABLE,
    CREATE_INTERVIEWERS_TABLE,
    CREATE_STUDENTS_TABLE,
    CREATE_FEEDBACK_TABLE,
    CREATE_INTERVIEW_SLOTS_TABLE,
    CREATE_FEEDBACK_TRIGGER,
    FLUSH_PRIVILEGES,
    GRANT_STUDENT_PRIVILEGES,
    CREATE_STUDENT_USER,
    GRANT_INTERVIEWER_PRIVILEGES,
    CREATE_INTERVIEWER_USER,
    GRANT_ADMIN_PRIVILEGES,
    CREATE_ADMIN_USER,
    GRANT_STUDENT_FEEDBACK,
    GRANT_STUDENT_SELF,
    GRANT_STUDENT_SLOT,
    GRANT_INTERVIEWER_SELECT_SELF,
    GRANT_INTERVIEWER_SLOT,
    GRANT_INTERVIEWER_FEEDBACK,
    GRANT_INTERVIEWER_SELECT_STUDENT,
} from "./queries"
import {
    login,
    editProfile,
    studentProfile,
    interviewerProfile,
    candidates,
    scheduleInterview,
    candidateProfileJoin,
    provideFeedback,
} from "./routes"

// Database connection pool
const pool = mysql.createPool({
    host: "junction.proxy.rlwy.net",
    port: 26523,
    user: "root",
    password: "GzSIqTzJJmJyeosAjwghQDRtvSQpBJXy",
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
        // await connection.query("DROP TABLE IF EXISTS student")
        // await connection.query("DROP TABLE IF EXISTS interviewer")
        // await connection.query("DROP TABLE IF EXISTS admin")

        // Recreate tables
        const tables = [
            // tables
            CREATE_STUDENTS_TABLE,
            CREATE_INTERVIEWERS_TABLE,
            CREATE_ADMINS_TABLE,
            CREATE_FEEDBACK_TABLE,
            CREATE_INTERVIEW_SLOTS_TABLE,

            // triggers
            CREATE_FEEDBACK_TRIGGER,

            CREATE_ADMIN_USER,
            GRANT_ADMIN_PRIVILEGES,
            CREATE_INTERVIEWER_USER,
            GRANT_INTERVIEWER_SELECT_STUDENT,
            GRANT_INTERVIEWER_FEEDBACK,
            GRANT_INTERVIEWER_SLOT,
            GRANT_INTERVIEWER_SELECT_SELF,
            CREATE_STUDENT_USER,
            GRANT_STUDENT_SLOT,
            GRANT_STUDENT_SELF,
            GRANT_STUDENT_FEEDBACK,
            FLUSH_PRIVILEGES,
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
                return login(req, pool, corsHeaders)

            case "/edit-profile":
                return editProfile(req, pool, corsHeaders)

            case "/student-profile":
                return studentProfile(req, pool, corsHeaders)

            case "/interviewer-profile":
                return interviewerProfile(req, pool, corsHeaders)

            case "/candidates":
                return candidates(req, pool, corsHeaders)

            case "/candidate-profile-join":
                return candidateProfileJoin(req, pool, corsHeaders)

            case "/schedule-interview":
                return scheduleInterview(req, pool, corsHeaders)

            case "/provide-feedback":
                return provideFeedback(req, pool, corsHeaders)

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
