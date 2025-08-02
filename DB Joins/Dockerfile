# Dockerfile to test SQL queries - Ark Energy Interview
# Based on Alpine Linux with SQLite preinstalled
FROM alpine:3.18

# Install SQLite and bash to run scripts
RUN apk add --no-cache sqlite bash

# Create working directory
WORKDIR /app

# Copy all SQL files to container
COPY table_setup.sql .
COPY sql_queries.sql .

# Create script to run all tests
RUN echo '#!/bin/bash' > run_tests.sh && \
    echo 'echo "========================================"' >> run_tests.sh && \
    echo 'echo " DATABASE CREATION AND QUERY TESTING"' >> run_tests.sh && \
    echo 'echo "========================================"' >> run_tests.sh && \
    echo 'echo ""' >> run_tests.sh && \
    echo '# Remove existing database if present' >> run_tests.sh && \
    echo 'rm -f energy_market.db' >> run_tests.sh && \
    echo 'echo "[INFO] Creating database with test data..."' >> run_tests.sh && \
    echo 'sqlite3 energy_market.db < table_setup.sql' >> run_tests.sh && \
    echo 'echo "[OK] Database created successfully!"' >> run_tests.sh && \
    echo 'echo ""' >> run_tests.sh && \
    echo 'echo "========================================"' >> run_tests.sh && \
    echo 'echo " INTERACTIVE QUERY EXECUTION"' >> run_tests.sh && \
    echo 'echo "========================================"' >> run_tests.sh && \
    echo 'echo ""' >> run_tests.sh && \
    echo 'echo "[INFO] Database ready for testing!"' >> run_tests.sh && \
    echo 'echo "Available files:"' >> run_tests.sh && \
    echo 'ls -la *.sql *.db' >> run_tests.sh && \
    echo 'echo ""' >> run_tests.sh && \
    echo 'echo "To run queries manually:"' >> run_tests.sh && \
    echo 'echo "  sqlite3 energy_market.db"' >> run_tests.sh && \
    echo 'echo "  .read sql_queries.sql"' >> run_tests.sh && \
    echo 'echo ""' >> run_tests.sh && \
    echo 'echo "To run specific queries, use commands in SQLite shell"' >> run_tests.sh && \
    echo 'echo "Example: SELECT * FROM electricity_prices LIMIT 5;"' >> run_tests.sh && \
    chmod +x run_tests.sh

# Create script for complete automatic test
RUN echo '#!/bin/bash' > auto_test.sh && \
    echo 'echo "========================================"' >> auto_test.sh && \
    echo 'echo " COMPLETE AUTOMATIC TEST"' >> auto_test.sh && \
    echo 'echo "========================================"' >> auto_test.sh && \
    echo 'echo ""' >> auto_test.sh && \
    echo '# Setup database' >> auto_test.sh && \
    echo 'rm -f energy_market.db' >> auto_test.sh && \
    echo 'sqlite3 energy_market.db < table_setup.sql' >> auto_test.sh && \
    echo 'echo "[OK] Database created!"' >> auto_test.sh && \
    echo 'echo ""' >> auto_test.sh && \
    echo '# Test individual queries' >> auto_test.sh && \
    echo 'echo "[TEST 1] LEFT OUTER JOIN:"' >> auto_test.sh && \
    echo 'sqlite3 energy_market.db "SELECT ep.year, ep.ipex, gc.weighted_avg_price as cv_price FROM electricity_prices ep LEFT OUTER JOIN green_certificates gc ON ep.year = gc.year ORDER BY ep.year;"' >> auto_test.sh && \
    echo 'echo ""' >> auto_test.sh && \
    echo 'echo "[TEST 2] INNER JOIN:"' >> auto_test.sh && \
    echo 'sqlite3 energy_market.db "SELECT ep.year, ep.ipex, gc.weighted_avg_price as cv_price FROM electricity_prices ep INNER JOIN green_certificates gc ON ep.year = gc.year ORDER BY ep.year;"' >> auto_test.sh && \
    echo 'echo ""' >> auto_test.sh && \
    echo 'echo "[TEST 3] Best market 2007:"' >> auto_test.sh && \
    echo 'sqlite3 energy_market.db "SELECT market, price FROM (SELECT '\''IPEX'\'' as market, ipex as price FROM electricity_prices WHERE year = 2007 UNION ALL SELECT '\''EPEX Germany'\'', epex_germany FROM electricity_prices WHERE year = 2007 UNION ALL SELECT '\''Nord Pool'\'', nord_pool FROM electricity_prices WHERE year = 2007 UNION ALL SELECT '\''OMEL'\'', omel FROM electricity_prices WHERE year = 2007 UNION ALL SELECT '\''EPEX France'\'', epex_france FROM electricity_prices WHERE year = 2007) markets ORDER BY price DESC LIMIT 1;"' >> auto_test.sh && \
    echo 'echo ""' >> auto_test.sh && \
    echo 'echo "[TEST 4] Average CV 2006-2014:"' >> auto_test.sh && \
    echo 'sqlite3 energy_market.db "SELECT CAST(AVG(cvs_traded) AS INTEGER) as average_cv FROM green_certificates WHERE year BETWEEN 2006 AND 2014;"' >> auto_test.sh && \
    echo 'echo ""' >> auto_test.sh && \
    echo 'echo "[TEST 5] Years CV > two lowest markets:"' >> auto_test.sh && \
    echo 'sqlite3 energy_market.db "WITH comparison AS (SELECT ep.year, gc.weighted_avg_price as cv_price, (SELECT SUM(price) FROM (SELECT ipex as price FROM electricity_prices WHERE year = ep.year UNION ALL SELECT epex_germany FROM electricity_prices WHERE year = ep.year UNION ALL SELECT nord_pool FROM electricity_prices WHERE year = ep.year UNION ALL SELECT omel FROM electricity_prices WHERE year = ep.year UNION ALL SELECT epex_france FROM electricity_prices WHERE year = ep.year ORDER BY price ASC LIMIT 2)) as sum_two_lowest FROM electricity_prices ep INNER JOIN green_certificates gc ON ep.year = gc.year) SELECT year, ROUND(cv_price, 2) as cv_price, ROUND(sum_two_lowest, 2) as sum_two_lowest FROM comparison WHERE cv_price > sum_two_lowest ORDER BY year;"' >> auto_test.sh && \
    echo 'echo ""' >> auto_test.sh && \
    echo 'echo "========================================"' >> auto_test.sh && \
    echo 'echo " TEST COMPLETED SUCCESSFULLY"' >> auto_test.sh && \
    echo 'echo "========================================"' >> auto_test.sh && \
    chmod +x auto_test.sh

# Expose volume for potential file access
VOLUME ["/app"]

# Default command: setup database and interactive shell
CMD ["./run_tests.sh"]
