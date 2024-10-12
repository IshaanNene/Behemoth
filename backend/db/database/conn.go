package database

import (
	"fmt"
	"log"
	"os"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"
	"gorm.io/gorm/schema"
)

var DB *gorm.DB

// ConnectDB initializes the database connection
func ConnectDB() {
	var err error

	// Load database credentials from environment variables
	host := os.Getenv("DB_HOST")
	user := os.Getenv("DB_USER")
	password := os.Getenv("DB_PASSWORD")
	dbName := os.Getenv("DB_NAME")
	port := os.Getenv("DB_PORT")

	// Connection string for PostgreSQL
	dsn := fmt.Sprintf("host=%s user=%s password=%s dbname=%s port=%s sslmode=disable TimeZone=Asia/Kolkata", host, user, password, dbName, port)

	// Configure GORM with PostgreSQL
	DB, err = gorm.Open(postgres.Open(dsn), &gorm.Config{
		Logger: logger.Default.LogMode(logger.Info), // Optional: Show detailed logs
		NamingStrategy: schema.NamingStrategy{
			SingularTable: true, // Use singular table names
		},
	})

	if err != nil {
		log.Fatalf("Failed to connect to the database: %v", err)
	}

	log.Println("Database connection established")
}

// GetDB returns the current database connection
func GetDB() *gorm.DB {
	return DB
}
