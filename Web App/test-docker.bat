@echo off
echo [INFO] Building and testing Energy Market Angular application...

REM Clean up any existing containers and images to prevent conflicts
echo [INFO] Cleaning up existing containers and images...
docker stop energy-market-container 2>nul
docker rm energy-market-container 2>nul
docker rmi energy-market-webapp 2>nul
echo [INFO] Cleanup completed

REM Build the Docker image
echo [INFO] Building Docker image...
docker build -t energy-market-webapp .

if %ERRORLEVEL% neq 0 (
    echo [ERROR] Docker build failed!
    exit /b 1
)

echo [SUCCESS] Docker image built successfully!

REM Run the application container
echo [INFO] Starting Energy Market application container...
docker run -d -p 3000:3000 --name energy-market-container energy-market-webapp

if %ERRORLEVEL% neq 0 (
    echo [ERROR] Docker run failed!
    exit /b 1
)

echo [SUCCESS] Application started successfully!
echo [INFO] Access the application at: http://localhost:3000

REM Wait for the application to start
echo [INFO] Waiting for application to initialize...
timeout /t 15 /nobreak

REM Optional: Open browser
echo [INFO] Opening browser...
start http://localhost:3000

echo.
echo [INFO] To stop the application, run:
echo docker stop energy-market-container
echo docker rm energy-market-container

echo [INFO] Press any key to stop and cleanup the container...
pause

echo [INFO] Stopping and removing container...
docker stop energy-market-container 2>nul
docker rm energy-market-container 2>nul

echo [SUCCESS] Test completed!
