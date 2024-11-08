package main

import (
	"html/template"
	"net/http"
)

// AdminData holds the data structure for rendering admin-related templates.
type AdminData struct {
	Title string
}

// RenderAdminTemplate renders the specified admin HTML template.
func RenderAdminTemplate(w http.ResponseWriter, tmpl string, data AdminData) {
	t, err := template.ParseFiles("static/admin/" + tmpl)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	err = t.Execute(w, data)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
	}
}

// AdminDashboard handles the admin dashboard requests.
func AdminDashboard(w http.ResponseWriter, r *http.Request) {
	data := AdminData{Title: "Admin Dashboard"}
	RenderAdminTemplate(w, "admin.html", data)
}

// UserManagement handles the user management page requests.
func UserManagement(w http.ResponseWriter, r *http.Request) {
	data := AdminData{Title: "User Management"}
	RenderAdminTemplate(w, "user-management.html", data)
}

// InterviewManagement handles the interview management page requests.
func InterviewManagement(w http.ResponseWriter, r *http.Request) {
	data := AdminData{Title: "Interview Management"}
	RenderAdminTemplate(w, "interview-management.html", data)
}

// ManageFeedbackTemplates handles the feedback templates management page requests.
func ManageFeedbackTemplates(w http.ResponseWriter, r *http.Request) {
	data := AdminData{Title: "Manage Feedback Templates"}
	RenderAdminTemplate(w, "manage-feedback-templates.html", data)
}

// AnalyticsAndReporting handles the analytics and reporting page requests.
func AnalyticsAndReporting(w http.ResponseWriter, r *http.Request) {
	data := AdminData{Title: "Analytics and Reporting"}
	RenderAdminTemplate(w, "analytics-and-reporting.html", data)
}

// ViewAndExportData handles the view and export data page requests.
func ViewAndExportData(w http.ResponseWriter, r *http.Request) {
	data := AdminData{Title: "View and Export Data"}
	RenderAdminTemplate(w, "view-and-export-data.html", data)
}

// CommunicationManagement handles the communication management page requests.
func CommunicationManagement(w http.ResponseWriter, r *http.Request) {
	data := AdminData{Title: "Communication Management"}
	RenderAdminTemplate(w, "communication-management.html", data)
}

// SystemConfigurations handles the system configurations page requests.
func SystemConfigurations(w http.ResponseWriter, r *http.Request) {
	data := AdminData{Title: "System Configurations"}
	RenderAdminTemplate(w, "system-configurations.html", data)
}

// AuditLogs handles the audit logs page requests.
func AuditLogs(w http.ResponseWriter, r *http.Request) {
	data := AdminData{Title: "Audit Logs"}
	RenderAdminTemplate(w, "audit-logs.html", data)
}

// SupportAndIssueResolution handles the support and issue resolution page requests.
func SupportAndIssueResolution(w http.ResponseWriter, r *http.Request) {
	data := AdminData{Title: "Support and Issue Resolution"}
	RenderAdminTemplate(w, "support-and-issue-resolution.html", data)
}

func main() {
	http.HandleFunc("/admin", AdminDashboard)
	http.HandleFunc("/admin/user-management", UserManagement)
	http.HandleFunc("/admin/interview-management", InterviewManagement)
	http.HandleFunc("/admin/manage-feedback-templates", ManageFeedbackTemplates)
	http.HandleFunc("/admin/analytics-and-reporting", AnalyticsAndReporting)
	http.HandleFunc("/admin/view-and-export-data", ViewAndExportData)
	http.HandleFunc("/admin/communication-management", CommunicationManagement)
	http.HandleFunc("/admin/system-configurations", SystemConfigurations)
	http.HandleFunc("/admin/audit-logs", AuditLogs)
	http.HandleFunc("/admin/support-and-issue-resolution", SupportAndIssueResolution)

	http.ListenAndServe(":8080", nil)
}
