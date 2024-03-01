package utils

import (
	"crypto/sha256"
	"log"
	// "errors"
	"fmt"
	"os"
	"regexp"

	"time"

	"server/model"

	"github.com/golang-jwt/jwt/v5"
)

const DaysToExpire = 7

var secretKey []byte

func SetSecretKey() {
	//Todo: change back the set secret key to be different every time server is started.
	//      unlike the current seed approach.
	seed := os.Getenv("SEED")
	if len(seed) == 0 {
		log.Fatalln("error: seed value not set in .env")
	}
	secret := sha256.Sum256([]byte(seed))
	secretKey = secret[:]
}

type UserClaims struct {
	jwt.RegisteredClaims
	Email    string `json:"email"`
	Username string `json:"username"`
	Name     string `json:"name"`
	IsAdmin  bool   `json:"is_admin"`
}

func CreateJwtToken(user *model.UserHeader) (string, error) {
	claims := UserClaims{
		Email:    user.Email,
		Username: user.Username,
		IsAdmin:  user.IsAdmin,
		Name: user.Name,
		RegisteredClaims: jwt.RegisteredClaims{
			Issuer:    "server",
			IssuedAt:  jwt.NewNumericDate(time.Now()),
			NotBefore: jwt.NewNumericDate(time.Now()),
			ExpiresAt: jwt.NewNumericDate(time.Now().AddDate(0, 0, DaysToExpire)),
			Audience:  []string{"server"},
			ID:        "0",
			Subject:   "user",
		},
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, &claims)

	signedToken, err := token.SignedString(secretKey)
	if err != nil {
		return "", err
	}
	return signedToken, nil
}

func ValidateToken(token string) (*model.UserHeader, error) {
	tk, err := jwt.ParseWithClaims(token, &UserClaims{}, func(tk *jwt.Token) (interface{}, error) {
		if _, ok := tk.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fmt.Errorf("error: unexpected signing method")
		}
		return secretKey, nil
	})
	if err != nil {
		return nil, err
	}
	claims, ok := tk.Claims.(*UserClaims)
	if !ok {
		return nil, fmt.Errorf("error: invalid claims")
	}
	if claims.ExpiresAt.Unix() <= time.Now().Unix() {
		return nil, fmt.Errorf("error: authorization expired")
	}
	if !IsCorrectEmail(claims.Email) {
		return nil, fmt.Errorf("error: invalid email")
	}
	userData := model.UserHeader{
		Username: claims.Username,
		Email:    claims.Email,
		IsAdmin:  claims.IsAdmin,
		Name: claims.Name,
	}
	return &userData, nil
}

func IsCorrectEmail(email string) bool {
	emailRegex := regexp.MustCompile(`^[a-z0-9._%+\-]+@[a-z0-9.\-]+\.[a-z]{2,4}$`)
	return emailRegex.MatchString(email)
}
