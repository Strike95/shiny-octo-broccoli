#!/bin/bash

# CheckDay Docker Test Script for Linux/Mac
# This script builds the Docker image and runs tests with various inputs

echo "=== CheckDay Docker Test Script ==="

# Clean up any existing images to prevent conflicts
echo "[INFO] Cleaning up existing Docker images..."
docker rmi checkday 2>/dev/null || true
echo "[INFO] Cleanup completed"

echo "Building Docker image..."

# Build the Docker image
docker build -t checkday .

if [ $? -ne 0 ]; then
    echo "❌ Docker build failed!"
    exit 1
fi

echo "✅ Docker image built successfully!"
echo ""

# Test cases with specific inputs
echo "=== Running Test Cases ==="

echo "Test 1: Year 2024, Monday (1)"
docker run --rm checkday 2024 1

echo ""
echo "Test 2: Year 2023, Friday (5)"
docker run --rm checkday 2023 5

echo ""
echo "Test 3: Year 2000 (leap year), Sunday (0)"
docker run --rm checkday 2000 0

echo ""
echo "Test 4: Year 1900 (not a leap year), Wednesday (3)"
docker run --rm checkday 1900 3

echo ""
echo "Test 5: Invalid year (too low)"
docker run --rm checkday 1800 1

echo ""
echo "Test 6: Invalid weekday (out of range)"
docker run --rm checkday 2024 8

echo ""
echo "Test 7: Invalid arguments (non-numeric)"
docker run --rm checkday abc def

echo ""
echo "Test 8: Missing arguments"
docker run --rm checkday 2024

echo ""
echo "=== Built-in Random Mode Tests ==="

echo "Random Mode: 3 random tests"
docker run --rm checkday random 3

echo ""
echo "Random Mode: 5 random tests (default)"
docker run --rm checkday random

echo ""
echo "=== Manual Random Test Cases ==="

# Generate 5 random test cases
for i in {1..5}; do
    # Random year between 1900 and 2100
    year=$((1900 + RANDOM % 201))
    # Random weekday between 0 and 6
    weekday=$((RANDOM % 7))
    
    weekday_names=("Sunday" "Monday" "Tuesday" "Wednesday" "Thursday" "Friday" "Saturday")
    echo "Manual Random Test $i: Year $year, ${weekday_names[$weekday]} ($weekday)"
    docker run --rm checkday $year $weekday
    echo ""
done

echo "=== All tests completed! ==="