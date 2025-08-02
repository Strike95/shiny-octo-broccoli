@echo off
echo === Pets Vaccination Docker Test Script ===

REM Clean up any existing images to prevent conflicts
echo [INFO] Cleaning up existing Docker images...
docker rmi pets-vaccination 2>nul
echo [INFO] Cleanup completed

echo Building Docker image for Pets Vaccination Solver...
docker build -t pets-vaccination .

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ✅ Docker image built successfully!
    echo.
    echo Running the application...
    docker run --rm pets-vaccination
    echo.
    echo === Test completed ===
    echo Press any key to exit...
    pause >nul
) else (
    echo.
    echo ❌ Build failed!
    pause
)
