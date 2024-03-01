package query

import (
	"context"
	"errors"
	"log"
	"os"
	"time"

	"server/model"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
	"golang.org/x/crypto/bcrypt"
)

var ctx = context.TODO()

const (
	CodeUsernameNotExists    = -1
	CodeInvalidPassword      = -2
	CodeSucessfullyValidated = 1
	CodeUnknownError         = 3 //Futhur categorizaion needed

	UserNameExists          = 1
	EmailExists             = 2
	NoUsernameOrEmailExists = 0
	SomthingWentWrong       = -1
)

// Connects to the mongodb cluster. Returns any error
func Connect() (*mongo.Client, error) {
	mongoUri := os.Getenv("MONGO_URL")
	if mongoUri == "" {
		return nil, errors.New("set MONGO_URL variable in .env file")
	}
	return mongo.Connect(ctx, options.Client().ApplyURI(mongoUri))
}

func GetProblems(db *mongo.Database) ([]model.ProblemHeader, error) {
	collection := db.Collection("Problems")
	opts := options.Find().SetSort(bson.D{{Key: "number", Value: 1}}).SetProjection(bson.D{
		{Key: "number", Value: 1},
		{Key: "title", Value: 1},
		{Key: "difficulty", Value: 1}},
	)
	cursor, err := collection.Find(ctx, bson.D{{}}, opts)
	if err != nil {
		return []model.ProblemHeader{}, err
	}
	var problems []model.ProblemHeader
	err = cursor.All(ctx, &problems)
	if err != nil {
		return []model.ProblemHeader{}, err
	}
	return problems, nil
}

func ValidateUser(db *mongo.Database, username, password string) (*model.PublicUser, int) {
	var user struct {
		Username     string             `bson:"username"`
		PasswordHash string             `bson:"password_hash"`
		Id           primitive.ObjectID `bson:"_id"`
	}

	opts := options.FindOne().SetProjection(bson.M{
		"username":      1,
		"password_hash": 1,
		"_id":           1,
	})
	err := db.Collection("Users").FindOne(ctx, bson.M{"username": username}, opts).Decode(&user)
	if err == mongo.ErrNoDocuments {
		return nil, CodeUsernameNotExists
	} else if err != nil {
		return nil, CodeUnknownError
	}

	result := bcrypt.CompareHashAndPassword([]byte(user.PasswordHash), []byte(password))

	if result == nil {
		var publicUser model.PublicUser
		opts = options.FindOne().SetProjection(bson.M{
			"name":            1,
			"username":        1,
			"email":           1,
			"is_admin":        1,
			"solved_problems": 1,
		})
		err = db.Collection("Users").FindOne(ctx, bson.M{"_id": user.Id}, opts).Decode(&publicUser)
		if err != nil {
			t := time.Now().String()
			log.Printf("%s:error: %s\n", t, err.Error())
			log.Printf("%s:error: could not find document in second query while validating user\n", t)
			return nil, CodeUnknownError
		}
		return &publicUser, CodeSucessfullyValidated
	} else if result == bcrypt.ErrMismatchedHashAndPassword {
		return nil, CodeInvalidPassword
	} else {
		log.Printf("%s:error: %s\n", time.Now().String(), result.Error())
		return nil, CodeUnknownError
	}
}

func GetDb(client *mongo.Client) *mongo.Database {
	return client.Database(os.Getenv("DB_Name"))
}

func GetProblem(db *mongo.Database, problemId int) (problem model.Problem, err error) {
	opts := options.FindOne().SetProjection(bson.M{"private_testcases": 0, "_id": 0})
	err = db.Collection("Problems").
		FindOne(ctx, bson.M{"number": problemId}, opts).
		Decode(&problem)
	return
}

func HasUsername(db *mongo.Database, username string) bool {
	result := db.Collection("Users").FindOne(ctx, bson.M{"username": username})
	var user bson.M
	return result.Decode(&user) == nil
}

func HasEmail(db *mongo.Database, email string) bool {
	result := db.Collection("Users").FindOne(ctx, bson.M{"email": email})
	var user bson.M
	return result.Decode(&user) == nil
}

func HasUsernameOrEmail(db *mongo.Database, username, email string) int {
	filter := bson.D{{
		Key: "$or",
		Value: bson.A{
			bson.D{{Key: "username", Value: username}},
			bson.D{{Key: "email", Value: email}},
		},
	}}
	opts := options.FindOne().SetProjection(bson.M{
		"username": 1,
		"email":    1,
	})
	result := db.Collection("Users").FindOne(ctx, filter, opts)
	var user struct {
		Username string `bson:"username"`
		Email    string `bson:"email"`
	}
	err := result.Decode(&user)
	if err != nil {
		return NoUsernameOrEmailExists
	}
	switch {
	case user.Email == email:
		return EmailExists
	case user.Username == username:
		return UserNameExists
	default:
		return SomthingWentWrong
	}
}

func InsertUser(db *mongo.Database, user *model.User) error {
	_, err := db.Collection("Users").InsertOne(ctx, user)
	return err
}

func GetUserProblems(db *mongo.Database, userHeader *model.UserHeader) (*model.PublicUser, error) {
	filter := bson.D{{
		Key: "$and",
		Value: bson.A{
			bson.D{{Key: "username", Value: userHeader.Username}},
			bson.D{{Key: "email", Value: userHeader.Email}},
			bson.D{{Key: "is_admin", Value: userHeader.IsAdmin}},
		},
	}}
	opts := options.FindOne().SetProjection(bson.M{
		"solved_problems": 1,
	})
	result := db.Collection("Users").FindOne(ctx, filter, opts)
	var user struct {
		SolvedProblems []int32 `bson:"solved_problems"`
	}
	err := result.Decode(&user)
	if err != nil {
		return nil, err
	}
	return &model.PublicUser{
		UserHeader:     *userHeader,
		SolvedProblems: user.SolvedProblems,
	}, nil
}

func InsertProblem(db *mongo.Database, problem *model.Problem) error {
	opts := options.InsertOne()
	_, err := db.Collection("Problems").InsertOne(ctx, problem, opts)
	return err
}
