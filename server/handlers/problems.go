package handlers

import (
	"fmt"
	"log"
	"net/http"
	"os"
	"strconv"
	"time"

	"server/model"
	"server/model/handler"
	"server/model/query"
	"server/utils"

	"github.com/gin-gonic/gin"
)

func ListProblems(c *gin.Context) {
	if ok, err := handler.IsOk(); !ok {
		c.String(http.StatusInternalServerError, "internal error: %s", err)
	}
	problems, err := query.GetProblems(handler.GetDb())
	if err != nil {
		fmt.Fprintf(os.Stderr, "error:%s\n", err.Error())
		c.String(http.StatusInternalServerError, "error: requested resource not found")
		return
	}
	c.JSON(http.StatusOK, problems)
}

func GetProblem(c *gin.Context) {
	if ok, err := handler.IsOk(); !ok {
		c.String(http.StatusInternalServerError, "internal error: %s", err)
	}
	num, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.String(http.StatusBadRequest, "error: invalid query parameter")
		return
	}
	problem, err := query.GetProblem(handler.GetDb(), num)
	if err != nil {
		fmt.Fprintf(os.Stderr, "error:%s\n", err.Error())
		c.String(http.StatusNotFound, "error: requested resource not found")
		return
	}
	c.JSON(http.StatusOK, problem)
}

func AddProblem(c *gin.Context) {
	jwt, err := c.Cookie("auth")
	if len(jwt) == 0 || err == http.ErrNoCookie {
		c.Status(http.StatusUnauthorized)
		return
	}
	user, err := utils.ValidateToken(jwt)
	if err != nil {
		c.String(http.StatusUnauthorized, "error: invalid auth token")
		return
	}
	if !user.IsAdmin {
		c.String(http.StatusUnauthorized, "error: unauthorized access")
		return
	}
	problem := model.Problem{}
	err = c.ShouldBindJSON(&problem)
	if err != nil {
		c.String(http.StatusBadRequest, "error: invalid request.")
		return
	}
	err = query.InsertProblem(handler.GetDb(), &problem)
	if err != nil {
		c.String(http.StatusInternalServerError, "error: could not add resource")
		log.Println(time.Now().String() + err.Error())
		return
	}
	c.String(http.StatusOK, "added problem")
}
