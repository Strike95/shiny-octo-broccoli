-- SIMPLIFIED SQL QUERIES - Ark Energy Interview
-- Compatible with SQLite and standard databases

-- ==============================================
-- 1. OUTER JOINS EXAMPLES
-- ==============================================

-- LEFT OUTER JOIN: Shows all years from electricity_prices table,
-- even if there's no corresponding data in green_certificates
-- EXPECTED RESULT: 10 rows (2004-2013), with NULL for CV where no data exists
SELECT 
    ep.year,
    ep.ipex,
    gc.weighted_avg_price as cv_price,
    gc.cvs_traded
FROM electricity_prices ep
LEFT OUTER JOIN green_certificates gc ON ep.year = gc.year
ORDER BY ep.year;

-- RIGHT OUTER JOIN: Shows all years from green_certificates table,
-- even if there's no corresponding data in electricity_prices
-- For SQLite use LEFT JOIN with swapped tables
-- EXPECTED RESULT: 9 rows (2006-2014), with NULL for electricity in 2014
SELECT 
    gc.year,
    ep.ipex,
    gc.weighted_avg_price as cv_price,
    gc.cvs_traded
FROM green_certificates gc
LEFT OUTER JOIN electricity_prices ep ON gc.year = ep.year
ORDER BY gc.year;

-- FULL OUTER JOIN: Shows all years from both tables
-- Using UNION for SQLite compatibility
-- EXPECTED RESULT: 11 rows (2004-2014), with NULL where data doesn't overlap
SELECT 
    ep.year,
    ep.ipex,
    gc.weighted_avg_price as cv_price,
    gc.cvs_traded
FROM electricity_prices ep
LEFT JOIN green_certificates gc ON ep.year = gc.year
UNION
SELECT 
    gc.year,
    ep.ipex,
    gc.weighted_avg_price as cv_price,
    gc.cvs_traded
FROM green_certificates gc
LEFT JOIN electricity_prices ep ON gc.year = ep.year
WHERE ep.year IS NULL
ORDER BY year;

-- ==============================================
-- 2. INNER JOINS EXAMPLES
-- ==============================================

-- Basic INNER JOIN: Shows only years present in both tables
-- EXPECTED RESULT: 8 rows (2006-2013)
SELECT 
    ep.year,
    ep.ipex,
    gc.weighted_avg_price as cv_price,
    gc.cvs_traded
FROM electricity_prices ep
INNER JOIN green_certificates gc ON ep.year = gc.year
ORDER BY ep.year;

-- INNER JOIN with condition: Filters for CV price > 80 EUR/MWh
-- EXPECTED RESULT: 6 rows (years where CV > 80)
SELECT 
    ep.year,
    ep.ipex,
    gc.weighted_avg_price as cv_price
FROM electricity_prices ep
INNER JOIN green_certificates gc ON ep.year = gc.year
WHERE gc.weighted_avg_price > 80
ORDER BY ep.year;

-- ==============================================
-- 3. BEST PERFORMING MARKET IN 2007 (in terms of price)
-- ==============================================

-- Compares all electricity markets in 2007 and finds the one with highest price
-- EXPECTED RESULT: IPEX with 70.99 EUR/MWh
SELECT 
    market,
    price
FROM (
    SELECT 'IPEX' as market, ipex as price FROM electricity_prices WHERE year = 2007
    UNION ALL
    SELECT 'EPEX Germany', epex_germany FROM electricity_prices WHERE year = 2007
    UNION ALL  
    SELECT 'Nord Pool', nord_pool FROM electricity_prices WHERE year = 2007
    UNION ALL
    SELECT 'OMEL', omel FROM electricity_prices WHERE year = 2007
    UNION ALL
    SELECT 'EPEX France', epex_france FROM electricity_prices WHERE year = 2007
) markets
ORDER BY price DESC
LIMIT 1;

-- ==============================================
-- 4. AVERAGE CV TRADED IN PERIOD 2006-2014
-- ==============================================

-- Calculates the average of CV traded in years from 2006 to 2014
-- EXPECTED RESULT: 3,281,139 CV per year (average over 9 years)
SELECT 
    CAST(AVG(cvs_traded) AS INTEGER) as average_cv_traded,
    COUNT(*) as number_of_years,
    SUM(cvs_traded) as total_cv
FROM green_certificates
WHERE year BETWEEN 2006 AND 2014;

-- ==============================================
-- 5. YEARS WHERE CV PRICE > SUM OF TWO LOWEST ELECTRICITY MARKETS
-- ==============================================

-- For each year, compares the weighted average price of CV with 
-- the sum of the two electricity markets with lowest price
-- EXPECTED RESULT: Only 2006 and 2007 satisfy this condition
WITH annual_comparison AS (
    SELECT 
        ep.year,
        gc.weighted_avg_price as cv_price,
        -- Calculate sum of two lowest markets using a subquery
        (SELECT SUM(price) FROM (
            SELECT ipex as price FROM electricity_prices WHERE year = ep.year
            UNION ALL SELECT epex_germany FROM electricity_prices WHERE year = ep.year
            UNION ALL SELECT nord_pool FROM electricity_prices WHERE year = ep.year
            UNION ALL SELECT omel FROM electricity_prices WHERE year = ep.year
            UNION ALL SELECT epex_france FROM electricity_prices WHERE year = ep.year
            ORDER BY price ASC
            LIMIT 2
        )) as sum_two_lowest
    FROM electricity_prices ep
    INNER JOIN green_certificates gc ON ep.year = gc.year
)
SELECT 
    year,
    ROUND(cv_price, 2) as cv_price,
    ROUND(sum_two_lowest, 2) as sum_two_lowest,
    ROUND(cv_price - sum_two_lowest, 2) as difference
FROM annual_comparison
WHERE cv_price > sum_two_lowest
ORDER BY year;

-- ==============================================
-- SUMMARY OF EXPECTED RESULTS
-- ==============================================
/*
1. OUTER JOINS:
   - LEFT: 10 rows (all electricity years 2004-2013)
   - RIGHT: 9 rows (all CV years 2006-2014)
   - FULL: 11 rows (all combined years 2004-2014)

2. INNER JOINS: 8 rows (overlap 2006-2013)

3. BEST MARKET 2007: IPEX at 70.99 EUR/MWh

4. AVERAGE CV 2006-2014: 3,281,139 units/year

5. CV > TWO LOWEST MARKETS: 
   - 2006: CV 110.40 > 97.88 (Nord Pool + EPEX France)
   - 2007: CV 120.19 > 65.92 (Nord Pool + EPEX Germany)
*/
