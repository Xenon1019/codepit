package handler

import (
	"context"
	"errors"
	"os"

	"server/model/query"

	"go.mongodb.org/mongo-driver/mongo"
)

var db *mongo.Database

func GetDb() *mongo.Database {
	return db
}

func IsOk() (bool, error) {
	if db == nil {
		return false, errors.New("db not initialized")
	}
	err := db.Client().Ping(context.TODO(), nil)
	if err != nil {
		return false, err
	}
	return true, nil
}

func Close() error {
	return db.Client().Disconnect(context.TODO())
}

func Initialize() error {
	client, err := query.Connect()
	if err != nil {
		return err
	}
	dbName := os.Getenv("DB_Name")
	if dbName == "" {
		return errors.New("error: no database set in .env file")
	}
	db = client.Database(dbName)
	if db == nil {
		err = errors.New("error: no database found")
		return err
	}
	return nil
}
