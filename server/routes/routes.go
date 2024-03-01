package routes

import (
	"server/handlers"

	"github.com/gin-gonic/gin"
)

func Routes(router *gin.Engine) {
	router.GET("/api/ping", handlers.Ping)

	//Auth Routes
	router.POST("/api/user/login", handlers.Login)
	router.POST("/api/user/logout", handlers.Logout)
	router.PUT("/api/user/add", handlers.Register)

	//Problems Access Router
	router.GET("api/problem/list", handlers.ListProblems)
	router.GET("api/problem/:id", handlers.GetProblem)
	router.PUT("api/problem/add", handlers.AddProblem)

	//Submission Router
	router.POST("/api/submission/:id", handlers.Submit)
}