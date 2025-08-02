# Ark Energy Interview Codebase

## 🎯 Project Overview

This is a comprehensive **multi-component interview project** demonstrating different technical skills across **4 distinct challenges**. Each component showcases expertise in different technologies and approaches while maintaining consistent Docker-first architecture.

## 🏗️ Architecture Components

### Component Structure
```
shiny-octo-broccoli/
├── Q.1 - Pets Love/          # TypeScript state-space search algorithm
├── Q.2 - CMD App/CheckDay/   # C# .NET console application  
├── DB Joins/                 # SQL database queries and joins
├── Web App/                  # Angular frontend with Node.js backend
└── README.md                 # This file
```

Each component is **completely independent** with its own:
- ✅ Build system and dependencies
- ✅ Docker configuration 
- ✅ Test automation scripts
- ✅ Documentation and README

## 🚀 Quick Start Guide

### Prerequisites
- **Docker Desktop** installed and running
- **Git** for version control
- **PowerShell** (Windows) or **Bash** (Linux/macOS)

### Universal Test Command
Each component includes automated test scripts that **clean up existing containers/images** before running:

**Windows:**
```powershell
.\test-docker.bat
```

**Linux/macOS:**
```bash
./test-docker.sh
```

## 📋 Component Details

### 1. TypeScript Challenge: Pets Love (`Q.1 - Pets Love/`)

**🎯 Purpose:** State-space search algorithm implementation  
**🛠️ Tech Stack:** Node.js 20, TypeScript, Docker Alpine  
**🧩 Algorithm:** Depth-first search with memoization for vaccination scheduling

**Key Features:**
- Optimized DFS pathfinding algorithm
- Immutable state management
- Comprehensive error handling
- Clean separation of concerns (interfaces, models, solvers)

**Usage:**
```bash
cd "Q.1 - Pets Love"
.\test-docker.bat       # Windows
./test-docker.sh        # Linux/macOS
```

**📖 Documentation:** [Q.1 README](./Q.1%20-%20Pets%20Love/README.md)

---

### 2. C# Challenge: CheckDay (`Q.2 - CMD App/CheckDay/`)

**🎯 Purpose:** Console application with advanced date calculations  
**🛠️ Tech Stack:** .NET 8.0, C#, Docker multi-stage builds  
**🧩 Algorithm:** Custom date arithmetic using reference point calculations

**Key Features:**
- Cross-platform .NET 8.0 compatibility
- Comprehensive error handling for edge cases
- Leap year calculations and date validation
- Efficient single-file architecture

**Usage:**
```bash
cd "Q.2 - CMD App/CheckDay"
.\test-docker.bat       # Windows  
./test-docker.sh        # Linux/macOS
```

**📖 Documentation:** [Q.2 README](./Q.2%20-%20CMD%20App/CheckDay/README.md)

---

### 3. SQL Challenge: Database Joins (`DB Joins/`)

**🎯 Purpose:** Advanced SQL queries and JOIN operations  
**🛠️ Tech Stack:** SQLite, SQL, Docker with automated testing  
**🧩 Focus:** Complex market data analysis with comprehensive JOIN patterns

**Key Features:**
- Two-table schema (electricity_prices, green_certificates)
- All JOIN types: INNER, LEFT, RIGHT, FULL OUTER, CROSS
- Market analysis queries with aggregations
- Automated test validation

**Usage:**
```bash
cd "DB Joins"
docker-test.bat         # Windows
./docker-test.sh        # Linux/macOS
```

**📖 Documentation:** [DB Joins README](./DB%20Joins/README.md)

---

### 4. Web Application: Energy Market (`Web App/`)

**🎯 Purpose:** Full-stack web application with Angular frontend and Node.js backend  
**🛠️ Tech Stack:** Angular 20, Node.js 20, Express.js, SQLite, Docker multi-stage  
**🧩 Features:** Interactive dashboards, REST API, real-time market data

**Key Features:**
- Modern Angular 20 with standalone components
- RESTful API with comprehensive endpoints
- SQLite database integration
- Responsive design with modular architecture
- Multi-stage Docker builds for optimization

**Usage:**
```bash
cd "Web App"
.\test-docker.bat       # Windows
./test-docker.sh        # Linux/macOS
```

**📖 Documentation:** [Web App README](./Web%20App/README.md)

## 🔧 Development Workflows

### Docker-First Architecture
Every component follows **standardized Docker patterns**:

1. **🧹 Automatic Cleanup:** All test scripts clean existing containers/images
2. **🏗️ Multi-stage Builds:** Optimized for production deployment
3. **🔄 Consistent Commands:** Same script names across all components
4. **🐧 Cross-platform:** Windows `.bat` and Unix `.sh` variants

### Testing Strategy
```bash
# Individual component testing
cd "Q.1 - Pets Love" && .\test-docker.bat
cd "Q.2 - CMD App/CheckDay" && .\test-docker.bat  
cd "DB Joins" && .\docker-test.bat
cd "Web App" && .\test-docker.bat

# Each script automatically:
# 1. Cleans up existing Docker artifacts
# 2. Builds fresh Docker image
# 3. Runs comprehensive tests
# 4. Provides clear success/failure feedback
```

## 🎨 Code Quality Standards

### Consistent Coding Conventions
- **🔒 Private members:** Underscore prefix (`_privateMember`)
- **🌍 Language:** All code and documentation in English
- **📁 File organization:** Modular structure with separate files for types/classes
- **🏷️ Naming:** Descriptive, meaningful names following language conventions
- **🛡️ Type safety:** Explicit types, avoid `any`/`unknown`

### Git Commit Standards
Following **Conventional Commits** specification:
```
type(scope): description

Examples:
feat(pets): add depth-first search vaccination solver
fix(docker): resolve container cleanup in test scripts  
docs(readme): add comprehensive project documentation
```

## 🚀 Deployment Ready

All components are **production-ready** with:
- ✅ Dockerized deployments
- ✅ Health checks and monitoring
- ✅ Error handling and logging
- ✅ Cross-platform compatibility
- ✅ Automated testing pipelines

## 📚 Additional Resources

### Component Documentation
- [Pets Love Algorithm Details](./Q.1%20-%20Pets%20Love/README.md)
- [CheckDay Date Calculations](./Q.2%20-%20CMD%20App/CheckDay/README.md)  
- [SQL Joins and Queries](./DB%20Joins/README.md)
- [Web App Architecture](./Web%20App/README.md)

### Development Guidelines
- [Coding Standards](#-code-quality-standards)
- [Docker Best Practices](#docker-first-architecture)
- [Testing Strategies](#testing-strategy)

## 🤝 Getting Support

Each component includes:
- 📖 Comprehensive README with setup instructions
- 🐳 Docker configuration for consistent environments  
- 🧪 Automated test scripts with clear error messages
- 📝 Inline code documentation and comments

---

**Built with ❤️ for Ark Energy Technical Interview** | **Multi-platform • Docker-ready • Production-grade**
