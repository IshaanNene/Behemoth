package models

import "gorm.io/gorm"

type Interview struct {
	gorm.Model
	CandidateSRN  string `json:"candidate_srn"`
	InterviewDate string `json:"interview_date"`
	InterviewerID string `json:"interviewer_id"`
	SlotID        uint   `json:"slot_id"`
}

type Feedback struct {
	gorm.Model
	CandidateSRN  string `json:"candidate_srn"`
	InterviewerID string `json:"interviewer_id"`
	Comments      string `json:"comments"`
	Score         int    `json:"score"`
}

type Candidate struct {
	gorm.Model
	SRN    string `json:"srn"`
	Name   string `json:"name"`
	Branch string `json:"branch"`
	Year   int    `json:"year"`
}

type InterviewSlot struct {
	gorm.Model
	Date      string `json:"date"`
	Time      string `json:"time"`
	Available bool   `json:"available"`
}
