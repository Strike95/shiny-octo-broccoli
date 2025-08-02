@echo off
REM Script to build and test Docker container on Windows - Automatic Test Only

echo ========================================
echo  DOCKER BUILD AND TEST - ARK ENERGY SQL
echo ========================================
echo.

REM Check if Docker is installed
docker --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Docker is not installed or not in PATH
    echo         Install Docker Desktop from: https://www.docker.com/products/docker-desktop
    pause
    exit /b 1
)

echo [OK] Docker found

REM Build the image
echo.
echo [BUILD] Building Docker image...
docker build -t ark-energy-sql .

if %errorlevel% neq 0 (
    echo [ERROR] Error during image build
    pause
    exit /b 1
)

echo [OK] Image created successfully

echo.
echo [TEST] Running automatic test...
echo.

REM Run automatic test
docker run --rm ark-energy-sql ./auto_test.sh

if %errorlevel% equ 0 (
    echo.
    echo [SUCCESS] All tests completed successfully!
) else (
    echo.
    echo [ERROR] Tests failed!
    pause
    exit /b 1
)

echo.
pause
