FROM node:22-bookworm-slim AS build
WORKDIR /app

COPY package.json package-lock.json ./
COPY shared ./shared
COPY server ./server
COPY client ./client
COPY admin ./admin

RUN apt-get update && apt-get install -y --no-install-recommends python3 make g++ \
    && rm -rf /var/lib/apt/lists/*
RUN npm ci

WORKDIR /app
ENV NODE_ENV=production

WORKDIR /app/server
EXPOSE 4000
CMD ["node", "src/index.js"]
