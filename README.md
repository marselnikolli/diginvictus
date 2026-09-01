# DIGInvictus

Corporate website, admin panel, and API server for DIGInvictus.

## Stack

- **Client** – React 18 + Vite (public website)
- **Admin** – React 18 + Vite (content management panel)
- **Server** – Express + better-sqlite3 (REST API, JWT auth, file uploads)
- **Shared** – shared constants/schemas between apps

## Project structure

```
.
├── client/   # Public-facing website
├── admin/    # Admin panel
├── server/   # Express API server
├── shared/   # Shared code
├── docker-compose.yml
└── package.json  # npm workspaces
```

## Getting started

### Prerequisites

- Node.js 18+
- npm

### Local development

```bash
npm install
npm run dev:server   # API on http://localhost:4000
npm run dev:client   # Website on http://localhost:5173
npm run dev:admin    # Admin panel on http://localhost:5174
```

### Production build

```bash
npm run build   # builds client + admin
npm start       # starts the server
```

### Docker

```bash
docker compose up --build
```

Services:

| Service | Port | URL |
|---------|------|-----|
| client  | 8080 | http://localhost:8080 |
| admin   | 8081 | http://localhost:8081 |
| server  | 4000 | http://localhost:4000 |

## Configuration

Copy `.env.example` to `.env` and adjust as needed:

- `ADMIN_EMAIL` / `ADMIN_PASSWORD` – admin panel credentials
- `JWT_SECRET` – secret used to sign auth tokens
- `SERVER_PORT` / `CLIENT_PORT` / `ADMIN_PORT` – host ports for Docker

## License

Proprietary.
