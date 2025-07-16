# Stage 1: Build React App
FROM node:18-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm install --legacy-peer-deps
COPY . .
RUN npm run build

# Stage 2: Nginx for production server
FROM nginx:stable-alpine

# Clean default Nginx page
RUN rm -rf /usr/share/nginx/html/*

# Copy React build to Nginx
COPY --from=builder /app/build /usr/share/nginx/html

# Expose frontend port
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
