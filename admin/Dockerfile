FROM node:18-bookworm-slim AS build
WORKDIR /app

COPY package.json package-lock.json ./
COPY shared ./shared
COPY server ./server
COPY client ./client
COPY admin ./admin

RUN npm ci
RUN npm run build -w admin

FROM nginx:alpine
COPY admin/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/admin/dist /usr/share/nginx/html
EXPOSE 80
