package main

import (
	"log"

	"github.com/kelseyhightower/envconfig"
)

type specification struct {
	Port         int    `default:"9000"`
	FrontendPath string `default:"/home/richard/src/wiki/frontend/dist"`
	WikiPath     string `default:"/home/richard/src/wiki/wikidata"`
}

var spec specification

func main() {
	err := envconfig.Process("wiki", &spec)
	if err != nil {
		log.Fatal("error reading environment variables:", err)
	}

	handler(spec.Port, spec.FrontendPath, spec.WikiPath)
}
