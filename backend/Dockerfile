FROM node:18-alpine

RUN apk add --no-cache \
    curl \
    wget \
    dumb-init \
    && rm -rf /var/cache/apk/*

WORKDIR /app

COPY package*.json ./
RUN npm install --legacy-peer-deps && \
    npm cache clean --force

COPY . .

RUN addgroup -g 1001 -S nodejs && \
    adduser -S agriza -u 1001 -G nodejs && \
    chown -R agriza:nodejs /app

USER agriza

EXPOSE 5000

ENTRYPOINT ["dumb-init", "--"]
CMD ["node", "app.js"]
