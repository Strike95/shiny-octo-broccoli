-- SQLite Database Setup - Creates fresh database every time
-- Remove existing database file if it exists
-- Run with: sqlite3 energy_market.db < table_setup.sql

-- Drop tables if they exist (for fresh start)
DROP TABLE IF EXISTS electricity_prices;
DROP TABLE IF EXISTS green_certificates;

-- Table 1: Electricity Prices (€/MWh)
-- SQLite uses REAL for decimal numbers
CREATE TABLE electricity_prices (
    year INTEGER PRIMARY KEY,
    ipex REAL,
    epex_germany REAL,
    nord_pool REAL,
    omel REAL,
    epex_france REAL
);

-- Insert data for Electricity Prices
INSERT INTO electricity_prices (year, ipex, epex_germany, nord_pool, omel, epex_france) VALUES
(2004, 51.60, 28.52, 28.91, 27.93, 28.13),
(2005, 58.59, 45.97, 29.33, 53.67, 46.67),
(2006, 74.75, 50.78, 48.59, 50.53, 49.29),
(2007, 70.99, 37.99, 27.93, 39.35, 40.88),
(2008, 86.99, 65.76, 44.73, 64.44, 69.15),
(2009, 63.72, 38.85, 35.02, 36.96, 43.01),
(2010, 64.12, 44.49, 53.06, 37.01, 47.50),
(2011, 72.23, 51.12, 47.05, 49.93, 48.89),
(2012, 75.48, 42.60, 31.20, 47.23, 46.94),
(2013, 62.99, 37.78, 38.35, 44.26, 43.24);

-- Table 2: Green Certificates (CV)
-- SQLite uses INTEGER for big integers
CREATE TABLE green_certificates (
    year INTEGER PRIMARY KEY,
    weighted_avg_price REAL,
    cvs_traded INTEGER,
    total_value_incl_vat INTEGER
);

-- Insert data for Green Certificates
INSERT INTO green_certificates (year, weighted_avg_price, cvs_traded, total_value_incl_vat) VALUES
(2006, 110.40, 10174, 1123180),
(2007, 120.19, 8202, 985787),
(2008, 77.87, 753163, 58648028),
(2009, 88.46, 6071112, 537022379),
(2010, 84.41, 2578638, 217670600),
(2011, 82.25, 4126473, 339386028),
(2012, 76.13, 3806339, 289787555),
(2013, 83.73, 7566341, 633505717),
(2014, 90.96, 4615812, 419836791);

-- Verify data insertion
SELECT 'Electricity Prices Rows:' as info;
SELECT COUNT(*) as total_rows FROM electricity_prices;
SELECT 'Green Certificates Rows:' as info;
SELECT COUNT(*) as total_rows FROM green_certificates;
