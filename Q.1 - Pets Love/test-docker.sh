#!/bin/bash

# Pets Vaccination Docker Test Script for Linux/Mac

echo "=== Pets Vaccination Docker Test Script ==="
echo "Building Docker image for Pets Vaccination Solver..."

# Build the Docker image
docker build -t pets-vaccination .

if [ $? -ne 0 ]; then
    echo "❌ Docker build failed!"
    echo "Press Enter to exit..."
    read
    exit 1
fi

echo "✅ Docker image built successfully!"
echo ""

echo "Running the application..."
docker run --rm pets-vaccination

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Application completed successfully!"
    echo ""
    echo "=== Test completed ==="
    echo "Press Enter to exit..."
    read
else
    echo ""
    echo "❌ Application failed!"
    echo "Press Enter to exit..."
    read
    exit 1
fi
