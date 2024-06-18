package main

import (
	"fmt"
	"github.com/gorilla/websocket"
	"io"
	"log"
	"net/http"
	"net/url"
)

var upgrader = websocket.Upgrader{
	CheckOrigin: func(r *http.Request) bool {
		return true
	},
}

func handleConnections(w http.ResponseWriter, r *http.Request) {
	ws, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Println(err)
		return
	}
	defer ws.Close()

	for {
		_, msg, err := ws.ReadMessage()
		if err != nil {
			log.Println(err)
			break
		}

		apiResponse, err := callPythonAPI(msg)
		if err != nil {
			log.Println("API call error:", err)
			continue
		}

		if err := ws.WriteMessage(websocket.TextMessage, []byte(apiResponse)); err != nil {
			log.Println(err)
			break
		}
		fmt.Println("Message send", apiResponse)
	}
}

func callPythonAPI(data []byte) (string, error) {
	baseURL := "http://localhost:5000/api/data"
	params := url.Values{}
	params.Add("data", string(data))

	url := fmt.Sprintf("%s?%s", baseURL, params.Encode())

	resp, err := http.Get(url)
	fmt.Println("Request sent")
	if err != nil {
		return "", err
	}
	defer resp.Body.Close()

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return "", err
	}

	return string(body), nil
}

func main() {
	http.HandleFunc("/", handleConnections)

	fmt.Println("WebSocket server started on 192.168.217.255:8000")
	log.Fatal(http.ListenAndServe("0.0.0.0:8000", nil))
}
