package controllers

import (
	"Behemoth/backend/db"        // Import your database package
	"Behemoth/backend/db/models" // Import your models package
	"errors"
	"fmt"
	"github.com/gin-gonic/gin"
	"net/http"
)

// ScheduleInterview handles scheduling an interview
func ScheduleInterview(c *gin.Context) {
	var request struct {
		CandidateID   string `json:"candidate_id" binding:"required"`
		InterviewTime string `json:"interview_time" binding:"required"`
		InterviewerID string `json:"interviewer_id" binding:"required"`
	}

	if err := c.ShouldBindJSON(&request); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Create a new interview entry
	interview := models.Interview{
		CandidateID:   request.CandidateID,
		InterviewTime: request.InterviewTime,
		InterviewerID: request.InterviewerID,
	}

	if err := db.GetDB().Create(&interview).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to schedule interview"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Interview scheduled successfully"})
}

// ProvideFeedback handles providing feedback for a candidate
func ProvideFeedback(c *gin.Context) {
	var feedback struct {
		CandidateID   string `json:"candidate_id" binding:"required"`
		InterviewerID string `json:"interviewer_id" binding:"required"`
		Comments      string `json:"comments"`
		Score         int    `json:"score" binding:"required,min=1,max=10"`
	}

	if err := c.ShouldBindJSON(&feedback); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Create a new feedback entry
	newFeedback := models.Feedback{
		CandidateID:   feedback.CandidateID,
		InterviewerID: feedback.InterviewerID,
		Comments:      feedback.Comments,
		Score:         feedback.Score,
	}

	if err := db.GetDB().Create(&newFeedback).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to provide feedback"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Feedback submitted successfully"})
}

// ViewCandidateProfiles handles retrieving candidate profiles
func ViewCandidateProfiles(c *gin.Context) {
	var candidates []models.Candidate // Assuming you have a Candidate model

	if err := db.GetDB().Find(&candidates).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to retrieve candidates"})
		return
	}

	c.JSON(http.StatusOK, candidates)
}

// GenerateReport handles generating reports for interviews
func GenerateReport(c *gin.Context) {
	var reports []models.Interview // Assuming you have an Interview model

	if err := db.GetDB().Find(&reports).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to generate report"})
		return
	}

	c.JSON(http.StatusOK, reports)
}

// ManageInterviewSlots handles managing interview slots
func ManageInterviewSlots(c *gin.Context) {
	var request struct {
		SlotID        string `json:"slot_id" binding:"required"`
		InterviewerID string `json:"interviewer_id" binding:"required"`
		Action        string `json:"action" binding:"required"` // e.g., "add", "remove"
	}

	if err := c.ShouldBindJSON(&request); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	switch request.Action {
	case "add":
		// Logic to add a new interview slot
		newSlot := models.InterviewSlot{ // Assuming you have an InterviewSlot model
			SlotID:        request.SlotID,
			InterviewerID: request.InterviewerID,
		}
		if err := db.GetDB().Create(&newSlot).Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to add interview slot"})
			return
		}
		c.JSON(http.StatusOK, gin.H{"message": "Interview slot added successfully"})

	case "remove":
		// Logic to remove an interview slot
		if err := db.GetDB().Where("slot_id = ?", request.SlotID).Delete(&models.InterviewSlot{}).Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to remove interview slot"})
			return
		}
		c.JSON(http.StatusOK, gin.H{"message": "Interview slot removed successfully"})

	default:
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid action"})
	}
}

// ViewFeedbackHistory handles retrieving the feedback history for a candidate
func ViewFeedbackHistory(c *gin.Context) {
	srn := c.Param("srn")
	var feedbackHistory []models.Feedback // Assuming you have a Feedback model

	if err := db.GetDB().Where("candidate_id = ?", srn).Find(&feedbackHistory).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to retrieve feedback history"})
		return
	}

	c.JSON(http.StatusOK, feedbackHistory)
}

func CommunicateWithStudents(c *gin.Context) {
	var request struct {
		CandidateID string `json:"candidate_id" binding:"required"`
		Message     string `json:"message" binding:"required"`
	}

	if err := c.ShouldBindJSON(&request); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	err := SendMessageToStudent(request.CandidateID, request.Message)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to send message"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Message sent successfully to student"})
}

func SendMessageToStudent(candidateID, message string) error {
	if candidateID == "" || message == "" {
		return errors.New("invalid candidate ID or message")
	}

	fmt.Printf("Sending message to Candidate %s: %s\n", candidateID, message)
	return nil
}
