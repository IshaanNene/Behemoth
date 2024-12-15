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
    CREATE_STUDENT_USER,
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
    CREATE_DATABASE,
    USE_DATABASE,
    CREATE_SCHEDULE_INTERVIEW_PROCEDURE,
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

// mysql://root:LetgSNtgJEyMARVfQZQYeteTVduuSGaR@junction.proxy.rlwy.net:31853/railway
// Database connection pool
const pool = mysql.createPool({
    host: "junction.proxy.rlwy.net",
    port: 31853,
    user: "root",
    password: "LetgSNtgJEyMARVfQZQYeteTVduuSGaR",
    database: "railway",
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
})

// Create tables if they don't exist
const initDb = async () => {
    try {
        const connection = await pool.getConnection()

        // Create and use database first
        await connection.query(CREATE_DATABASE)
        await connection.query(USE_DATABASE)

        // Then create tables and other objects in correct order
        const setupSequence = [
            // Create tables first
            CREATE_STUDENTS_TABLE,
            CREATE_INTERVIEWERS_TABLE,
            CREATE_ADMINS_TABLE,
            CREATE_FEEDBACK_TABLE,
            CREATE_INTERVIEW_SLOTS_TABLE,

            // Then create trigger
            CREATE_FEEDBACK_TRIGGER,

            // Finally set up users and privileges
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

            // Add stored procedures
            CREATE_SCHEDULE_INTERVIEW_PROCEDURE,
        ]

        for (const query of setupSequence) {
            await connection.query(query)
        }

        connection.release()
        console.log(">>> Database initialized successfully\n")
    } catch (err) {
        console.error("Error initializing database:", err)
    }
}

// Initialize database tables
initDb()

// Serve static files
async function serveStatic(path: string) {
    const filePath = join(import.meta.dir, "..", path)
    try {
        const f = file(filePath)
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
