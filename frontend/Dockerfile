FROM node:18-alpine AS build

RUN apk add --no-cache git python3 make g++

WORKDIR /app

COPY package*.json ./
RUN npm install --legacy-peer-deps && npm cache clean --force

COPY . .
RUN npm run build

FROM nginx:alpine

RUN apk add --no-cache curl && rm -rf /var/cache/apk/*

COPY --from=build /app/build /usr/share/nginx/html

RUN cat > /etc/nginx/conf.d/default.conf << 'EOC'
server {
    listen 3000;
    server_name localhost;
    
    location / {
        root /usr/share/nginx/html;
        index index.html;
        try_files $uri $uri/ /index.html;
    }
    
    location /api {
        proxy_pass http://backend:5000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
EOC

EXPOSE 3000
CMD ["nginx", "-g", "daemon off;"]
