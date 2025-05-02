package main

import (
	"io"
	"net/http"
	"net/http/httptest"
	"os"
	"strings"
	"testing"

	"gotest.tools/assert"
)

const wikiPath = "./testdata"

func getTest(t *testing.T, reqUrl string, fileName string) {
	req := httptest.NewRequest(http.MethodGet, reqUrl, nil)
	w := httptest.NewRecorder()
	get(wikiPath)(w, req)
	resp := w.Result()
	defer resp.Body.Close()

	expectedFile, err := os.Open(wikiPath + "/" + fileName)
	assert.NilError(t, err)
	defer expectedFile.Close()
	expected, err := os.ReadFile(expectedFile.Name())
	assert.NilError(t, err)
	actual, err := io.ReadAll(resp.Body)
	assert.NilError(t, err)
	assert.Equal(t, string(expected), string(actual))
}

func putTest(t *testing.T, reqUrl string, fileName string, contents string) {
	_ = os.Remove(wikiPath + "/" + fileName)

	req := httptest.NewRequest(http.MethodPut, reqUrl, strings.NewReader(contents))
	w := httptest.NewRecorder()
	put(wikiPath)(w, req)
	resp := w.Result()
	defer resp.Body.Close()

	assert.Equal(t, resp.StatusCode, http.StatusOK)
	actualFile, err := os.Open(wikiPath + "/" + fileName)
	assert.NilError(t, err)
	defer actualFile.Close()
	actual, err := os.ReadFile(actualFile.Name())
	assert.Equal(t, contents, string(actual))

	_ = os.Remove(wikiPath + "/" + fileName)
}

// TODO: test something other than the happy path
func TestHandlers(t *testing.T) {
	getTest(t, "http://server/contents/test", "test.md")
	putTest(t, "http://server/contents/put", "put.md", "put contents")
}
