package main

import (
	"Behemoth/backend/api"
	"Behemoth/backend/db/database"
	"log"
)

func main() {
	// Initialize database connection
	database.ConnectDB()

	// Setup the router
	router := api.SetupRouter()

	// Start the server
	if err := router.Run(":8080"); err != nil {
		log.Fatalf("Failed to start server: %v", err)
	}
}
