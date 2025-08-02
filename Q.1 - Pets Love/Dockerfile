# Use official Node.js image as base
FROM node:18-alpine

# Set working directory in container
WORKDIR /app

# Copy project configuration files
COPY package.json tsconfig.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY src/ ./src/

# Compile TypeScript project
RUN npm run build

# Command to run the application
CMD ["npm", "start"]
