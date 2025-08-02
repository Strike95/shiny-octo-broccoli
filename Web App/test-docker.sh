#!/bin/bash
set -e

echo "[INFO] Building and testing Energy Market Web Application with Docker..."

# Clean up any existing containers and images to prevent conflicts
echo "[INFO] Cleaning up existing containers and images..."
docker stop energy-market-webapp-test 2>/dev/null || true
docker rm energy-market-webapp-test 2>/dev/null || true
docker rmi energy-market-webapp 2>/dev/null || true
echo "[INFO] Cleanup completed"

echo "[INFO] Building Docker image..."
docker build -t energy-market-webapp .

echo "[SUCCESS] Docker image built successfully"
echo "[INFO] Starting container for testing..."

# Run the container
echo "[INFO] Running Energy Market webapp container..."
docker run -d -p 3000:3000 --name energy-market-webapp-test energy-market-webapp

if [ $? -eq 0 ]; then
    echo "[SUCCESS] Container started successfully!"
    echo "[INFO] Application is available at: http://localhost:3000"
    
    # Wait for application to start
    echo "[INFO] Waiting for application to start..."
    sleep 10
    
    # Check if container is still running
    if docker ps | grep -q energy-market-webapp-test; then
        echo "[SUCCESS] ✅ Energy Market webapp is running successfully!"
        echo "[INFO] 📱 Access the application at: http://localhost:3000"
        echo ""
        echo "[INFO] Available routes:"
        echo "  - / (Home dashboard)"
        echo "  - /electricity-prices (European electricity prices)"
        echo "  - /green-certificates (Green certificates market)"
        echo "  - /market-analysis (Market analysis dashboard)"
    else
        echo "[ERROR] ❌ Container stopped unexpectedly!"
        echo "[ERROR] Container logs:"
        docker logs energy-market-webapp-test
        exit 1
    fi
else
    echo "[ERROR] ❌ Failed to start container!"
    exit 1
fi

echo ""
echo "[INFO] To stop the application:"
echo "  docker stop energy-market-webapp-test"
echo "  docker rm energy-market-webapp-test"
echo ""
echo "[INFO] To view logs:"
echo "  docker logs energy-market-webapp-test"

echo ""
read -p "Press Enter to stop and cleanup the container..."
echo "[INFO] Stopping and removing container..."
docker stop energy-market-webapp-test 2>/dev/null || true
docker rm energy-market-webapp-test 2>/dev/null || true
echo "[SUCCESS] Test completed!"
