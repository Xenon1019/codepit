package model

import "time"

type ProblemHeader struct {
	Number     int32  `bson:"number"`
	Name       string `bson:"name"`
	Difficulty int32  `bson:"difficulty"`
}

type Problem struct {
	ProblemHeader    `bson:"inline"`
	Description      string `bson:"description"`
	Input_Type       string `bson:"input_type"`
	Output_Type      string `bson:"output_type"`
	Public_Testcases []struct {
		Input  string `bson:"input"`
		Output string `bson:"output"`
	}
	Private_testcases []struct {
		input  string `bson:"input"`
		output string `bson:"output"`
	}
	Constraints []struct {
		Type       string `bson:"type"`
		Constraint string `bson:"constraint"`
	}
}

type UserHeader struct {
	Username string `bson:"username"`
	IsAdmin  bool   `bson:"is_admin"`
	Email    string `bson:"email"`
}

type User struct {
	UserHeader     `bson:"inline"`
	CreatedOn      time.Time `bson:"created_on"`
	PasswordHash   string    `bson:"password_hash"`
	SolvedProblems []int32   `bson:"solved_problems"`
}

type PublicUser struct {
	UserHeader     `bson:"inline"`
	SolvedProblems []int32 `bson:"solved_problems"`
}
