package main

import (
	"net/http"
	"fmt"
	"log"
	"os"

	"server/model/handler"
	"server/routes"
	"server/utils"

	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
)

func Initialize() error {
	var err error

	if err = godotenv.Load(); err != nil {
		log.Println(err)
		return err
	}
	if err = handler.Initialize(); err != nil {
		log.Println(err)
		return err
	}
	utils.SetSecretKey()
	return nil
}

func corsMiddleware(c *gin.Context) {
	allowedOrigin := "http://localhost:5173"
	c.Header("Access-Control-Allow-Origin", allowedOrigin)
	c.Header("Access-Control-Allow-Methods", "POST,GET,PUT,OPTIONS")
	c.Header("Access-Control-Allow-Credentials", "true")
	c.Header("Vary", "Origin")
	if c.Request.Method == "OPTIONS" {
		c.AbortWithStatus(http.StatusNoContent)
		return
	}
	c.Next()
}

func main() {
	Initialize()

	router := gin.Default()
	// router.Static("/app/", "../website/dist/")
	router.Use(corsMiddleware)
	routes.Routes(router)

	router.Run(fmt.Sprintf(":%s", os.Getenv("PORT")))
}
