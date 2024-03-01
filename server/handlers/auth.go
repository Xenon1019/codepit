package handlers

import (
	"fmt"
	"log"
	"net/http"
	"time"

	"server/model"
	"server/model/handler"
	"server/model/query"
	"server/utils"

	"github.com/gin-gonic/gin"
	"golang.org/x/crypto/bcrypt"
	// "go.mongodb.org/mongo-driver/mongo/options"
)

const (
	TimeToExpire = 7 * 24 * 3600
	PreviousTime = "Thu, 01 Jan 1970 00:00:00 GMT"
)

func Login(c *gin.Context) {
	if ok, err := handler.IsOk(); !ok {
		c.String(http.StatusInternalServerError, "error:internal server error: %s", err)
	}
	var user struct {
		Username string `json:"username"`
		Password string `json:"password"`
	}
	if err := c.ShouldBindJSON(&user); err != nil {
		c.String(http.StatusBadRequest, "error bad request\nerror:%s", err)
		return
	}
	userData, code := query.ValidateUser(handler.GetDb(), user.Username, user.Password)

	switch code {
	case query.CodeUsernameNotExists:
		c.String(http.StatusUnauthorized, "error:username does not exists")
		return
	case query.CodeInvalidPassword:
		c.String(http.StatusUnauthorized, "error:username and password does not match")
		return
	case query.CodeUnknownError:
		c.String(http.StatusInternalServerError, "error:something went wrong")
		return
	case query.CodeSucessfullyValidated:
		jwtTokenString, err := utils.CreateJwtToken(&userData.UserHeader)
		if err != nil {
			log.Printf("%v:error: error while creating jwt token", time.Now())
			c.String(http.StatusInternalServerError, "error: something went wrong")
			return
		}
		c.Header("Set-Cookie", fmt.Sprintf("auth=%v; Max-Age=%v; SameSite=Strict; Path=/api/; HttpOnly", jwtTokenString, TimeToExpire))
		c.JSON(http.StatusOK, userData)
		return
	}
}

func Logout(c *gin.Context) {
	c.Header("Set-Cookie", "auth=\"\"; SameSite=Strict; Path=/api/; HttpOnly")
	c.Status(http.StatusOK)
}

func Register(c *gin.Context) {
	user := struct {
		Name     string `json:"name"`
		Username string `json:"username"`
		Email    string `json:"email"`
		Password string `json:"password"`
	}{}
	if err := c.ShouldBindJSON(&user); err != nil {
		c.String(http.StatusBadRequest, `error: expects JSON with fields "name", "username", "email", "password"`)
		return
	}
	if !utils.IsCorrectEmail(user.Email) {
		c.String(http.StatusBadRequest, "error: invalid email")
		return
	}
	if (len(user.Name) <= 2) {
		c.String(http.StatusBadRequest, "error: name to short")
	}

	switch query.HasUsernameOrEmail(handler.GetDb(), user.Username, user.Email) {
	case query.EmailExists:
		c.String(http.StatusConflict, "error: email already exists")
		return
	case query.UserNameExists:
		c.String(http.StatusConflict, "error: username already exists")
		return
	case query.SomthingWentWrong:
		c.String(http.StatusInternalServerError, "error: something went wrong")
		t := time.Now().String()
		log.Printf("%s: error: something went wrong\n", t)
		log.Printf("%s: error: while checking for existing username or email in db\n", t)
		return
	}

	newUser := genUser()
	passwordHash, err := bcrypt.GenerateFromPassword([]byte(user.Password), bcrypt.DefaultCost)
	if err != nil {
		log.Printf("%s:error: could not hash password\n", time.Now().String())
		c.String(http.StatusInternalServerError, "error: somthing went wrong, please try again later")
		return
	}
	newUser.PasswordHash = string(passwordHash)
	newUser.Username = user.Username
	newUser.Email = user.Email
	newUser.Name = user.Name

	err = query.InsertUser(handler.GetDb(), newUser)
	if err != nil {
		log.Printf("error: %s\n", err.Error())
		c.String(http.StatusInternalServerError, "error: somthing went wrong")
		return
	}
	c.Status(http.StatusOK)
}

func genUser() *model.User {
	return &model.User{
		CreatedOn:      time.Now(),
		SolvedProblems: []int32{},
		UserHeader: model.UserHeader{
			IsAdmin: false,
		},
	}
}

func Ping(c *gin.Context) {
	jwt, err := c.Cookie("auth")
	if len(jwt) == 0 || err == http.ErrNoCookie {
		c.Status(http.StatusUnauthorized)
		return
	}
	jwtClaims, ok := utils.ValidateToken(jwt)
	if ok != nil {
		c.String(http.StatusUnauthorized, ok.Error())
		return
	}
	user, err := query.GetUserProblems(handler.GetDb(), jwtClaims)
	if err != nil {
		c.String(http.StatusUnauthorized, "error:%s", err.Error())
		return
	}
	c.JSON(http.StatusOK, user)
}
