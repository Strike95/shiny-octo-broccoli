#!/bin/bash

# Script to build and test Docker container - Automatic Test Only
# Compatible with Windows (Git Bash) and Linux/macOS

echo "========================================"
echo " DOCKER BUILD AND TEST - ARK ENERGY SQL"
echo "========================================"
echo ""

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "[ERROR] Docker is not installed or not in PATH"
    echo "        Install Docker Desktop from: https://www.docker.com/products/docker-desktop"
    exit 1
fi

echo "[OK] Docker found"

# Build the image
echo ""
echo "[BUILD] Building Docker image..."
docker build -t ark-energy-sql .

if [ $? -ne 0 ]; then
    echo "[ERROR] Error during image build"
    exit 1
fi

echo "[OK] Image created successfully"

echo ""
echo "[TEST] Running automatic test..."
echo ""

# Run automatic test
docker run --rm ark-energy-sql ./auto_test.sh

if [ $? -eq 0 ]; then
    echo ""
    echo "[SUCCESS] All tests completed successfully!"
else
    echo ""
    echo "[ERROR] Tests failed!"
    exit 1
fi
