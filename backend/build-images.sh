#!/bin/bash

# Exit immediately if a command exits with a non-zero status
set -e

echo "Building local Docker images..."

# Ensure the script is run from the backend directory where the docker folder exists
if [ ! -d "docker" ]; then
  echo "Error: 'docker' directory not found. Please run this script from the 'backend' directory."
  exit 1
fi

cd docker

# Build ffuf 
# echo "Building ffuf-local:latest..."
# docker build -t ffuf-local:latest -f Dockerfile.ffuf .

# Build nmap 
# echo "Building nmap-local:latest..."
# docker build -t nmap-local:latest -f Dockerfile.nmap .

# Build observatory
echo "Building observatory-local:latest..."
docker build -t observatory-local:latest -f Dockerfile.observatory .

# Build testssl 
# echo "Building testssl-local:latest..."
# docker build -t testssl-local:latest -f Dockerfile.testssl .

# Build wappalyzergo
# echo "Building wappalyzergo-local:latest..."
# docker build -t wappalyzergo-local:latest -f Dockerfile.wappalyzergo .

# Build wapiti
# if [ -f "Dockerfile.wapiti" ]; then
#     echo "Building wapiti-local:latest..."
#     docker build -t wapiti-local:latest -f Dockerfile.wapiti .
# else
#     echo "Warning: Dockerfile.wapiti not found. Skipping wapiti-local:latest build."
# fi


cd ..

echo "Pulling external Docker images..."

# # Pull Nuclei
# docker pull projectdiscovery/nuclei:latest

# Pull Retire
docker pull ghcr.io/redmor1/retire-site-scanner-modified:latest

echo "All scanner images are ready."