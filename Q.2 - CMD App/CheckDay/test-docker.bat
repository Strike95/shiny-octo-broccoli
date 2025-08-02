@echo off
setlocal enabledelayedexpansion

echo === CheckDay Docker Test Script for Windows ===

REM Clean up any existing images to prevent conflicts
echo [INFO] Cleaning up existing Docker images...
docker rmi checkday 2>nul
echo [INFO] Cleanup completed

echo Building Docker image...

docker build -t checkday .

if %errorlevel% neq 0 (
    echo Docker build failed!
    pause
    exit /b 1
)

echo Docker image built successfully!
echo.

echo === Running Test Cases ===

echo Test 1: Year 2024, Monday
docker run --rm checkday 2024 1

echo.
echo Test 2: Year 2023, Friday
docker run --rm checkday 2023 5

echo.
echo Test 3: Year 2000 leap year, Sunday
docker run --rm checkday 2000 0

echo.
echo Test 4: Year 1900 not leap year, Wednesday
docker run --rm checkday 1900 3

echo.
echo Test 5: Invalid year too low
docker run --rm checkday 1800 1

echo.
echo Test 6: Invalid weekday out of range
docker run --rm checkday 2024 8

echo.
echo Test 7: Invalid arguments non-numeric
docker run --rm checkday abc def

echo.
echo Test 8: Missing arguments
docker run --rm checkday 2024

echo.
echo === Built-in Random Mode Tests ===

echo Random Mode: 3 random tests
docker run --rm checkday random 3

echo.
echo Random Mode: 5 random tests (default)
docker run --rm checkday random

echo.
echo === Manual Random Test Cases ===

for /l %%i in (1,1,5) do (
    set /a year=1900 + !random! %% 201
    set /a weekday=!random! %% 7
    
    if !weekday!==0 set weekday_name=Sunday
    if !weekday!==1 set weekday_name=Monday
    if !weekday!==2 set weekday_name=Tuesday
    if !weekday!==3 set weekday_name=Wednesday
    if !weekday!==4 set weekday_name=Thursday
    if !weekday!==5 set weekday_name=Friday
    if !weekday!==6 set weekday_name=Saturday
    
    echo Manual Random Test %%i: Year !year!, !weekday_name!
    docker run --rm checkday !year! !weekday!
    echo.
)

echo === All tests completed! ===
pause