const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Serve Angular static files
app.use(express.static(path.join(__dirname, 'public')));

// Database setup
const dbPath = path.join(__dirname, 'energy_market.db');
const db = new sqlite3.Database(dbPath);

// Helper functions for query building
/**
 * Build ORDER BY clause from query parameters
 * Design choice: Centralized sorting logic with SQL injection protection
 */
const buildOrderClause = (sortField, sortDirection, allowedFields) => {
  if (!sortField || !allowedFields.includes(sortField)) {
    return '';
  }
  
  const direction = sortDirection?.toUpperCase() === 'DESC' ? 'DESC' : 'ASC';
  return `ORDER BY ${sortField} ${direction}`;
};

/**
 * Build LIMIT and OFFSET clause from pagination parameters
 * Design choice: Consistent pagination across all endpoints
 */
const buildPaginationClause = (page, size) => {
  const pageNum = parseInt(page) || 0;
  const pageSize = Math.min(parseInt(size) || 10, 100); // Max 100 items per page
  const offset = pageNum * pageSize;
  
  return {
    limit: pageSize,
    offset: offset,
    clause: `LIMIT ${pageSize} OFFSET ${offset}`
  };
};

/**
 * Create paginated response structure
 * Design choice: Consistent response format for all paginated endpoints
 */
const createPaginatedResponse = (data, page, size, total) => {
  const pageNum = parseInt(page) || 0;
  const pageSize = parseInt(size) || 10;
  const totalPages = Math.ceil(total / pageSize);
  
  return {
    data,
    pagination: {
      page: pageNum,
      size: pageSize,
      total,
      totalPages,
      hasNext: pageNum < totalPages - 1,
      hasPrevious: pageNum > 0
    }
  };
};

// Initialize database with tables and data
const initDatabase = () => {
  // Drop existing tables
  db.serialize(() => {
    db.run(`DROP TABLE IF EXISTS electricity_prices`);
    db.run(`DROP TABLE IF EXISTS green_certificates`);

    // Create electricity_prices table
    db.run(`CREATE TABLE electricity_prices (
      year INTEGER PRIMARY KEY,
      ipex REAL,
      epex_germany REAL,
      nord_pool REAL,
      omel REAL,
      epex_france REAL
    )`);

    // Create green_certificates table
    db.run(`CREATE TABLE green_certificates (
      year INTEGER PRIMARY KEY,
      weighted_avg_price REAL,
      cvs_traded INTEGER,
      total_value_incl_vat INTEGER
    )`);

    // Insert electricity prices data
    const electricityData = [
      [2004, 51.60, 28.52, 28.91, 27.93, 28.13],
      [2005, 58.59, 45.97, 29.33, 53.67, 46.67],
      [2006, 74.75, 50.78, 48.59, 50.53, 49.29],
      [2007, 70.99, 37.99, 27.93, 39.35, 40.88],
      [2008, 86.99, 65.76, 44.73, 64.44, 69.15],
      [2009, 63.72, 38.85, 35.02, 36.96, 43.01],
      [2010, 64.12, 44.49, 53.06, 37.01, 47.50],
      [2011, 72.23, 51.12, 47.05, 49.93, 48.89],
      [2012, 75.48, 42.60, 31.20, 47.23, 46.94],
      [2013, 62.99, 37.78, 38.35, 44.26, 43.24]
    ];

    const electricityStmt = db.prepare(`INSERT INTO electricity_prices 
      (year, ipex, epex_germany, nord_pool, omel, epex_france) VALUES (?, ?, ?, ?, ?, ?)`);
    
    electricityData.forEach(row => {
      electricityStmt.run(row);
    });
    electricityStmt.finalize();

    // Insert green certificates data
    const certificatesData = [
      [2006, 110.40, 10174, 1123180],
      [2007, 120.19, 8202, 985787],
      [2008, 77.87, 753163, 58648028],
      [2009, 88.46, 6071112, 537022379],
      [2010, 84.41, 2578638, 217670600],
      [2011, 82.25, 4126473, 339386028],
      [2012, 76.13, 3806339, 289787555],
      [2013, 83.73, 7566341, 633505717],
      [2014, 90.96, 4615812, 419836791]
    ];

    const certificatesStmt = db.prepare(`INSERT INTO green_certificates 
      (year, weighted_avg_price, cvs_traded, total_value_incl_vat) VALUES (?, ?, ?, ?)`);
    
    certificatesData.forEach(row => {
      certificatesStmt.run(row);
    });
    certificatesStmt.finalize();
  });
};

