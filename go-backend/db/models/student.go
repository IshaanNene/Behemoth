package models

import (
	"gorm.io/gorm"
)

type Student struct {
	gorm.Model
	Name          string  `json:"name" gorm:"not null"`
	DOB           string  `json:"dob" gorm:"not null"`
	YearOfPassing int     `json:"year_of_passing" gorm:"not null"`
	PRN           string  `json:"prn" gorm:"unique;not null"`
	SRN           string  `json:"srn" gorm:"primaryKey"`
	Branch        string  `json:"branch" gorm:"not null"`
	Program       string  `json:"program" gorm:"not null"`
	Semester      int     `json:"semester" gorm:"not null"`
	CGPA          float64 `json:"cgpa" gorm:"not null"`
	Marks10       float64 `json:"marks_10" gorm:"not null"`
	Marks12       float64 `json:"marks_12" gorm:"not null"`
	FatherName    string  `json:"father_name" gorm:"not null"`
	MotherName    string  `json:"mother_name" gorm:"not null"`
	Address       string  `json:"address" gorm:"not null"`
	Email         string  `json:"email" gorm:"not null"`
	Contact       string  `json:"contact" gorm:"not null"`
	Resume        string  `json:"resume" gorm:"not null"`
}
