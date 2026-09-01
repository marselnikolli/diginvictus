FROM node:18-bookworm-slim AS build
WORKDIR /app

COPY package.json package-lock.json ./
COPY shared ./shared
COPY server ./server
COPY client ./client
COPY admin ./admin

RUN npm ci
RUN npm run build -w client

FROM nginx:alpine
COPY client/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/client/dist /usr/share/nginx/html
EXPOSE 80
