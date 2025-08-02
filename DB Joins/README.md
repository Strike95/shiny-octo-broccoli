# SQL Query Solutions - Ark Energy Interview

## Summary of Results

### 1. Different Types of Outer Joins
- **LEFT OUTER JOIN**: Returns all records from electricity_prices table (10 rows, 2004-2013), with NULL values for CV data where no match exists (2004-2005)
- **RIGHT OUTER JOIN**: Returns all records from green_certificates table (9 rows, 2006-2014), with NULL values for electricity data where no match exists (2014)
- **FULL OUTER JOIN**: Returns all records from both tables (11 rows, 2004-2014), with NULLs where data doesn't overlap

### 2. Different Types of Inner Joins
- **Basic INNER JOIN**: Returns only matching records from both tables (8 rows, 2006-2013)
- **INNER JOIN with WHERE condition**: Filters for CV prices > 80 EUR/MWh (6 rows)
- **INNER JOIN with aggregation**: Shows combined electricity market averages with CV prices

### 3. Best Performing Market in 2007
**Answer: IPEX with 70.99 EUR/MWh**

2007 Market Prices:
- IPEX: 70.99 EUR/MWh (highest)
- EPEX France: 40.88 EUR/MWh  
- OMEL: 39.35 EUR/MWh
- EPEX Germany: 37.99 EUR/MWh
- Nord Pool: 27.93 EUR/MWh (lowest)

### 4. Average Number of CV Traded (2006-2014)
**Answer: 3,281,139 CVs per year**

Calculation: Total 29,530,254 CVs across 9 years = 3,281,139.33 average

Year-by-year breakdown:
- 2006: 10,174 CVs
- 2007: 8,202 CVs  
- 2008: 753,163 CVs
- 2009: 6,071,112 CVs (peak year)
- 2010: 2,578,638 CVs
- 2011: 4,126,473 CVs
- 2012: 3,806,339 CVs
- 2013: 7,566,341 CVs
- 2014: 4,615,812 CVs

### 5. Years Where CV Price > Sum of Two Lowest Electricity Markets
**Answer: 2006 and 2007**

**2006:**
- CV Weighted Average Price: 110.40 EUR/MWh
- Two lowest electricity markets: Nord Pool (48.59) + EPEX France (49.29) = 97.88 EUR/MWh
- Difference: 110.40 - 97.88 = +12.52 EUR/MWh ✓

**2007:**
- CV Weighted Average Price: 120.19 EUR/MWh  
- Two lowest electricity markets: Nord Pool (27.93) + EPEX Germany (37.99) = 65.92 EUR/MWh
- Difference: 120.19 - 65.92 = +54.27 EUR/MWh ✓

All other years (2008-2013) had CV prices lower than the sum of their two lowest electricity market prices.

## Project Files (Clean Structure):
1. `table_setup.sql` - Database schema and data insertion (SQLite compatible)
2. `sql_queries.sql` - All SQL queries with integrated explanations (**MAIN FILE**)
3. `README.md` - This summary document
4. `Dockerfile` - Docker container for universal testing
5. `docker-test.bat` / `docker-test.sh` - Easy testing scripts

## Quick Start

### Option 1 - Docker Testing (Recommended):
```bash
# Windows (double-click or run in cmd)
docker-test.bat

# Linux/macOS/Git Bash
./docker-test.sh
```
**Note:** Docker scripts automatically build the image and run all tests.

### Option 2 - Direct SQLite:
```bash
# Create database and run queries manually
sqlite3 energy_market.db < table_setup.sql
sqlite3 energy_market.db

# In SQLite shell:
.read sql_queries.sql
```

## Docker Testing Environment

For system-independent testing, a complete Docker environment is included:

### How to use Docker:

#### Automatic Testing (One Command):
```bash
# On Windows
docker-test.bat

# On Linux/macOS/Git Bash
./docker-test.sh
```

Both scripts will:
1. **Build** the Docker image automatically
2. **Run** all SQL tests with validation
3. **Display** results and expected answers
4. **Report** success or failure

#### Manual Docker Commands (Advanced):
```bash
# 1. Build the image
docker build -t ark-energy-sql .

# 2. Run automatic test
docker run --rm ark-energy-sql ./auto_test.sh

# 3. Interactive shell (for exploration)
docker run -it --rm ark-energy-sql /bin/bash
```

### Docker Environment Benefits:
- ✅ **Universal Compatibility**: Works on Windows, macOS, Linux
- ✅ **Zero Setup**: SQLite preinstalled and configured
- ✅ **Automated Testing**: Built-in validation scripts
- ✅ **Clean Environment**: Isolated from host system
- ✅ **Simple Usage**: Just run one script and you're ready!

## Testing Instructions

1. **Clone/Download** the project files
2. **Choose your testing method**:
   - Docker (recommended): Run `docker-test.bat` or `./docker-test.sh`
   - Direct SQLite: Install SQLite and run setup/queries manually
3. **Validate results** against expected answers in this README
4. **Explore queries** in `sql_queries.sql` for detailed explanations

All queries are documented in English with expected results and explanations!
