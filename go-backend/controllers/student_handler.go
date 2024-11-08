package controllers

import (
	"Behemoth/backend/db/database"
	"Behemoth/db/models"
	"github.com/gin-gonic/gin"
	"log"
	"net/http"
)

// InterviewApplication structure for interview applications
type InterviewApplication struct {
	Company       string `json:"company" binding:"required"`
	Position      string `json:"position" binding:"required"`
	PreferredDate string `json:"date" binding:"required"`
	PreferredTime string `json:"time" binding:"required"`
	Resume        string `json:"resume" binding:"required"`
}

// ApplyForInterviews handles applications for interviews
func ApplyForInterviews(c *gin.Context) {
	var application InterviewApplication
	if err := c.ShouldBind(&application); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	file, err := c.FormFile("resume")
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid file"})
		return
	}
	if err := c.SaveUploadedFile(file, "./uploads/"+file.Filename); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Unable to save file"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Application submitted successfully", "application": application})
}

// GetStudentBySRN retrieves a student by their SRN
func GetStudentBySRN(srn string) (*models.Student, error) {
	var student models.Student
	if err := database.DB.Where("srn = ?", srn).First(&student).Error; err != nil {
		return nil, err
	}
	return &student, nil
}

// ViewProfile displays the student's profile
func ViewProfile(c *gin.Context) {
	srn := c.Query("srn")
	student, err := GetStudentBySRN(srn)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Student not found"})
		return
	}
	c.HTML(http.StatusOK, "student/student_profile.html", student)
}

// RegisterStudent handles student registration
func RegisterStudent(c *gin.Context) {
	var student models.Student
	if err := c.ShouldBindJSON(&student); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if err := database.DB.Create(&student).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to register student"})
		return
	}
	log.Printf("Registered student: %+v", student)

	c.JSON(http.StatusOK, gin.H{"message": "Registration successful", "student": student})
}

// SupportRequest structure for support requests
type SupportRequest struct {
	Name    string `json:"name" binding:"required"`
	Email   string `json:"email" binding:"required,email"`
	Subject string `json:"subject" binding:"required"`
	Message string `json:"message" binding:"required"`
}

// ContactSupport handles support requests
func ContactSupport(c *gin.Context) {
	var request SupportRequest
	if err := c.ShouldBind(&request); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	log.Printf("Received support request: %+v", request)

	c.JSON(http.StatusOK, gin.H{"message": "Support request sent successfully", "request": request})
}

// EditProfileRequest structure for editing student profiles
type EditProfileRequest struct {
	Name       string `json:"name" binding:"required"`
	DOB        string `json:"dob" binding:"required"`
	FatherName string `json:"father_name" binding:"required"`
	MotherName string `json:"mother_name" binding:"required"`
	Address    string `json:"address" binding:"required"`
	Email      string `json:"email" binding:"required,email"`
	Contact    string `json:"contact" binding:"required"`
}

// EditProfile handles profile editing
func EditProfile(c *gin.Context) {
	var request EditProfileRequest
	if err := c.ShouldBindJSON(&request); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	srn := c.Query("srn")
	var student models.Student
	if err := database.DB.Where("srn = ?", srn).First(&student).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Student not found"})
		return
	}

	student.Name = request.Name
	student.DOB = request.DOB
	student.FatherName = request.FatherName
	student.MotherName = request.MotherName
	student.Address = request.Address
	student.Email = request.Email
	student.Contact = request.Contact

	if err := database.DB.Save(&student).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update profile"})
		return
	}

	log.Printf("Updated student profile: %+v", student)
	c.JSON(http.StatusOK, gin.H{"message": "Profile updated successfully", "profile": student})
}

// TrackProgress retrieves and displays the student's progress
func TrackProgress(c *gin.Context) {
	var progressData map[string]interface{}
	if err := database.DB.Raw("SELECT COUNT(*) as applications_sent FROM applications WHERE srn = ?", c.Query("srn")).Scan(&progressData).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to retrieve progress data"})
		return
	}
	c.HTML(http.StatusOK, "admin/track_progress.html", progressData)
}

// ViewFeedback retrieves and displays feedback for the student
func ViewFeedback(c *gin.Context) {
	var feedbackData []models.Feedback
	if err := database.DB.Where("student_srn = ?", c.Query("srn")).Find(&feedbackData).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to retrieve feedback"})
		return
	}

	c.HTML(http.StatusOK, "student/view_feedback.html", feedbackData)
}


