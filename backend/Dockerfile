# Use official Node.js base image
FROM node:18

# Set working directory
WORKDIR /app

# Copy package files first for caching
COPY package*.json ./

# Install dependencies
RUN npm install --production --legacy-peer-deps

# Copy application code
COPY . .

# Expose the backend port
EXPOSE 3005


CMD ["npm", "run", "start"]
