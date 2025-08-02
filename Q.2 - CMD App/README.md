# CheckDay - Weekday Counter Application

CheckDay is a command-line application that calculates how many times a specific weekday falls on the first day of each month in a given year.

## 📋 Features

- Calculate weekday occurrences on the 1st of each month for any year
- Random test generation with configurable test count
- Accurate leap year calculation following historical rules
- Docker containerization support
- Input validation and error handling
- Cross-platform compatibility (Windows, Linux, macOS)

## 🚀 Quick Start

### Prerequisites

- .NET 8.0 SDK (for local development)
- Docker (for containerized execution)

### Local Execution

```bash
# Build the application
dotnet build

# Run with parameters
dotnet run <year> <weekday>

# Run random tests
dotnet run random [count]
```

### Docker Execution

```bash
# Build Docker image
docker build -t checkday .

# Run with parameters
docker run --rm checkday <year> <weekday>

# Run random tests
docker run --rm checkday random [count]
```

## 📖 Usage

### Command Syntax

```
CheckDay <year> <weekday>
CheckDay random [count]
```

### Parameters

- **year**: Integer between 1900 and 9999
- **weekday**: Integer representing the day of the week
  - `0` = Sunday
  - `1` = Monday
  - `2` = Tuesday
  - `3` = Wednesday
  - `4` = Thursday
  - `5` = Friday
  - `6` = Saturday
- **count**: (Optional) Number of random tests to run (default: 5)

### Examples

#### Normal Mode

```bash
# Count Mondays on the 1st of each month in 2024
dotnet run 2024 1

# Count Fridays on the 1st of each month in 2023
dotnet run 2023 5

# Count Sundays on the 1st of each month in 2000
dotnet run 2000 0
```

#### Random Mode

```bash
# Run 5 random tests (default)
dotnet run random

# Run 10 random tests
dotnet run random 10

# Run 3 random tests
dotnet run random 3
```

#### Docker Examples

```bash
# Normal mode with Docker
docker run --rm checkday 2024 1
docker run --rm checkday 2023 5
docker run --rm checkday 2000 0

# Random mode with Docker
docker run --rm checkday random
docker run --rm checkday random 8
```

## 🧪 Testing

### Automated Test Scripts

#### Linux/macOS

```bash
# Make script executable
chmod +x test-docker.sh

# Run tests
./test-docker.sh
```

#### Windows

```cmd
# Run tests
test-docker.bat
```

### Test Features

The test scripts include:

1. **Specific Test Cases**
   - Years with known results (2024, 2023, 2000, 1900)
   - Leap year testing (2000, 2020)
   - Non-leap century year testing (1900)
   - Various weekday combinations

2. **Built-in Random Tests**
   - Uses application's random mode with different counts
   - Generates random years between 1900-2100
   - Random weekday selection
   - Demonstrates application robustness

3. **Manual Random Tests**
   - Script-generated random combinations
   - Comparison with built-in random mode
   - Additional test coverage

4. **Error Case Testing**
   - Invalid year ranges
   - Invalid weekday numbers
   - Non-numeric inputs
   - Missing parameters

## 🧮 Algorithm Details

### Day of Week Calculation

The application uses a custom algorithm based on the reference point that **January 1, 1900 was a Monday**.

### Leap Year Rules

A year is a leap year if:
- Divisible by 4 **AND**
- NOT divisible by 100 **OR**
- Divisible by 400

Examples:
- 2000: Leap year (divisible by 400)
- 1900: Not a leap year (divisible by 100, not by 400)
- 2004: Leap year (divisible by 4, not by 100)

### Month Days

- January: 31 days
- February: 28 days (29 in leap years)
- March: 31 days
- April: 30 days
- May: 31 days
- June: 30 days
- July: 31 days
- August: 31 days
- September: 30 days
- October: 31 days
- November: 30 days
- December: 31 days

## 🐳 Docker Configuration

### Dockerfile Structure

The application uses a multi-stage Docker build:

1. **Base Stage**: Runtime environment (.NET 8.0)
2. **Build Stage**: SDK environment for compilation
3. **Publish Stage**: Application publishing
4. **Final Stage**: Optimized runtime image

### Container Usage

```bash
# Build image
docker build -t checkday .

# Run container (normal mode)
docker run --rm checkday <year> <weekday>

# Run container (random mode)
docker run --rm checkday random [count]
```

## 📁 Project Structure

```
CheckDay/
├── Program.cs              # Main application logic
├── CheckDay.csproj         # Project configuration
├── Dockerfile              # Docker containerization
├── test-docker.sh          # Linux/macOS test script
├── test-docker.bat         # Windows test script
└── README.md              # This documentation
```

## 🔧 Development

### Building

```bash
# Build in Debug mode
dotnet build

# Build in Release mode
dotnet build -c Release

# Publish for distribution
dotnet publish -c Release -o ./publish
```

### Testing Locally

```bash
# Test with valid input
dotnet run 2024 1

# Test random mode
dotnet run random 3

# Test with invalid input
dotnet run 1800 1    # Year too low
dotnet run 2024 8    # Invalid weekday
dotnet run abc def   # Non-numeric input
```

## 📊 Sample Output

### Normal Mode

```
$ dotnet run 2024 1
In 2024, the first of the month fell on a Monday 2 time(s).

$ dotnet run 2000 0
In 2000, the first of the month fell on a Sunday 2 time(s).

$ dotnet run 1900 5
In 1900, the first of the month fell on a Friday 2 time(s).
```

### Random Mode

```
$ dotnet run random 3
=== CheckDay Random Test Mode ===
Running 3 random test cases...

Random Test 1: Year 1987, Wednesday (3)
Result: In 1987, the first of the month fell on a Wednesday 2 time(s).

Random Test 2: Year 2045, Sunday (0)
Result: In 2045, the first of the month fell on a Sunday 1 time(s).

Random Test 3: Year 2012, Saturday (6)
Result: In 2012, the first of the month fell on a Saturday 2 time(s).

=== Random Test Mode Completed ===
```

## ❌ Error Handling

The application provides clear error messages for:

- **Invalid year range**: Years outside 1900-9999
- **Invalid weekday**: Numbers outside 0-6 range
- **Non-numeric input**: Non-integer parameters
- **Missing parameters**: Insufficient command-line arguments
- **Invalid random count**: Non-positive numbers for random test count

Example error outputs:

```
Error: Year must be between 1900 and 9999.
Error: Invalid weekday. Use 0=Sunday, 1=Monday, 2=Tuesday, 3=Wednesday, 4=Thursday, 5=Friday, 6=Saturday.
Usage: CheckDay <year> <weekday>
       CheckDay random [count] - Run random tests (default: 5)
```

## 🌟 Features Highlights

- ✅ Accurate historical date calculations
- ✅ Comprehensive input validation
- ✅ Built-in random test generation
- ✅ Docker containerization
- ✅ Cross-platform compatibility
- ✅ Automated testing scripts
- ✅ Configurable random test count
- ✅ Clear error messages and usage instructions

## 📝 License

This project is created for educational and interview purposes.

---

**Note**: This application calculates weekdays based on the Gregorian calendar and uses January 1, 1900 (Monday) as the reference point for all calculations.