// API Routes

// Get all electricity prices (backward compatible)
app.get('/api/electricity-prices', (req, res) => {
  const { sortField, sortDirection } = req.query;
  const allowedFields = ['year', 'ipex', 'epex_germany', 'nord_pool', 'omel', 'epex_france'];
  
  const orderClause = buildOrderClause(sortField, sortDirection, allowedFields) || 'ORDER BY year';
  const query = `SELECT * FROM electricity_prices ${orderClause}`;
  
  db.all(query, (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

// Get electricity prices with pagination
app.get('/api/electricity-prices/paginated', (req, res) => {
  const { sortField, sortDirection, page, size } = req.query;
  const allowedFields = ['year', 'ipex', 'epex_germany', 'nord_pool', 'omel', 'epex_france'];
  
  const orderClause = buildOrderClause(sortField, sortDirection, allowedFields) || 'ORDER BY year';
  const pagination = buildPaginationClause(page, size);
  
  // Get total count
  db.get('SELECT COUNT(*) as count FROM electricity_prices', (err, countResult) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    
    const total = countResult.count;
    const query = `SELECT * FROM electricity_prices ${orderClause} ${pagination.clause}`;
    
    db.all(query, (err, rows) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      
      const response = createPaginatedResponse(rows, page, size, total);
      res.json(response);
    });
  });
});

// Get all green certificates (backward compatible)
app.get('/api/green-certificates', (req, res) => {
  const { sortField, sortDirection } = req.query;
  const allowedFields = ['year', 'weighted_avg_price', 'cvs_traded', 'total_value_incl_vat'];
  
  const orderClause = buildOrderClause(sortField, sortDirection, allowedFields) || 'ORDER BY year';
  const query = `SELECT * FROM green_certificates ${orderClause}`;
  
  db.all(query, (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

// Get green certificates with pagination
app.get('/api/green-certificates/paginated', (req, res) => {
  const { sortField, sortDirection, page, size } = req.query;
  const allowedFields = ['year', 'weighted_avg_price', 'cvs_traded', 'total_value_incl_vat'];
  
  const orderClause = buildOrderClause(sortField, sortDirection, allowedFields) || 'ORDER BY year';
  const pagination = buildPaginationClause(page, size);
  
  // Get total count
  db.get('SELECT COUNT(*) as count FROM green_certificates', (err, countResult) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    
    const total = countResult.count;
    const query = `SELECT * FROM green_certificates ${orderClause} ${pagination.clause}`;
    
    db.all(query, (err, rows) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
    }
      
      const response = createPaginatedResponse(rows, page, size, total);
      res.json(response);
    });
  });
});

// Get market comparison for a specific year
app.get('/api/market-comparison/:year', (req, res) => {
  const year = req.params.year;
  const query = `
    SELECT 
      'IPEX' as market, ipex as price FROM electricity_prices WHERE year = ?
    UNION ALL
    SELECT 'EPEX Germany', epex_germany FROM electricity_prices WHERE year = ?
    UNION ALL  
    SELECT 'Nord Pool', nord_pool FROM electricity_prices WHERE year = ?
    UNION ALL
    SELECT 'OMEL', omel FROM electricity_prices WHERE year = ?
    UNION ALL
    SELECT 'EPEX France', epex_france FROM electricity_prices WHERE year = ?
    ORDER BY price DESC
  `;
  
  db.all(query, [year, year, year, year, year], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

// Get combined data (LEFT JOIN) - backward compatible
app.get('/api/combined-data', (req, res) => {
  const { sortField, sortDirection } = req.query;
  const allowedFields = ['year', 'ipex', 'epex_germany', 'nord_pool', 'omel', 'epex_france', 'cv_price', 'cvs_traded', 'total_value_incl_vat'];
  
  const orderClause = buildOrderClause(sortField, sortDirection, allowedFields) || 'ORDER BY ep.year';
  
  const query = `
    SELECT 
      ep.year,
      ep.ipex,
      ep.epex_germany,
      ep.nord_pool,
      ep.omel,
      ep.epex_france,
      gc.weighted_avg_price as cv_price,
      gc.cvs_traded,
      gc.total_value_incl_vat
    FROM electricity_prices ep
    LEFT OUTER JOIN green_certificates gc ON ep.year = gc.year
    ${orderClause}
  `;
  
  db.all(query, (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

// Get combined data with pagination
app.get('/api/combined-data/paginated', (req, res) => {
  const { sortField, sortDirection, page, size } = req.query;
  const allowedFields = ['year', 'ipex', 'epex_germany', 'nord_pool', 'omel', 'epex_france', 'cv_price', 'cvs_traded', 'total_value_incl_vat'];
  
  const orderClause = buildOrderClause(sortField, sortDirection, allowedFields) || 'ORDER BY ep.year';
  const pagination = buildPaginationClause(page, size);
  
  // Get total count
  const countQuery = `
    SELECT COUNT(*) as count 
    FROM electricity_prices ep
    LEFT OUTER JOIN green_certificates gc ON ep.year = gc.year
  `;
  
  db.get(countQuery, (err, countResult) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    
    const total = countResult.count;
    const query = `
      SELECT 
        ep.year,
        ep.ipex,
        ep.epex_germany,
        ep.nord_pool,
        ep.omel,
        ep.epex_france,
        gc.weighted_avg_price as cv_price,
        gc.cvs_traded,
        gc.total_value_incl_vat
      FROM electricity_prices ep
      LEFT OUTER JOIN green_certificates gc ON ep.year = gc.year
      ${orderClause}
      ${pagination.clause}
    `;
    
    db.all(query, (err, rows) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      
      const response = createPaginatedResponse(rows, page, size, total);
      res.json(response);
    });
  });
});

// Get years with both electricity and CV data (INNER JOIN)
app.get('/api/overlapping-data', (req, res) => {
  const query = `
    SELECT 
      ep.year,
      ep.ipex,
      gc.weighted_avg_price as cv_price,
      gc.cvs_traded
    FROM electricity_prices ep
    INNER JOIN green_certificates gc ON ep.year = gc.year
    ORDER BY ep.year
  `;
  
  db.all(query, (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

// Get filtered CV data (CV price > 80)
app.get('/api/high-cv-prices', (req, res) => {
  const query = `
    SELECT 
      ep.year,
      ep.ipex,
      gc.weighted_avg_price as cv_price
    FROM electricity_prices ep
    INNER JOIN green_certificates gc ON ep.year = gc.year
    WHERE gc.weighted_avg_price > 80
    ORDER BY ep.year
  `;
  
  db.all(query, (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Energy Market API is running' });
});

// Angular fallback - serve index.html for all non-API routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/index.html'));
});

// Initialize database and start server
initDatabase();

app.listen(PORT, () => {
  console.log(`[INFO] Energy Market API server running on port ${PORT}`);
  console.log(`[INFO] Available endpoints:`);
  console.log(`[INFO]   GET /api/electricity-prices`);
  console.log(`[INFO]   GET /api/electricity-prices/paginated`);
  console.log(`[INFO]   GET /api/green-certificates`);
  console.log(`[INFO]   GET /api/green-certificates/paginated`);
  console.log(`[INFO]   GET /api/market-comparison/:year`);
  console.log(`[INFO]   GET /api/combined-data`);
  console.log(`[INFO]   GET /api/combined-data/paginated`);
  console.log(`[INFO]   GET /api/overlapping-data`);
  console.log(`[INFO]   GET /api/high-cv-prices`);
  console.log(`[INFO]   GET /api/health`);
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log(`[INFO] Shutting down server...`);
  db.close((err) => {
    if (err) {
      console.error(`[ERROR] Error closing database:`, err.message);
    } else {
      console.log(`[SUCCESS] Database connection closed.`);
    }
    process.exit(0);
  });
});
