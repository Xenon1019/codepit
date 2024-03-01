package model

import "time"

type ProblemHeader struct {
	Number     int32  `bson:"number" json:"number"`
	Title      string `bson:"title" json:"title"`
	Difficulty int32  `bson:"difficulty" json:"difficulty"`
}

type TestCase struct {
	Input  string `bson:"input" json:"input"`
	Output string `bson:"output" json:"output"`
}

type Problem struct {
	ProblemHeader     `bson:"inline"`
	Description       string     `bson:"description"`
	Input_Type        string     `bson:"input_type" json:"inputType"`
	Output_Type       string     `bson:"output_type" json:"outputType"`
	Public_Testcases  []TestCase `bson:"public_testcases" json:"testCases"`
	Private_testcases []TestCase `bson:"private_testcases"`
	Constraints       []struct {
		Type       string `bson:"type" json:"type"`
		Constraint string `bson:"constraint" json:"constraint"`
	} `bson:"constraints" json:"constraints"`
}

type UserHeader struct {
	Username string `bson:"username" json:"username"`
	Name string `bson:"name" json:"name"`
	IsAdmin  bool   `bson:"is_admin" json:"isAdmin"`
	Email    string `bson:"email" json:"email"`
}

type User struct {
	UserHeader     `bson:"inline"`
	CreatedOn      time.Time `bson:"created_on" json:"createdOn"`
	PasswordHash   string    `bson:"password_hash"`
	SolvedProblems []int32   `bson:"solved_problems" json:"solvedProblems"`
}

type PublicUser struct {
	UserHeader     `bson:"inline"`
	SolvedProblems []int32 `bson:"solved_problems" json:"solvedProblems"`
}
