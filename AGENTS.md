# Healify Microservices — Agent Guide

## Project structure

3 microservices under `services/`, each with its own PostgreSQL DB + Sequelize ORM.

| Service | Port | DB port (Docker) | Internal HTTP targets |
|---------|------|------------------|-----------------------|
| `doctor-service` | 4001 | 5432 | — |
| `patient-service` | 4002 | 5433 | — |
| `appointment-service` | 4003 | 5434 | `doctor-service:4001`, `patient-service:4002` |

## How to run

**Docker (recommended):** `docker-compose up -d --build` from repo root.  
**Local dev:** For each service, `cp .env.example .env`, `npm install`, then `npm start` or `npm run dev` (nodemon).  
Stop: `docker-compose down -v` (the `-v` drops DB volumes).

Each service entrypoint is `src/app.js`. All services call `sequelize.sync()` on startup — no migration step needed.

## Key code conventions

- **CommonJS** modules throughout (no ESM).
- Every service shares the same layered structure: `config/` → `domain/entities/` → `services/` → `controllers/` → `routes/` → `middleware/` → `validators/`.
- Sequelize models defined in `domain/entities/`, associations in `domain/index.js`.
- Routes are grouped under `/api` in each service. Route files use `const { Router } = require('express')`.
- Models use UUID primary keys (`DataTypes.UUIDV4`), `snake_case` for `field` names.
- Validation uses `express-validator` arrays + a `validate` middleware wrapper.
- Error handling: a single `errorHandler` middleware catches Sequelize errors and returns JSON.

## Inter-service communication

`appointment-service` calls `doctor-service` and `patient-service` via **axios** (configured in `src/services/serviceClients.js`, 5s timeout).  
Service URLs swap between Docker hostnames and `localhost` depending on env.

## Testing

No test framework or test files exist. Root `package.json` has a placeholder `"test": "echo \\"Error: no test specified\\" && exit 1"`.

## DB notes

- Migrations dirs and seeders dirs exist but are empty. Schema is managed via Sequelize model `sync()` at startup.
- `.sequelizerc` is present but unused (models-path points to `domain/entities/`).
- `appointment-service` does DB-level conflict check on create (no duplicate non-cancelled slots per doctor/date/time).

## Auth

`patient-service` uses JWT (`jsonwebtoken` + `bcrypt`). Protected routes validate via `middleware/auth.js` (Bearer token). Other services have no auth.

## Stack

Node.js 18 + Express 4 + Sequelize 6 + pg 8 + PostgreSQL 15 (alpine). `appointment-service` additionally uses axios. All services use `dotenv`, `cors`, `express-validator`, `uuid`.

## What's not here

- No CI workflows
- No lint/format/typecheck config
- No codegen or build step
