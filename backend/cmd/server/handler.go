package main

import (
	"fmt"
	"io"
	"log"
	"net/http"
	"os"
)

func handler(port int, frontendPath string, wikiPath string) {
	// Handle the api routes in the backend
	http.Handle("GET /contents/", http.HandlerFunc(get(wikiPath)))
	http.Handle("PUT /contents/", http.HandlerFunc(put(wikiPath)))
	// bundled assets and static resources
	http.Handle("GET /assets/", http.FileServer(http.Dir(frontendPath)))
	http.Handle("GET /static/", http.FileServer(http.Dir(frontendPath)))
	// For other requests, serve up the frontend code
	http.HandleFunc("GET /", func(w http.ResponseWriter, r *http.Request) {
		http.ServeFile(w, r, fmt.Sprintf("%s/index.html", frontendPath))
	})
	log.Println("server listening on port", port)
	log.Fatal(http.ListenAndServe(fmt.Sprintf(":%d", port), nil))
}

func logError(w http.ResponseWriter, msg string, code int) {
	log.Printf("%d %s", code, msg)
	http.Error(w, msg, code)
}

func get(wikiPath string) func(http.ResponseWriter, *http.Request) {
	return func(w http.ResponseWriter, r *http.Request) {
		// strip the leading /contents/ from the URL path
		// and append .md to the end of the path
		name := wikiPath + "/" + r.URL.Path[len("/contents/"):] + ".md"
		// if the file does not exist, return a 404 error
		if _, err := os.Stat(name); os.IsNotExist(err) {
			logError(w, fmt.Sprintf("File not found: %s", name), http.StatusNotFound)
			return
		}
		// return the contents of the file to the client as type markdown
		http.ServeFile(w, r, name)
		w.Header().Set("Content-Type", "text/markdown")
	}
}

func put(wikiPath string) func(http.ResponseWriter, *http.Request) {
	return func(w http.ResponseWriter, r *http.Request) {
		name := wikiPath + "/" + r.URL.Path[len("/contents/"):] + ".md"
		// read the contents of the request body and write it to the file
		// if the file does not exist, create it
		// if the file exists, overwrite it
		file, err := os.Create(name)
		if err != nil {
			logError(w, fmt.Sprintf("Error creating file: %v", err), http.StatusInternalServerError)
			return
		}
		defer file.Close()
		_, err = io.Copy(file, r.Body)
		if err != nil {
			logError(w, fmt.Sprintf("Error writing file: %v", err), http.StatusInternalServerError)
			return
		}
	}
}
