# Multi-stage Dockerfile for Energy Market Web Application
# This builds both Angular frontend and Node.js backend with SQLite

# Stage 1: Build Angular application
FROM node:20-alpine AS angular-builder

WORKDIR /app

# Copy package files for frontend
COPY package*.json ./
RUN npm ci

# Copy source code and build Angular app
COPY . .
RUN npm run build

# Stage 2: Node.js server with SQLite and Angular frontend
FROM node:20-alpine

WORKDIR /app

# Install SQLite and curl
RUN apk add --no-cache sqlite curl

# Copy and install server dependencies
COPY server/package*.json ./
RUN npm ci --only=production

# Copy server source code
COPY server/server.js ./

# Copy built Angular app from Stage 1 (browser subdirectory contains the actual files)
COPY --from=angular-builder /app/dist/energy-market/browser /app/public

# Create a startup script
RUN echo '#!/bin/sh' > start.sh && \
    echo 'echo "[INFO] Starting Energy Market Web Application..."' >> start.sh && \
    echo 'echo "[INFO] Angular app will be served at http://localhost:3000"' >> start.sh && \
    echo 'echo "[INFO] API endpoints available at http://localhost:3000/api/*"' >> start.sh && \
    echo 'node server.js' >> start.sh && \
    chmod +x start.sh

# Expose port 3000
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3000/api/health || exit 1

# Start the combined server
CMD ["./start.sh"]
