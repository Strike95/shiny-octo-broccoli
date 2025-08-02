# Energy Market Dashboard - Angular 20 Web Application

A responsive web application built with Angular 20, Bootstrap 5, and Node.js that provides comprehensive analysis of European electricity markets and green certificate trading data.

## 🚀 Features

### Three Main Sections (Accessible via Navigation Menu)

1. **Electricity Prices** (`/electricity-prices`)
   - Historical electricity prices across 5 major European markets
   - IPEX (Italy), EPEX (Germany/France), Nord Pool (Nordic), OMEL (Spain)
   - Interactive data tables with responsive design

2. **Green Certificates** (`/green-certificates`)
   - Green certificate (CV) trading data from 2006-2014
   - Weighted average prices, trading volumes, and market values
   - Statistical analysis including peak trading years

3. **Market Analysis** (`/market-analysis`)
   - Combined market data using SQL JOINs
   - Market comparison for specific years (e.g., 2007)
   - Overlapping data analysis and advanced filtering

### 📱 Responsive Design
- **Bootstrap 5 Grid System**: Works on desktop, tablet, and mobile
- **Custom Responsive Tables**: Mobile-friendly table rendering
- **Flexible Navigation**: Collapsible navbar for mobile devices

## 🚦 Getting Started

### Development Setup

1. **Start the API Server**
```bash
cd server
npm install
npm start
# Server runs on http://localhost:3000
```

2. **Start Angular Development Server**
```bash
npm install
npm start
# Application runs on http://localhost:4200
```

### 🐳 Docker Deployment

**Quick Test (Windows):**
```cmd
test-docker.bat
```

**Quick Test (Unix/Linux):**
```bash
chmod +x test-docker.sh
./test-docker.sh
```

## 🛠️ Technology Stack

- **Frontend**: Angular 20 (Zoneless), TypeScript, Bootstrap 5
- **Backend**: Node.js, Express.js, SQLite3, CORS
- **Styling**: SCSS, Bootstrap Grid System
- **Build**: Angular CLI, npm
- **Deployment**: Docker (multi-stage build)

## 📊 API Endpoints

```
GET /api/health                    # Server health check
GET /api/electricity-prices        # All electricity prices
GET /api/green-certificates        # All green certificate data
GET /api/market-comparison/:year    # Market comparison for specific year
GET /api/combined-data             # LEFT JOIN of both tables
GET /api/overlapping-data          # INNER JOIN of both tables
```

## 🏗️ Architecture

### Design System Layer
- **`ds-card`**: Flexible card component
- **`ds-data-table`**: Feature-rich data table with formatting
- **`ds-loading-spinner`**: Configurable loading indicators
- **`ds-error-message`**: Consistent error display

### Feature Modules
- **Home**: Dashboard with navigation to all sections
- **Electricity Prices**: Market price analysis
- **Green Certificates**: CV trading data analysis  
- **Market Analysis**: Advanced SQL join analysis

### Clean Architecture
```
src/app/
├── design-system/     # Reusable UI components
├── features/          # Feature modules  
├── core/              # Services and core functionality
├── shared/            # Shared components and models
└── app.routes.ts      # Routing configuration
```

## 🏆 Success Criteria ✅

- ✅ **Three sections with menu navigation**
- ✅ **Responsive Bootstrap grid system**
- ✅ **Bootstrap components and styling**
- ✅ **Node.js server with same DB/endpoints as DB Joins**
- ✅ **Design system → Features → Routes architecture**
- ✅ **Macro components using design system elements**

Built with Angular 20, Bootstrap 5, and modern web technologies.
