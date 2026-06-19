package main

import (
	"encoding/json"
	"flag"
	"fmt"
	"io"
	"log"
	"net/http"
	"os"

	wappalyzer "github.com/projectdiscovery/wappalyzergo"
)

func main() {
	// Define command-line arguments
	targetURL := flag.String("target", "", "Target URL to scan")
	outputFile := flag.String("output", "", "File path to save JSON output")
	scanType := flag.String("type", "info", "Output type: info, cats, title, basic")
	
	// Define -json as a boolean flag so the script doesn't crash when you pass it
	_ = flag.Bool("json", true, "Output in JSON format (default true)")
	flag.Parse()

	if *targetURL == "" {
		log.Fatal("Error: -target argument is required")
	}

	// Fetch the target URL
	resp, err := http.DefaultClient.Get(*targetURL)
	if err != nil {
		log.Fatalf("Error fetching URL: %v", err)
	}
	defer resp.Body.Close()

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		log.Fatalf("Error reading response body: %v", err)
	}

	// Initialize Wappalyzer
	wappalyzerClient, err := wappalyzer.New()
	if err != nil {
		log.Fatalf("Error initializing wappalyzer: %v", err)
	}

	// Determine which output function to run based on the -type flag
	var result interface{}
	switch *scanType {
	case "info":
		result = wappalyzerClient.FingerprintWithInfo(resp.Header, body)
	case "cats":
		result = wappalyzerClient.FingerprintWithCats(resp.Header, body)
	case "title":
		fingerprints, title := wappalyzerClient.FingerprintWithTitle(resp.Header, body)
		result = map[string]interface{}{
			"title":        title,
			"fingerprints": fingerprints,
		}
	default:
		// Fallback to basic fingerprint map
		result = wappalyzerClient.Fingerprint(resp.Header, body)
	}

	// Convert the result to JSON
	jsonOutput, err := json.Marshal(result)
	if err != nil {
		log.Fatalf("Error encoding JSON: %v", err)
	}

	// Write to file or print to terminal
	if *outputFile != "" {
		err = os.WriteFile(*outputFile, jsonOutput, 0644)
		if err != nil {
			log.Fatalf("Error writing to file: %v", err)
		}
	} else {
		fmt.Println(string(jsonOutput))
	}
}