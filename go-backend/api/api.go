package api

import (
	"Behemoth/backend/controllers"
	"github.com/gin-gonic/gin"
)

func SetupRouter() *gin.Engine {
	r := gin.Default()

	// Routes for students
	studentGroup := r.Group("/students")
	{
		studentGroup.POST("/register", controllers.RegisterStudent)
		studentGroup.GET("/:srn", controllers.ViewProfile)
		studentGroup.PUT("/edit/:srn", controllers.EditProfile)
		studentGroup.POST("/apply", controllers.ApplyForInterviews)
		studentGroup.GET("/feedback/:srn", controllers.ViewFeedback)
		studentGroup.GET("/track/:srn", controllers.TrackProgress)
	}

	// Routes for interviewers
	interviewerGroup := r.Group("/interviewers")
	{
		interviewerGroup.POST("/schedule", controllers.ScheduleInterview)
		interviewerGroup.POST("/feedback", controllers.ProvideFeedback)
		interviewerGroup.GET("/profiles", controllers.ViewCandidateProfiles)
		interviewerGroup.GET("/report", controllers.GenerateReport)
		interviewerGroup.POST("/slots", controllers.ManageInterviewSlots)
		interviewerGroup.GET("/feedback/history/:srn", controllers.ViewFeedbackHistory)
		interviewerGroup.POST("/communicate", controllers.CommunicateWithStudents)
	}

	return r
}
